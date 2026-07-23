import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, PRODUCTS_BUCKET } from '../lib/supabaseClient.js'

const EMPTY_FORM = {
  id: null,
  name: '',
  description: '',
  price: '',
  cacao_percentage: '',
  is_available: true,
  image_url: '',
}

export default function Admin() {
  const [session, setSession] = useState(undefined) // undefined = cargando, null = sin sesión
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) navigate('/admin/login')
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      if (!newSession) navigate('/admin/login')
    })
    return () => sub.subscription.unsubscribe()
  }, [navigate])

  useEffect(() => {
    if (session) loadProducts()
  }, [session])

  async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setProducts(data)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  function startEdit(product) {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price ?? '',
      cacao_percentage: product.cacao_percentage ?? '',
      is_available: product.is_available,
      image_url: product.image_url || '',
    })
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setForm(EMPTY_FORM)
    setImageFile(null)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Producto eliminado.' })
      loadProducts()
    }
  }

  async function uploadImageIfNeeded() {
    if (!imageFile) return form.image_url || null
    const ext = imageFile.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from(PRODUCTS_BUCKET)
      .upload(path, imageFile, { cacheControl: '3600', upsert: false })
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from(PRODUCTS_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    try {
      const image_url = await uploadImageIfNeeded()

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: form.price === '' ? null : Number(form.price),
        cacao_percentage:
          form.cacao_percentage === '' ? null : Number(form.cacao_percentage),
        is_available: form.is_available,
        image_url,
      }

      let error
      if (form.id) {
        ;({ error } = await supabase.from('products').update(payload).eq('id', form.id))
      } else {
        ;({ error } = await supabase.from('products').insert(payload))
      }

      if (error) throw error

      setMessage({ type: 'success', text: form.id ? 'Producto actualizado.' : 'Producto creado.' })
      resetForm()
      loadProducts()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (session === undefined) {
    return <div className="min-h-screen bg-cacao-950" />
  }

  return (
    <div className="min-h-screen bg-cacao-950 grain-bg font-body text-cream-100">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-display text-lg text-cream-100">Panel administrativo</span>
        <button
          onClick={handleLogout}
          className="font-body text-sm text-cream-200/70 hover:text-gold-400 transition-colors"
        >
          Cerrar sesión
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <form
          onSubmit={handleSubmit}
          className="mb-12 rounded-2xl border border-cacao-700/60 bg-cacao-900 p-6 sm:p-8"
        >
          <h2 className="font-display text-xl text-cream-100">
            {form.id ? 'Editar producto' : 'Nuevo producto'}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Nombre">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </Field>

            <Field label="Precio (USD)">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input"
              />
            </Field>

            <Field label="Porcentaje de cacao (%)">
              <input
                type="number"
                min="0"
                max="100"
                value={form.cacao_percentage}
                onChange={(e) => setForm({ ...form, cacao_percentage: e.target.value })}
                className="input"
              />
            </Field>

            <Field label="Disponible">
              <select
                value={form.is_available ? 'si' : 'no'}
                onChange={(e) => setForm({ ...form, is_available: e.target.value === 'si' })}
                className="input"
              >
                <option value="si">Sí, mostrar en la tienda</option>
                <option value="no">No, ocultar</option>
              </select>
            </Field>

            <Field label="Descripción" full>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input"
              />
            </Field>

            <Field label="Imagen del producto" full>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-cream-200/70 file:mr-4 file:rounded-full file:border-0 file:bg-gold-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-cacao-950 hover:file:bg-gold-400"
              />
              {form.image_url && !imageFile && (
                <img
                  src={form.image_url}
                  alt="Imagen actual"
                  className="mt-3 h-32 w-32 rounded-lg object-cover"
                />
              )}
            </Field>
          </div>

          {message && (
            <p className={`mt-4 text-sm ${message.type === 'error' ? 'text-red-400' : 'text-gold-400'}`}>
              {message.text}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-medium text-cacao-950 hover:bg-gold-400 disabled:opacity-60"
            >
              {saving ? 'Guardando…' : form.id ? 'Guardar cambios' : 'Crear producto'}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-cacao-700 px-6 py-2.5 text-sm text-cream-200/70 hover:border-gold-500 hover:text-gold-400"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        <h2 className="mb-4 font-display text-xl text-cream-100">Productos ({products.length})</h2>
        <div className="overflow-hidden rounded-2xl border border-cacao-700/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-cacao-900 text-cream-200/60">
              <tr>
                <th className="px-4 py-3">Imagen</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">% Cacao</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-cacao-700/60 bg-cacao-950">
                  <td className="px-4 py-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <span className="text-cream-200/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-cream-100">{p.name}</td>
                  <td className="px-4 py-3 text-cream-200/70">
                    {p.price != null ? `$${Number(p.price).toFixed(2)}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-cream-200/70">
                    {p.cacao_percentage != null ? `${p.cacao_percentage}%` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        p.is_available
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'bg-cream-200/10 text-cream-200/50'
                      }`}
                    >
                      {p.is_available ? 'Visible' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => startEdit(p)}
                      className="mr-3 text-gold-400 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-cream-200/50">
                    Aún no has creado productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function Field({ label, children, full = false }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-xs uppercase tracking-widest2 text-gold-500">
        {label}
      </label>
      {children}
    </div>
  )
}

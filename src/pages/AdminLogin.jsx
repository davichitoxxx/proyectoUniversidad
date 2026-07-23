import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cacao-950 grain-bg px-6 font-body">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-cacao-700/60 bg-cacao-900 p-8"
      >
        <a href="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-cream-200/60 hover:text-gold-400 transition-colors"
        >
          ← Volver a la tienda
        </a>

        <h1 className="font-display text-2xl text-cream-100">Panel administrativo</h1>
        <p className="mt-1 text-sm text-cream-200/60">Inicia sesión para gestionar el catálogo.</p>

        <label className="mt-6 block text-xs uppercase tracking-widest2 text-gold-500">
          Correo
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg border border-cacao-700 bg-cacao-950 px-4 py-2.5 text-cream-100 outline-none focus:border-gold-500"
        />

        <label className="mt-4 block text-xs uppercase tracking-widest2 text-gold-500">
          Contraseña
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-cacao-700 bg-cacao-950 px-4 py-2.5 text-cream-100 outline-none focus:border-gold-500"
        />

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gold-500 py-2.5 text-sm font-medium text-cacao-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}

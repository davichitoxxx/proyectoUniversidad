import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import ProductCard from '../components/ProductCard.jsx'
import { WhatsAppFloatingButton } from '../components/WhatsAppButton.jsx'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadProducts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      if (!active) return
      if (error) {
        setError(error.message)
      } else {
        setProducts(data)
      }
      setLoading(false)
    }

    loadProducts()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-cacao-950 grain-bg font-body text-cream-100">
      <Header />
      <Hero />

      <main id="productos" className="mx-auto max-w-6xl px-6 pb-28 pt-8 sm:pt-12">
        <div className="mb-10 flex items-end justify-between border-b border-cacao-700/60 pb-4">
          <div>
            <p className="font-body text-xs tracking-widest2 uppercase text-gold-500">
              Catálogo
            </p>
            <h2 className="mt-2 font-display text-3xl text-cream-100">
              Nuestros cacaos
            </h2>
          </div>
          {!loading && (
            <span className="font-body text-sm text-cream-200/60">
              {products.length} {products.length === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </div>

        {loading && <StateMessage text="Cargando productos…" />}
        {error && (
          <StateMessage text={`No se pudieron cargar los productos: ${error}`} />
        )}
        {!loading && !error && products.length === 0 && (
          <StateMessage text="Todavía no hay productos disponibles. Vuelve pronto." />
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  )
}

function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <span className="font-display text-lg tracking-wide text-cream-100">
        Cacao<span className="text-gold-500">.</span>Amargo
      </span>
      
      <a  href="#productos"
        className="font-body text-sm text-cream-200/70 hover:text-gold-400 transition-colors"
      >
        Ver catálogo
      </a>
    </header>
  )
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-6 pb-16 sm:pt-14 sm:pb-24">
      <p className="font-body text-xs tracking-widest2 uppercase text-gold-500">
        Origen · Tueste · Lote pequeño
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.1] text-cream-50 sm:text-6xl">
        El amargor real del cacao, sin nada que lo disfrace.
      </h1>
      <p className="mt-5 max-w-xl font-body text-base text-cream-200/70 leading-relaxed sm:text-lg">
        Seleccionamos, tostamos y elaboramos cada lote a mano. Cada producto
        indica su porcentaje de cacao, para que sepas exactamente qué llevas.
      </p>
      <a
        href="#productos"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 font-body text-sm font-medium text-cacao-950 transition-colors hover:bg-gold-400"
      >
        Explorar productos
      </a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-cacao-700/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 font-body text-xs text-cream-200/50">
        <span>© {new Date().getFullYear()} Cacao Amargo. Hecho en pequeños lotes.</span>
        <a href="/admin" className="hover:text-gold-400 transition-colors">
          Admin
        </a>
      </div>
    </footer>
  )
}

function StateMessage({ text }) {
  return (
    <div className="rounded-xl border border-cacao-700/60 bg-cacao-900/60 px-6 py-14 text-center font-body text-sm text-cream-200/60">
      {text}
    </div>
  )
}

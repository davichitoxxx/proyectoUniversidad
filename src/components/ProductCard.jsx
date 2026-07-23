import { WhatsAppBuyButton } from './WhatsAppButton.jsx'

export default function ProductCard({ product }) {
  const { name, description, price, image_url, cacao_percentage } = product

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-cacao-900 border border-cacao-700/60 transition-colors hover:border-gold-500/50">
      <div className="relative aspect-[4/5] overflow-hidden bg-cacao-800">
        {image_url ? (
          <img
            src={image_url}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-cacao-500 font-body text-sm">
            Sin imagen
          </div>
        )}

        {typeof cacao_percentage === 'number' && (
          <div className="absolute top-3 left-3 rounded-full bg-cacao-950/80 backdrop-blur px-3 py-1 text-xs font-body tracking-wide text-gold-400 border border-gold-500/40">
            {cacao_percentage}% cacao
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-xl text-cream-100">{name}</h3>
          {description && (
            <p className="mt-1.5 font-body text-sm text-cream-200/70 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Barra de amargor: representación visual del % de cacao, no decorativa */}
        {typeof cacao_percentage === 'number' && (
          <div className="w-full h-1.5 rounded-full bg-cacao-800 overflow-hidden">
            <div
              className="h-full bg-gold-500"
              style={{ width: `${Math.min(cacao_percentage, 100)}%` }}
            />
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {typeof price === 'number' && (
            <span className="font-display text-lg text-gold-400">
              ${price.toFixed(2)}
            </span>
          )}
          <WhatsAppBuyButton productName={name} />
        </div>
      </div>
    </article>
  )
}

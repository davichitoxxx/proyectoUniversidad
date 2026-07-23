const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '593999999999'

function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
}

/**
 * Botón flotante fijo, visible en toda la tienda.
 */
export function WhatsAppFloatingButton() {
  const link = buildWhatsAppLink('Hola, quiero saber más sobre sus cacaos amargos.')
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gold-500 px-5 py-3.5 text-cacao-950 font-body font-medium shadow-lg shadow-black/40 transition-transform hover:scale-105 hover:bg-gold-400"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Escríbenos</span>
    </a>
  )
}

/**
 * Botón de compra por producto, dirige a WhatsApp con el nombre del producto
 * ya escrito en el mensaje.
 */
export function WhatsAppBuyButton({ productName, className = '' }) {
  const link = buildWhatsAppLink(`Hola, quiero comprar: ${productName}`)
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-gold-500/70 px-4 py-2 text-sm font-body text-gold-400 transition-colors hover:bg-gold-500 hover:text-cacao-950 ${className}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      Comprar por WhatsApp
    </a>
  )
}

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.986.583 3.83 1.588 5.383L2 22l4.735-1.556A9.953 9.953 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.2a8.176 8.176 0 0 1-4.17-1.143l-.299-.177-2.81.923.93-2.737-.194-.281A8.19 8.19 0 1 1 12.001 20.2z" />
    </svg>
  )
}

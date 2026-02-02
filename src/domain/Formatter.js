/*
 * src/domain/Formatter.js
 * Utilidades para formateo: moneda y enlaces (WhatsApp)
 */
export function formatCurrency(amount, locale = 'es-ES', currency = 'EUR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function createWhatsAppLink(phone, message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

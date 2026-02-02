/*
 * src/ui/events.js
 * Manejo de eventos (delegación) para añadir/eliminar del carrito
 */
import { catalog } from '../data/catalog.js';
import { renderCart, renderCatalog } from './components.js';

export function setupEvents(cart) {
  // Delegación para botones "Añadir"
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const id = add.dataset.add;
      const item = catalog.find(c => c.id === id);
      if (item) {
        cart.add({ id: item.id, name: item.name, price: item.price, qty: 1 });
        renderCart(cart);
      }
    }

    const rem = e.target.closest('[data-remove]');
    if (rem) {
      const id = rem.dataset.remove;
      cart.remove(id);
      renderCart(cart);
    }
  });



}n  // Exportado también para re-render desde fuera si es necesario
/*
 * src/ui/events.js
 * Delegación mínima para acciones globales de UI (retirar desde el popover)
 */
import { updateBottomSheet, renderCartPopover } from './components.js';

export function setupEvents(cart) {
  // Delegación para botones "retirar" (se usa data-remove en el popover)
  document.addEventListener('click', (e) => {
    const rem = e.target.closest('[data-remove]');
    if (rem) {
      const pid = rem.dataset.remove;
      const id = isNaN(Number(pid)) ? pid : Number(pid);
      cart.remove(id);
      updateBottomSheet(cart.getTotal(), cart.items.length);
      renderCartPopover(cart);
    }
  });
}
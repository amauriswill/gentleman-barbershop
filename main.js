import { catalog, BUSINESS_PHONE } from './src/data/catalog.js';
import { Cart } from './src/domain/Cart.js';
import { renderListItem, updateBottomSheet, renderCartPopover } from './src/ui/components.js';

const cart = new Cart();
const listContainer = document.getElementById('menu-list');
const tabs = document.querySelectorAll('.tab');

// Función para renderizar lista filtrada
function loadItems(category) {
    listContainer.innerHTML = ''; // Limpiar lista
    const fragment = document.createDocumentFragment();
    
    const itemsToShow = category === 'all' 
        ? catalog 
        : catalog.filter(i => i.category === category); // Asegúrate de agregar propiedad 'category' en catalog.js

    itemsToShow.forEach(item => {
        const row = renderListItem(item, (product) => {
            cart.add(product);
            updateBottomSheet(cart.getTotal(), cart.items.length);
            // si el popover está abierto, actualizamos su contenido en caliente
            const pop = document.getElementById('cart-popover');
            if (pop && pop.classList.contains('visible')) renderCartPopover(cart);
            if(navigator.vibrate) navigator.vibrate(10);
        });
        fragment.appendChild(row);
    });
    
    listContainer.appendChild(fragment);
}

// Lógica de Tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remover clase active de todos
        tabs.forEach(t => t.classList.remove('active'));
        // Activar clickeado
        tab.classList.add('active');
        // Cargar items
        loadItems(tab.dataset.cat);
    });
});

// Carga inicial
loadItems('all');

// Abrir/cerrar popover al hacer click en el resumen (badge/total)
const cartSummary = document.querySelector('.cart-summary');
cartSummary.addEventListener('click', (e) => {
    e.stopPropagation();
    const pop = document.getElementById('cart-popover');
    if (pop && pop.classList.contains('visible')) {
        pop.classList.remove('visible');
    } else {
        renderCartPopover(cart);
    }
});

// Delegación para botones de "retirar" (data-remove)
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

// Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    const url = cart.generateWhatsAppLink(BUSINESS_PHONE);
    window.open(url, '_blank');
});
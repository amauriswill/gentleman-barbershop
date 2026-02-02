import { catalog, BUSINESS_PHONE } from './src/data/catalog.js';
import { Cart } from './src/domain/Cart.js';
import { renderListItem, updateBottomSheet } from './src/ui/components.js';

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

// Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    const url = cart.generateWhatsAppLink(BUSINESS_PHONE);
    window.open(url, '_blank');
});
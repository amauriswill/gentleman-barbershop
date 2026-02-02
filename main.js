import { catalog, BUSINESS_PHONE } from './src/data/catalog.js';
import { Cart } from './src/domain/Cart.js';
import { renderListItem, updateBottomSheet, renderCartPopover } from './src/ui/components.js';

const cart = new Cart();
const listContainer = document.getElementById('menu-list');
const tabs = document.querySelectorAll('.tab');

// Theme handling (persisted)
const THEME_KEY = 'gb-theme';
function applyTheme(theme) {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    const tbtn = document.getElementById('theme-toggle');
    if (tbtn) tbtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, theme);
}
const savedTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

// Global click for theme toggle (delegated)
document.addEventListener('click', (e) => {
    const t = e.target.closest('#theme-toggle');
    if (t) {
        const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(next);
    }
});

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
            // micro-interaction: pulso en el badge del carrito
            const badge = document.getElementById('cart-count');
            if (badge) { badge.classList.add('pulse'); setTimeout(() => badge.classList.remove('pulse'), 420); }
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
const cartSummary = document.getElementById('cart-summary') || document.querySelector('.cart-summary');
if (cartSummary) {
    cartSummary.addEventListener('click', (e) => {
        e.stopPropagation();
        const pop = document.getElementById('cart-popover');
        if (pop && pop.classList.contains('visible')) {
            pop.classList.remove('visible');
            cartSummary.setAttribute('aria-expanded', 'false');
        } else {
            renderCartPopover(cart);
            cartSummary.setAttribute('aria-expanded', 'true');
        }
    });
}

// Cerrar popover con ESC (accesibilidad)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const pop = document.getElementById('cart-popover');
        const cs = document.getElementById('cart-summary');
        if (pop && pop.classList.contains('visible')) {
            pop.classList.remove('visible');
            if (cs) cs.setAttribute('aria-expanded', 'false');
        }
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
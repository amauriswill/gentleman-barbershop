import { scissors, remove } from './icons.js';

export const renderListItem = (item, onAdd) => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
        <div class="item-info">
            <h3>${item.name}</h3>
            <p class="item-desc">${item.desc || 'Descripción breve del servicio o producto.'}</p>
            <div class="item-price">$${item.price.toFixed(2)}</div>
        </div>
        <div class="item-img-wrapper">
            <img src="assets/images/${item.img}" alt="${item.name}" loading="lazy">
            <button class="btn-add-mini" aria-label="Agregar">${scissors}</button> 
        </div>
    `;
    
    // Animación simple al hacer click en agregar
    const btn = div.querySelector('.btn-add-mini');
    btn.addEventListener('click', (e) => {
        // Efecto visual de pulsación
        btn.style.transform = 'scale(0.8)';
        setTimeout(() => btn.style.transform = 'scale(1)', 150);
        onAdd(item);
    });

    return div;
};

export const updateBottomSheet = (total, count) => {
    const sheet = document.getElementById('bottom-sheet');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    
    totalEl.textContent = `$${total.toFixed(2)}`;
    countEl.textContent = count;
    
    if (count > 0) {
        sheet.classList.add('visible');
    } else {
        sheet.classList.remove('visible');
    }
};

export const renderCartPopover = (cart, containerId = 'cart-popover') => {
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'cart-popover';
        document.body.appendChild(container);
    }

    const items = cart.items || [];
    if (items.length === 0) {
        container.innerHTML = '<div class="popover-empty">No hay cortes agregados.</div>';
        container.classList.remove('visible');
        return;
    }

    container.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'popover-list';

    items.forEach(i => {
        const row = document.createElement('div');
        row.className = 'popover-item';
        row.innerHTML = `
            <div class="name">${i.name} <small>x${i.qty}</small></div>
            <div class="price">$${(i.price * i.qty).toFixed(2)}</div>
            <button class="btn-remove" data-remove="${i.id}" aria-label="Retirar">${remove}</button>
        `;
        list.appendChild(row);
    });

    const footer = document.createElement('div');
    footer.className = 'popover-footer';
    footer.innerHTML = `<div class="popover-total">Total: $${cart.getTotal().toFixed(2)}</div>`;

    container.appendChild(list);
    container.appendChild(footer);
    container.classList.add('visible');
};
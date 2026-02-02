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
            <button class="btn-add-mini" aria-label="Agregar">+</button>
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
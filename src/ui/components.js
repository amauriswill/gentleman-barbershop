import { scissors, remove } from './icons.js';

const t = (key, fb) => (window.i18n && window.i18n.t) ? window.i18n.t(key, fb) : (fb || key);

export const renderListItem = (item, onAdd) => {
    const div = document.createElement('div');
    div.className = 'menu-item';

    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'item-img-wrapper';

    // Lazy picture with manifest.json support (manifest loaded by caller)
    const picture = document.createElement('picture');
    const manifest = window.__IMAGE_MANIFEST__ || {};
    const name = (item.img || '').replace(/\.svg$/i, '');
    if (manifest[name]) {
        const source = document.createElement('source');
        source.setAttribute('type','image/webp');
        source.setAttribute('srcset', manifest[name].srcset);
        source.setAttribute('sizes', manifest[name].sizes);
        picture.appendChild(source);
        const fallback = document.createElement('img');
        fallback.src = manifest[name].placeholder;
        fallback.alt = item.name;
        fallback.loading = 'lazy';
        picture.appendChild(fallback);
    } else {
        const fallback = document.createElement('img');
        fallback.src = `assets/images/${item.img}`;
        fallback.alt = item.name;
        fallback.loading = 'lazy';
        picture.appendChild(fallback);
    }

    imgWrapper.appendChild(picture);
    const btn = document.createElement('button');
    btn.className = 'btn-add-mini';
    btn.setAttribute('aria-label', t('buttons.add', 'Add'));
    btn.innerHTML = scissors;
    imgWrapper.appendChild(btn);

    div.appendChild(document.createElement('div'));
    div.querySelector('div').className = 'item-info';
    div.querySelector('.item-info').innerHTML = `
            <h3>${item.name}</h3>
            <p class="item-desc">${item.desc || t('items.default_desc','Brief description of the service or product.')}</p>
            <div class="item-price">$${item.price.toFixed(2)}</div>
        `;

    div.appendChild(imgWrapper);

    // Event binding
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
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
        container.innerHTML = `<div class="popover-empty">${t('popover.empty','No cuts added.')}</div>`;
        container.classList.remove('visible');
        const cs = document.getElementById('cart-summary');
        if (cs) cs.setAttribute('aria-expanded', 'false');
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
            <button class="btn-remove" data-remove="${i.id}" aria-label="${t('buttons.remove','Remove')}">${remove}</button>
        `;
        list.appendChild(row);
    });

    const footer = document.createElement('div');
    footer.className = 'popover-footer';
    footer.innerHTML = `<div class="popover-total">${t('popover.total','Total:')} $${cart.getTotal().toFixed(2)}</div>`;

    container.appendChild(list);
    container.appendChild(footer);
    container.classList.add('visible');
    const cs = document.getElementById('cart-summary');
    if (cs) cs.setAttribute('aria-expanded', 'true');
};
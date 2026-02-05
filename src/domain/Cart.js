export class Cart {
    constructor() {
        this._storageKey = 'gb-cart';
        this.items = [];
        this.load();
    }

    load() {
        try {
            const raw = localStorage.getItem(this._storageKey);
            if (raw) this.items = JSON.parse(raw);
        } catch (e) {
            this.items = [];
        }
    }

    save() {
        try {
            localStorage.setItem(this._storageKey, JSON.stringify(this.items));
        } catch (e) { /* ignore */ }
    }

    add(item) {
        const exists = this.items.find(i => i.id === item.id);
        if (exists) {
            exists.qty += item.qty || 1;
        } else {
            this.items.push({ ...item, qty: item.qty || 1 });
        }
        this.save();
    }

    remove(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
    }

    clear() {
        this.items = [];
        this.save();
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    toJSON() {
        return JSON.parse(JSON.stringify(this.items));
    }

    // Genera el link de WhatsApp (Caso de uso principal)
    generateWhatsAppLink(phone) {
        const t = (window.i18n && window.i18n.t) ? window.i18n.t : (k => k);
        let header = t('cart.header','Hola, quisiera reservar/pedir lo siguiente:');
        let text = `${header}%0A`;
        this.items.forEach(i => {
            text += `- ${i.name} (x${i.qty}): $${(i.price * i.qty).toFixed(2)}%0A`;
        });
        const totalLabel = t('cart.total_label','Total');
        text += `%0A*${totalLabel}: $${this.getTotal().toFixed(2)}*`;
        return `https://wa.me/${phone}?text=${text}`;
    }
} 
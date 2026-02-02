export class Cart {
    constructor() {
        this.items = [];
    }

    add(item) {
        const exists = this.items.find(i => i.id === item.id);
        if (exists) {
            exists.qty++;
        } else {
            this.items.push({ ...item, qty: 1 });
        }
    }

    remove(id) {
        this.items = this.items.filter(i => i.id !== id);
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    // Genera el link de WhatsApp (Caso de uso principal)
    generateWhatsAppLink(phone) {
        let text = "Hola, quisiera reservar/pedir lo siguiente:%0A";
        this.items.forEach(i => {
            text += `- ${i.name} (x${i.qty}): $${(i.price * i.qty).toFixed(2)}%0A`;
        });
        text += `%0A*Total: $${this.getTotal().toFixed(2)}*`;
        return `https://wa.me/${phone}?text=${text}`;
    }
}
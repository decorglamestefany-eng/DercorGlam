// Sistema de carrito de compras
class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartDisplay();
    }

    addItem(name, price) {
        this.items.push({
            id: Date.now(),
            name: name,
            price: price,
            quantity: 1
        });
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${name} agregado al carrito`);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(id, quantity) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartDisplay();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    updateCartDisplay() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            if (count > 0) {
                cartCountElement.textContent = count;
                cartCountElement.classList.remove('hidden');
            } else {
                cartCountElement.classList.add('hidden');
            }
        }
        this.updateCartPage();
    }

    updateCartPage() {
        const cartContainer = document.getElementById('cartContainer');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-12">
                    <p class="font-playfair text-2xl text-custom-dark opacity-60">Tu carrito está vacío</p>
                    <p class="font-montserrat text-custom-dark opacity-60 mt-2">Agrega servicios desde la página de Servicios</p>
                    <a href="servicios.html" class="inline-block mt-6 bg-custom-primary text-custom-dark font-semibold px-8 py-3 rounded-lg hover:bg-custom-gold transition">
                        Ver Servicios
                    </a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = this.items.map(item => `
            <div class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-custom-primary flex justify-between items-center">
                <div class="flex-1">
                    <h3 class="font-playfair text-xl font-bold text-custom-dark">${item.name}</h3>
                    <p class="font-montserrat text-custom-gold font-semibold">S/. ${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 bg-custom-light rounded-lg p-2">
                        <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})" class="px-3 py-1 text-custom-dark hover:bg-custom-primary rounded transition">-</button>
                        <span class="px-3 font-semibold">${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})" class="px-3 py-1 text-custom-dark hover:bg-custom-primary rounded transition">+</button>
                    </div>
                    <button onclick="cart.removeItem(${item.id})" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');

        this.updateSummary();
    }

    updateSummary() {
        const subtotal = this.getTotal();
        const taxes = subtotal * 0.21;
        const shipping = subtotal > 3000 ? 0 : 150;
        const total = subtotal + taxes + shipping;

        const elements = {
            'subtotal': subtotal,
            'taxes': taxes,
            'shipping': shipping,
            'total': total
        };

        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = `S/. ${value.toFixed(2)}`;
            }
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-20 right-6 bg-custom-primary text-custom-dark px-6 py-3 rounded-lg shadow-lg font-montserrat font-semibold animate-bounce';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    clear() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }
}

// Crear instancia global del carrito
const cart = new ShoppingCart();

// Función para agregar al carrito
function addToCart(name, price) {
    cart.addItem(name, price);
}

// Función para proceder al checkout
function proceedToCheckout() {
    if (cart.items.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cart.getTotal().toFixed(2);
    alert(`Carrito total: S/. ${total}\n\nSerás redirigido al formulario de contacto para confirmar tu pedido.`);
    window.location.href = 'contacto.html';
}

// Menú Hamburguesa
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = menuOverlay?.querySelectorAll('a') || [];
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.classList.add('active');
        });
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    }
    
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            menuOverlay?.classList.remove('active');
        }
    });

    // Animación al scroll
    observeElements();
});

// Observador de elementos para animaciones
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Validación de formularios
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para búsqueda y filtrado
function search(query) {
    console.log('Buscando:', query);
}

// Funciones de análisis (Google Analytics placeholder)
function trackEvent(category, action, label) {
    console.log('Evento:', category, action, label);
    // Aquí iría el código real de Google Analytics
}

// Rastrear clics en botones CTA
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('CTA', 'click', this.textContent);
        });
    });

    document.querySelectorAll('a[href*="servicios"]').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('Navigation', 'click', 'Servicios');
        });
    });
});

// Función para manejar suscripción a newsletter
function subscribeNewsletter(email) {
    if (validateEmail(email)) {
        alert('¡Gracias por suscribirte! Te enviaremos nuestras actualizaciones.');
        return true;
    } else {
        alert('Por favor ingresa un email válido');
        return false;
    }
}

// Smooth scroll para anclas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Detectar si es dispositivo móvil
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Optimización para scroll performance
let ticking = false;
window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            // Aquí van las operaciones en scroll
            ticking = false;
        });
        ticking = true;
    }
});

// Preload de imágenes críticas
function preloadImage(src) {
    const img = new Image();
    img.src = src;
}

// Mensajes de validación localizados
const messages = {
    es: {
        required: 'Este campo es requerido',
        invalidEmail: 'Email inválido',
        invalidPhone: 'Teléfono inválido',
        success: '¡Operación exitosa!',
        error: 'Ocurrió un error'
    }
};

// Función para obtener mensaje
function getMessage(key, lang = 'es') {
    return messages[lang]?.[key] || key;
}

// Sistema de notificaciones mejorado
class NotificationSystem {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg font-montserrat z-50 animate-bounce notification-${type}`;
        
        const colors = {
            'success': 'bg-green-500 text-white',
            'error': 'bg-red-500 text-white',
            'info': 'bg-custom-primary text-custom-dark',
            'warning': 'bg-yellow-500 text-white'
        };
        
        notification.className += ' ' + (colors[type] || colors['info']);
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, duration);
    }
}

// Exportar para uso global
window.NotificationSystem = NotificationSystem;

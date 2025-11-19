/* ============ ZAYNAR CORE LOGIC 2025 ============ */

// 1. PRODUCT DATA
const products = {
    'patek-silver': { name: 'Patek Philippe Nautilus', price: 450, img: 'img/product 1.jpg' },
    'rado-skeleton': { name: 'Rado True Square', price: 275, img: 'img/IMG-20251104-WA0016.jpg' },
    'rolex-green': { name: 'Rolex Land-Dweller', price: 250, img: 'img/product 3.jpg' },
    'chenxi-chrono': { name: 'Chenxi Chronograph', price: 130, img: 'img/IMG-20251029-WA0013.jpg' },
    'bestwin-gold': { name: 'Bestwin Geometric', price: 150, img: 'New img/golden steps green.jpg' },
    'tissot-gold': { name: 'Tissot 1853 Chrono', price: 220, img: 'New img/golden chain watch.png' },
    'wallet-black': { name: 'Classic Noir Wallet', price: 60, img: 'New img/wallet.png' },
    'wallet-tan': { name: 'Heritage Tan Wallet', price: 45, img: 'New img/wallet 3.png' }
};

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 2. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Page Loader
    setTimeout(() => document.body.classList.add('loaded'), 800);
    
    // Init Animations
    initScrollAnimations();
    
    // Init Cart
    updateCartUI();
    
    // Event Listeners
    setupEventListeners();
});

// 3. EVENT LISTENERS
function setupEventListeners() {
    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // Mobile Menu
    const menuBtn = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if(menuBtn){
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    // Cart Drawer
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.getElementById('overlay');
    const drawer = document.getElementById('cart-drawer');

    function toggleDrawer() {
        drawer.classList.toggle('open');
        overlay.classList.toggle('active');
    }

    if(cartToggle) cartToggle.addEventListener('click', toggleDrawer);
    if(closeCart) closeCart.addEventListener('click', toggleDrawer);
    if(overlay) overlay.addEventListener('click', toggleDrawer);

    // Add to Cart Delegation
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart');
        if (btn) {
            const id = btn.dataset.id;
            addToCart(id);
            // Open drawer to show confirmation
            if(!drawer.classList.contains('open')) toggleDrawer();
        }
        
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.dataset.index;
            cart.splice(index, 1);
            saveCart();
            updateCartUI();
        }
    });
}

// 4. CART FUNCTIONS
function addToCart(id) {
    const product = products[id];
    if(!product) return;

    const existing = cart.find(item => item.id === id);
    if(existing) {
        existing.qty++;
    } else {
        cart.push({ id, ...product, qty: 1 });
    }
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    
    if(!itemsContainer) return;

    let total = 0;
    let count = 0;
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<div class="empty-cart-msg" style="text-align:center; color:#888; margin-top:50px;">Your bag is empty.</div>';
    } else {
        itemsContainer.innerHTML = cart.map((item, index) => {
            total += item.price * item.qty;
            count += item.qty;
            return `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${item.price} x ${item.qty}</div>
                        <span class="remove-item" data-index="${index}">Remove</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    if(countEl) {
        countEl.innerText = count;
        countEl.style.display = count > 0 ? 'flex' : 'none';
    }
    if(totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 5. SCROLL ANIMATIONS (Intersection Observer)
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up, .scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}
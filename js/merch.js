// Merch page functionality
let cart = [];
let products = [];

async function initMerch() {
    const merchGrid = document.getElementById('merch-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const cartClose = document.getElementById('cart-close');
    
    if (!merchGrid) return;

    // Prevent double init
    if (merchGrid.dataset.initialized) return;
    merchGrid.dataset.initialized = 'true';

    try {
        const response = await fetch('data/merch.json');
        products = await response.json();
        
        merchGrid.innerHTML = '';
        products.forEach(product => {
            const productElement = createProductCard(product);
            merchGrid.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
    
    if (cartIcon) {
        cartIcon.onclick = () => {
            cartModal.classList.add('active');
            updateCartDisplay();
        };
    }
    
    if (cartClose) {
        cartClose.onclick = () => {
            cartModal.classList.remove('active');
        };
    }
    
    if (cartModal) {
        cartModal.onclick = (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        };
    }
    
    loadCart();
    updateCartIcon();
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'merch-item';
    
    card.innerHTML = `
        <img src="${product.image || 'assets/common/placeholder.png'}" alt="${product.name}" class="merch-image">
        <h3 class="merch-name">${product.name}</h3>
        <div class="merch-price">€${product.price.toFixed(2)}</div>
        <div class="merch-description">${product.description}</div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">ADD TO CART</button>
    `;
    
    return card;
}

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    cart.push(product);
    saveCart();
    updateCartIcon();
    
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'ADDED!';
    btn.style.background = 'linear-gradient(to bottom, var(--green), #00cc00)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1000);
};

function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = cart.length;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: var(--white); text-align: center; padding: 20px;">Cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">€${item.price.toFixed(2)}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

window.initMerch = initMerch;
document.addEventListener('DOMContentLoaded', initMerch);


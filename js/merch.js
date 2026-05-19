// Merch page functionality
let cart = [];
let products = [];

async function initMerch() {
    const merchGrid  = document.getElementById('merch-grid');
    const cartIcon   = document.getElementById('cart-icon');
    const cartModal  = document.getElementById('cart-modal');
    const cartClose  = document.getElementById('cart-close');

    if (!merchGrid) return;
    if (merchGrid.dataset.initialized) return;
    merchGrid.dataset.initialized = 'true';

    try {
        const response = await fetch('data/merch.json');
        products = await response.json();
        merchGrid.innerHTML = '';
        products.forEach(product => merchGrid.appendChild(createProductCard(product)));
    } catch (error) {
        console.error('Error loading products:', error);
    }

    if (cartIcon)  cartIcon.onclick  = () => { cartModal.classList.add('active'); updateCartDisplay(); };
    if (cartClose) cartClose.onclick = () => cartModal.classList.remove('active');
    if (cartModal) cartModal.onclick = e => { if (e.target === cartModal) cartModal.classList.remove('active'); };

    loadCart();
    updateCartIcon();
}

function escHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'merch-item';
    card.innerHTML = `
        <img src="${escHtml(product.image || 'assets/common/placeholder.png')}" alt="${escHtml(product.name)}" class="merch-image">
        <h3 class="merch-name">${escHtml(product.name)}</h3>
        <div class="merch-price">€${Number(product.price).toFixed(2)}</div>
        <div class="merch-description">${escHtml(product.description)}</div>
        <button class="add-to-cart-btn" data-product-id="${Number(product.id)}">ADD TO CART</button>
    `;
    // Event delegation — no onclick inline, no event globale
    card.querySelector('.add-to-cart-btn').addEventListener('click', function() {
        addToCart(product.id, this);
    });
    return card;
}

function addToCart(productId, btn) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    cart.push(product);
    saveCart();
    updateCartIcon();

    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'ADDED!';
        btn.style.background = 'linear-gradient(to bottom, var(--green), #00cc00)';
        setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 1000);
    }
}

function updateCartIcon() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.textContent = cart.length;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span class="cart-item-name">${escHtml(item.name)}</span>
            <span class="cart-item-price">€${Number(item.price).toFixed(2)}</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

function saveCart()  { localStorage.setItem('cart', JSON.stringify(cart)); }
function loadCart()  { try { cart = JSON.parse(localStorage.getItem('cart') || '[]'); } catch { cart = []; } }

window.initMerch = initMerch;
document.addEventListener('DOMContentLoaded', initMerch);

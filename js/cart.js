/* cart.js 
   simple vanilla-JS cart manager with localStorage persistence */

const Cart = (function(){
    const STORAGE_KEY = 'pi_cart';
    let items = [];

    function init(){
        load();
        updateBadge();
        render();
        setupListeners();
    }

    function load(){
        const raw = localStorage.getItem(STORAGE_KEY);
        items = raw ? JSON.parse(raw) : [];
    }

    function save(){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function add(product){
        const existing = items.find(i=>i.id === product.id);
        if(existing){
            existing.quantity += 1;
        } else {
            items.push(Object.assign({quantity:1}, product));
        }
        save();
        updateBadge();
        render();
    }

    function remove(id){
        items = items.filter(i=>i.id !== id);
        save();
        updateBadge();
        render();
    }

    function changeQuantity(id, delta){
        const item = items.find(i=>i.id===id);
        if(!item) return;
        item.quantity += delta;
        if(item.quantity <= 0) {
            remove(id);
        } else {
            save();
            render();
            updateBadge();
        }
    }

    function getTotal(){
        return items.reduce((sum,i)=>sum + i.price * i.quantity, 0);
    }

    function updateBadge(){
        const count = items.reduce((sum,i)=>sum+i.quantity,0);
        const badge = document.getElementById('cart-count');
        if(badge) badge.textContent = count;
    }

    function render(){
        const container = document.getElementById('cart-items');
        if(!container) return;
        container.innerHTML = '';
        items.forEach(i=>{
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.dataset.id = i.id;
            const subtotal = i.price * i.quantity;
            el.innerHTML = `
                <img src="${i.image}" alt="${i.name}">
                <div class="item-details">
                    <h4 class="item-name">${i.name}</h4>
                    <p class="item-price">₹${i.price} × ${i.quantity} = ₹${subtotal}</p>
                    <div class="quantity-selector">
                        <button class="decrease">-</button>
                        <span class="quantity">${i.quantity}</span>
                        <button class="increase">+</button>
                    </div>
                </div>
                <button class="remove-item">&times;</button>
            `;
            container.appendChild(el);
        });
        const totalEl = document.getElementById('cart-total');
        if(totalEl) totalEl.textContent = getTotal();
        attachItemListeners();
    }

    function attachItemListeners(){
        document.querySelectorAll('.cart-item .increase').forEach(btn=>{
            btn.onclick = e=>{
                const id = e.target.closest('.cart-item').dataset.id;
                changeQuantity(id,1);
            };
        });
        document.querySelectorAll('.cart-item .decrease').forEach(btn=>{
            btn.onclick = e=>{
                const id = e.target.closest('.cart-item').dataset.id;
                changeQuantity(id,-1);
            };
        });
        document.querySelectorAll('.cart-item .remove-item').forEach(btn=>{
            btn.onclick = e=>{
                const id = e.target.closest('.cart-item').dataset.id;
                remove(id);
            };
        });
    }

    function open(){
        document.getElementById('cart-overlay').classList.add('show');
        document.getElementById('cart-panel').classList.add('open');
    }
    function close(){
        document.getElementById('cart-overlay').classList.remove('show');
        document.getElementById('cart-panel').classList.remove('open');
    }

    function setupListeners(){
        const btn = document.getElementById('cart-button');
        const overlay = document.getElementById('cart-overlay');
        const closeBtn = document.getElementById('cart-close');
        if(btn) btn.addEventListener('click', open);
        if(overlay) overlay.addEventListener('click', close);
        if(closeBtn) closeBtn.addEventListener('click', close);

        const checkout = document.getElementById('checkout-button');
        if(checkout){
            checkout.addEventListener('click', ()=>{
                // Redirect to checkout page
                window.location.href = 'checkout.html';
            });
        }
        const cont = document.getElementById('continue-shopping');
        if(cont){
            cont.addEventListener('click', ()=>{
                close();
                // if not already on shop page, go there
                if(!window.location.pathname.includes('shop.html')){
                    window.location.href = 'shop.html';
                }
            });
        }

        const form = document.getElementById('order-form');
        if(form){
            form.addEventListener('submit', e=>{
                e.preventDefault();
                handleOrder();
            });
        }
    }

    function handleOrder(){
        // Use the Checkout module from checkout.js
        if (window.Checkout && typeof Checkout.handleCheckoutSubmit === 'function') {
            // Get form element and trigger the checkout process
            const form = document.getElementById('order-form');
            if (form) {
                // Call checkout function directly with event prevention
                Checkout.handleCheckoutSubmit(new Event('submit'));
            }
        } else {
            // Fallback: just show confirmation if checkout.js is not loaded
            document.getElementById('order-form').classList.add('hidden');
            document.getElementById('order-confirmation').classList.remove('hidden');
            items = [];
            save();
            updateBadge();
            render();
        }
    }

    return { init, add, changeQuantity, remove, updateBadge, render };
}());

window.addEventListener('DOMContentLoaded', Cart.init);

// global helper functions for easy access
window.addToCart = Cart.add;
window.removeFromCart = Cart.remove;
window.increaseQuantity = id => Cart.changeQuantity(id, 1);
window.decreaseQuantity = id => Cart.changeQuantity(id, -1);
window.updateCartCount = Cart.updateBadge;
window.renderCart = Cart.render;

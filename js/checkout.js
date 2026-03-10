/**
 * PI 3.147 Checkout System
 * Handles order submission to Google Sheets
 */

// Google Apps Script Web App URL - Replace with your actual URL after deploying
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbydJJxm9MzypswQBZaJSdi_nEuxtQctvfkj8C28dPI5X_Rj4yW-kznCpIeSB3JaLDBL/exec";

/**
 * Initialize checkout functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check for checkout form in cart panel (id="order-form")
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Check for standalone checkout page form (id="checkout-form")
    const checkoutForm = document.getElementById('checkout-form');
    // Only add listener if it's a form element (not the div wrapper in cart panel)
    if (checkoutForm && checkoutForm.tagName === 'FORM') {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
});

/**
 * Handle checkout form submission
 * @param {Event} e - Form submit event
 */
async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Get form element
    const form = e.target;
    
    // Determine which form inputs to use based on form id
    let name, phone, email, address;
    
    if (form.id === 'checkout-form') {
        // Standalone checkout page
        name = document.getElementById('customer-name')?.value?.trim();
        phone = document.getElementById('customer-phone')?.value?.trim();
        email = document.getElementById('customer-email')?.value?.trim();
        address = document.getElementById('customer-address')?.value?.trim();
    } else {
        // Cart panel form (order-form)
        name = document.getElementById('customer-name')?.value?.trim();
        phone = document.getElementById('customer-phone')?.value?.trim();
        email = document.getElementById('customer-email')?.value?.trim();
        address = document.getElementById('customer-address')?.value?.trim();
    }
    
    // Validate required fields
    if (!name || !phone || !email || !address) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Get cart data from localStorage
    const cartData = getCartData();
    
    if (!cartData || cartData.items.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }
    
    // Prepare order data
    const orderData = {
        name: name,
        phone: phone,
        email: email,
        address: address,
        product: cartData.productNames,
        quantity: cartData.totalQuantity,
        total: cartData.total,
        date: new Date().toLocaleDateString('en-IN')
    };
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    try {
        // Send data to Google Sheets
        await sendOrderToGoogleSheet(orderData);
        
        // Show success message
        showOrderConfirmation(form);
        
        // Clear cart
        clearCart();
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        
    } catch (error) {
        console.error('Order submission error:', error);
        alert('Failed to submit order. Please try again or contact support.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Get cart data from localStorage
 * @returns {Object|null} Cart data object
 */
function getCartData() {
    const raw = localStorage.getItem('pi_cart');
    if (!raw) return null;
    
    const items = JSON.parse(raw);
    if (!items || items.length === 0) return null;
    
    const productNames = items.map(item => item.name).join(', ');
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
        items: items,
        productNames: productNames,
        totalQuantity: totalQuantity,
        total: total
    };
}

/**
 * Send order data to Google Sheets via Google Apps Script
 * @param {Object} orderData - Order details
 * @returns {Promise<Response>} Fetch response
 */
async function sendOrderToGoogleSheet(orderData) {
    // Check if Google Script URL is configured
    if (GOOGLE_SCRIPT_URL === "PASTE_GOOGLE_SCRIPT_WEBAPP_URL_HERE") {
        console.warn('Google Apps Script URL not configured. Order data:', orderData);
        // For demo purposes, simulate success if URL is not configured
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
    
   const formData = new FormData();

formData.append("name", orderData.name);
formData.append("phone", orderData.phone);
formData.append("email", orderData.email);
formData.append("address", orderData.address);
formData.append("product", orderData.product);
formData.append("quantity", orderData.quantity);
formData.append("total", orderData.total);
formData.append("date", orderData.date);

const response = await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
});
  
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
}

/**
 * Show order confirmation message
 * @param {HTMLFormElement} form - The form that was submitted
 */
function showOrderConfirmation(form) {
    // Check which page we're on based on form id
    if (form.id === 'checkout-form') {
        // Standalone checkout page
        const checkoutContent = document.getElementById('checkout-content');
        const orderSuccess = document.getElementById('order-success');
        
        if (checkoutContent) {
            checkoutContent.style.display = 'none';
        }
        
        if (orderSuccess) {
            orderSuccess.style.display = 'block';
        }
    } else {
        // Cart panel form (order-form)
        const orderForm = document.getElementById('order-form');
        const confirmation = document.getElementById('order-confirmation');
        
        if (orderForm) {
            orderForm.classList.add('hidden');
        }
        
        if (confirmation) {
            confirmation.classList.remove('hidden');
            confirmation.innerHTML = '<p style="color: #C6A969; font-size: 1.2rem; text-align: center;">Order Confirmed – Thank you for purchasing PI 3.147</p>';
        }
    }
}

/**
 * Clear cart from localStorage
 */
function clearCart() {
    localStorage.removeItem('pi_cart');
    
    // Update cart badge
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = '0';
    }
    
    // Re-render cart if function exists
    if (typeof window.renderCart === 'function') {
        window.renderCart();
    }
}

/**
 * Helper function to get cart total
 * @returns {number} Cart total price
 */
function getCartTotal() {
    const cartData = getCartData();
    return cartData ? cartData.total : 0;
}

/**
 * Helper function to get cart items count
 * @returns {number} Total items in cart
 */
function getCartItemCount() {
    const cartData = getCartData();
    return cartData ? cartData.totalQuantity : 0;
}

// Export functions for global access
window.Checkout = {
    handleCheckoutSubmit,
    getCartData,
    sendOrderToGoogleSheet,
    showOrderConfirmation,
    clearCart,
    getCartTotal,
    getCartItemCount
};




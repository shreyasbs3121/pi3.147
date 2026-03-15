// Loading screen
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'loading-screen';
    loader.innerHTML = '<div class="spinner">&pi;</div>';

    document.body.appendChild(loader);
    setTimeout(() => loader.remove(), 3000);
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

function toggleMenu() {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

hamburger.addEventListener('click', toggleMenu);

// Close mobile menu when link clicked or outside click
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    }
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Data for products (3‑4 images each, plus description)
const productData = {
    1: {
        title: 'PI Hoodie 1',
        price: '₹2399',
        description: 'A premium hoodie crafted with precision and style.',
        images: [
            'images/product1/Screenshot 2026-03-03 155708.png',
            'images/product1/Screenshot 2026-03-03 155722.png',
            'images/product1/Screenshot 2026-03-03 155733.png',
            'images/product1/Screenshot 2026-03-03 155804.png'
        ]
    },
    2: {
        title: 'PI Hoodie 2',
        price: '₹2399',
        description: 'Comfort meets elegance in this white hoodie.',
        images: [
            'images/product2/Screenshot 2026-03-03 160141.png',
            'images/product2/Screenshot 2026-03-03 160159.png',
            'images/product2/Screenshot 2026-03-03 160210.png',
            'images/product2/Screenshot 2026-03-03 160218.png',
            'images/product2/Screenshot 2026-03-03 160242.png',
            'images/product2/Screenshot 2026-03-03 160254.png'
        ]
    },
    3: {
        title: 'PI Hoodie 3',
        price: '₹2399',
        description: 'Bold style with minimal design.',
        images: [
            'images/product3/Screenshot 2026-03-03 160429.png',
            'images/product3/Screenshot 2026-03-03 160444.png',
            'images/product3/Screenshot 2026-03-03 160452.png',
            'images/product3/Screenshot 2026-03-03 160500.png'
        ]
    },
    4: {
        title: 'PI Hoodie 4',
        price: '₹2399',
        description: 'The finest materials for everyday wear.',
        images: [
            'images/product4/Screenshot 2026-03-07 223123.png',
            'images/product4/Screenshot 2026-03-07 223140.png',
            'images/product4/Screenshot 2026-03-07 223152.png',
            'images/product4/Screenshot 2026-03-07 223204.png',
            'images/product4/Screenshot 2026-03-07 223211.png',
            'images/product4/Screenshot 2026-03-07 223230.png'
        ]
    },
    5: {
        title: 'PI Hoodie 5',
        price: '₹2399',
        description: 'Clean lines, premium feel.',
        images: [
            'images/product5/Screenshot 2026-03-07 223246.png',
            'images/product5/Screenshot 2026-03-07 223252.png',
            'images/product5/Screenshot 2026-03-07 223300.png',
            'images/product5/Screenshot 2026-03-07 223307.png',
            'images/product5/Screenshot 2026-03-07 223317.png'
        ]
    },
    6: {
        title: 'PI Hoodie 6',
        price: '₹2399',
        description: 'A modern twist on a classic design.',
        images: [
            'images/product6/Screenshot 2026-03-07 223331.png',
            'images/product6/Screenshot 2026-03-07 223343.png',
            'images/product6/Screenshot 2026-03-07 223358.png',
            'images/product6/Screenshot 2026-03-07 223406.png'
        ]
    },
    7: {
        title: 'PI Hoodie 7',
        price: '₹2399',
        description: 'Sophisticated and timeless.',
        images: [
            'images/product7/Screenshot 2026-03-07 223507.png',
            'images/product7/Screenshot 2026-03-07 223514.png',
            'images/product7/Screenshot 2026-03-07 223523.png'
        ]
    },
    8: {
        title: 'PI Hoodie 8',
        price: '₹2399',
        description: 'Lightweight fabric for all seasons.',
        images: [
            'images/product8/Screenshot 2026-03-07 223603.png',
            'images/product8/Screenshot 2026-03-07 223609.png',
            'images/product8/Screenshot 2026-03-07 223616.png'
        ]
    },
    9: {
        title: 'PI Hoodie 9',
        price: '₹2399',
        description: 'Designed for the discerning few.',
        images: [
            'images/product9/Screenshot 2026-03-07 223630.png',
            'images/product9/Screenshot 2026-03-07 223636.png',
            'images/product9/Screenshot 2026-03-07 223645.png',
            'images/product9/Screenshot 2026-03-07 223651.png'
        ]
    },
    10: {
        title: 'PI Hoodie 10',
        price: '₹2399',
        description: 'Exclusive design with limited availability.',
        images: [
            'images/product10/Screenshot 2026-03-07 223718.png',
            'images/product10/Screenshot 2026-03-07 223727.png',
            'images/product10/Screenshot 2026-03-07 223732.png',
            'images/product10/Screenshot 2026-03-07 223738.png'
        ]
    }
};



// Modal functionality with gallery
const modal = document.getElementById('product-modal');
const modalMainImage = document.getElementById('modal-main-image');
const modalThumbnails = document.getElementById('modal-thumbnails');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');
const closeBtn = document.querySelector('.close');

let currentImages = [];
let currentImageIndex = 0;


function changeImage(index) {
    currentImageIndex = index;
    modalMainImage.style.opacity = '0';
    setTimeout(() => {
        modalMainImage.src = currentImages[index];
        modalMainImage.style.opacity = '1';
    }, 200);
    document.querySelectorAll('#modal-thumbnails img').forEach((i, idx) => {
        if (idx === index) i.classList.add('active');
        else i.classList.remove('active');
    });
}

function closeModal() {
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

window.addEventListener('click', (e) => {
    if (modal && e.target === modal) closeModal();
});

// Swipe detection for modal images
let startX = 0;
let endX = 0;

if (modalMainImage) {

    modalMainImage.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    modalMainImage.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    });

}

function handleSwipe() {
    const diff = startX - endX;
    if (Math.abs(diff) > 50) { // threshold
        if (diff > 0 && currentImageIndex < currentImages.length - 1) {
            // swipe left, next image
            changeImage(currentImageIndex + 1);
        } else if (diff < 0 && currentImageIndex > 0) {
            // swipe right, prev image
            changeImage(currentImageIndex - 1);
        }
    }
}

// Attach product-link clicks (replaces view-product buttons)
document.querySelectorAll('.product-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-product');
        openModal(id);
    });
});

// Remove old .view-product logic (no longer used)

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.parallax').forEach(el => {
        el.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
});

// basic hover for product card images (redundant with hovered class, but keep safety)
document.querySelectorAll('.product-card img').forEach(img => {
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
    });
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
    // Tap animation for mobile
    img.addEventListener('touchstart', () => {
        img.style.transform = 'scale(1.05)';
    });
    img.addEventListener('touchend', () => {
        img.style.transform = 'scale(1)';
    });
});

// --- cart integration ------------------------------------------------
function attachCartButtons() {
    // card buttons
    document.querySelectorAll('.product-card').forEach(card => {
        const addBtn = card.querySelector('.add-to-cart');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const product = {
                    id: card.dataset.id || card.getAttribute('data-product'),
                    name: card.dataset.name || '',
                    price: parseFloat(card.dataset.price) || 0,
                    image: card.dataset.image || card.querySelector('img').src
                };
                Cart.add(product);
            });
        }
    });

    // modal buy-now
    const buyNowBtn = document.getElementById('modal-buy');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', e => {
            const b = e.currentTarget;
            const product = {
                id: b.dataset.id,
                name: b.dataset.name,
                price: parseFloat(b.dataset.price) || 0,
                image: b.dataset.image
            };
            Cart.add(product);
        });
    }
}

function openModal(id) {
    const data = productData[id];
    if (!data) return;
    currentImages = data.images;
    currentImageIndex = 0;
    modalTitle.textContent = data.title;
    modalPrice.innerHTML = data.price;
    modalDescription.textContent = data.description;

    // populate gallery
    modalThumbnails.innerHTML = '';
    data.images.forEach((src, idx) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        if (idx === 0) thumb.classList.add('active');
        thumb.addEventListener('click', () => {
            changeImage(idx);
        });
        modalThumbnails.appendChild(thumb);
    });
    modalMainImage.src = data.images[0];

    // Update sticky bar
    document.getElementById('sticky-price').innerHTML = data.price;

    // set buyâ€‘now attributes for cart.js
    const buyNowBtn = document.getElementById('modal-buy');
    if (buyNowBtn) {
        buyNowBtn.dataset.id = id;
        buyNowBtn.dataset.name = data.title;
        buyNowBtn.dataset.price = parseFloat(data.price.replace(/[^\d]/g, ''));
        buyNowBtn.dataset.image = data.images[0];
    }

    modal.style.display = 'block';
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
    attachCartButtons();
});



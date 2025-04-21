document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });

    // Sample cart data (replace with actual API calls)
    const cartItems = [
        {
            id: 1,
            name: "Product 1",
            price: 99.99,
            image: "../images_fonts/product1.jpg",
            quantity: 1
        },
        {
            id: 2,
            name: "Product 2",
            price: 149.99,
            image: "../images_fonts/product2.jpg",
            quantity: 2
        }
    ];

    // Display cart items
    function displayCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartSummary.style.display = 'none';
            return;
        }

        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn increase">+</button>
                    </div>
                    <button class="remove-btn">Remove</button>
                </div>
            </div>
        `).join('');

        // Calculate total
        total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Update summary
        document.querySelector('.summary-row:nth-child(2)').innerHTML = `
            <span>Subtotal</span>
            <span>$${total.toFixed(2)}</span>
        `;

        document.querySelector('.summary-row:nth-child(3)').innerHTML = `
            <span>Shipping</span>
            <span>Free</span>
        `;

        document.querySelector('.summary-row:nth-child(4)').innerHTML = `
            <span>Total</span>
            <span>$${total.toFixed(2)}</span>
        `;

        // Add event listeners
        addEventListeners();
    }

    // Add event listeners to cart items
    function addEventListeners() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.parentElement.querySelector('.quantity-input');
                const itemId = this.closest('.cart-item').dataset.id;
                const item = cartItems.find(item => item.id === parseInt(itemId));

                if (this.classList.contains('decrease')) {
                    if (input.value > 1) {
                        input.value = parseInt(input.value) - 1;
                        item.quantity = parseInt(input.value);
                    }
                } else {
                    input.value = parseInt(input.value) + 1;
                    item.quantity = parseInt(input.value);
                }

                displayCartItems();
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = parseInt(this.closest('.cart-item').dataset.id);
                const index = cartItems.findIndex(item => item.id === itemId);
                cartItems.splice(index, 1);
                displayCartItems();
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const itemId = this.closest('.cart-item').dataset.id;
                const item = cartItems.find(item => item.id === parseInt(itemId));
                item.quantity = parseInt(this.value);
                displayCartItems();
            });
        });
    }

    // Checkout button handler
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        // Add checkout logic here
        alert('Proceeding to checkout...');
    });

    // Initialize cart
    displayCartItems();
});

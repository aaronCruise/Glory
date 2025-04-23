document.addEventListener('DOMContentLoaded', function() {
    console.log("JS loaded");

    // Sample cart data (replace with actual API calls)
    let cartItems = [];

    fetch('/cart')
    .then(response => response.json())
    .then(data => {
       console.log("✅ Cart data:", data);
       cartItems = data.items || [];
       displayCartItems();
    })
    .catch(err => {
       console.error('❌ Error fetching cart:', err);
       document.querySelector('.cart-items').innerHTML = '<p class="empty-cart">Failed to load cart.</p>';
    });


    function displayCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        const numericPrice = +item.price.replace("$", "");
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
                    <p class="item-price">$${numericPrice.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.qty}" min="1">
                        <button class="quantity-btn increase">+</button>
                    </div>
                    <button class="remove-btn">Remove</button>
                </div>
            </div>
        `).join('');

        // Calculate total
        total = cartItems.reduce((sum, item) => sum + (numericPrice * item.qty), 0);

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
                        item.qty = parseInt(input.value);
                    }
                } else {
                    input.value = parseInt(input.value) + 1;
                    item.qty = parseInt(input.value);
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
                item.qty = parseInt(this.value);
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

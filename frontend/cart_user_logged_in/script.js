document.addEventListener('DOMContentLoaded', function () {
  console.log("🛒 Cart script loaded");

  const cartItemsContainer = document.querySelector('.cart-items');
  const cartSummary = document.querySelector('.cart-summary');
  const emptyCartMessage = document.querySelector('.empty-cart');
  const checkoutBtn = document.querySelector('.checkout-btn');

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  function displayCartItems() {
    let total = 0;

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '';
      cartSummary.style.display = 'none';
      emptyCartMessage.style.display = 'block';
      checkoutBtn.style.display = 'none';
      return;
    }

    emptyCartMessage.style.display = 'none';
    cartSummary.style.display = 'block';
    checkoutBtn.style.display = 'block';

    cartItemsContainer.innerHTML = cartItems.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="item-price">$${item.price.toFixed(2)}</p>
          <div class="quantity-controls">
            <button class="quantity-btn decrease">-</button>
            <input type="number" class="quantity-input" value="${item.qty}" min="1">
            <button class="quantity-btn increase">+</button>
          </div>
          <button class="remove-btn">Remove</button>
        </div>
      </div>
    `).join('');

    total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const summaryRows = document.querySelectorAll('.summary-row');
    summaryRows[0].innerHTML = `<span>Subtotal</span><span>$${total.toFixed(2)}</span>`;
    summaryRows[1].innerHTML = `<span>Shipping</span><span>Free</span>`;
    summaryRows[2].innerHTML = `<span>Total</span><span>$${total.toFixed(2)}</span>`;

    localStorage.setItem("cart", JSON.stringify(cartItems));
    addEventListeners();
  }

  function addEventListeners() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const input = this.parentElement.querySelector('.quantity-input');
        const itemId = this.closest('.cart-item').dataset.id;
        const item = cartItems.find(item => item.id === itemId);

        if (this.classList.contains('decrease') && input.value > 1) {
          input.value--;
        } else if (this.classList.contains('increase')) {
          input.value++;
        }

        item.qty = parseInt(input.value);
        displayCartItems();
      });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', function () {
        const itemId = this.closest('.cart-item').dataset.id;
        const item = cartItems.find(item => item.id === itemId);
        item.qty = parseInt(this.value);
        displayCartItems();
      });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const itemId = this.closest('.cart-item').dataset.id;
        cartItems = cartItems.filter(item => item.id !== itemId);
        displayCartItems();
      });
    });
  }

  // Checkout action (you can replace this with redirect if needed)
  checkoutBtn.addEventListener('click', () => {
    alert('Proceeding to checkout...');
    // Optionally redirect or clear cart:
    // localStorage.removeItem("cart");
    // location.href = "../checkout_success/index.html";
  });

  // Initialize cart view
  displayCartItems();
});


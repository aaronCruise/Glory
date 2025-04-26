// Logic for getting the items from backend to be displayed
// and Logic for displaying the correct number of items on each page
const NUM_PAGE_ITEMS = 6;
const API_URL = '/products';

const productList = document.getElementById('product-list');
const pagination = document.getElementById('pagination');
let items = [];
let totalPages = 0;

// Function to create the html for the product cards
function cHTML(product) {
    return `
    <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="price">${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>`
}

// Function to display the items on each shop page
function displayPage(page) {
    const startCard = (page - 1) * NUM_PAGE_ITEMS;
    const endCard = startCard + NUM_PAGE_ITEMS;
    const itemsSlice = items.slice(startCard, endCard);

    productList.innerHTML = itemsSlice.map(cHTML).join("");

    const paginationButtons = document.querySelectorAll('.pagination button');
    paginationButtons.forEach(button => button.classList.toggle('active', +button.textContent == page))

    // Add listener to add to cart buttons
    document.addEventListener("click", e => {
        if (!e.target.matches(".add-to-cart")) return;

        const id = +e.target.dataset.id;
        addToCart(id)
    });
}

// Function to build the pagination bar itself
function buildPagination() {
    pagination.innerHTML = '';

    for (let p = 1; p <= totalPages; p++) {
        const button = document.createElement('button');
        button.textContent = p;
        button.addEventListener('click', () => displayPage(p));
        pagination.appendChild(button);
    }
}

// Function to help initialize the shop
async function initializeShop() {
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        items = Array.isArray(json) ? json : json.items;
        totalPages = Math.ceil(items.length / NUM_PAGE_ITEMS);
        buildPagination();
        displayPage(1);
    } catch(err) {
        console.log("Failed to load products to be displayed:", err);
        productList.innerHTML = "<p style='color: royalblue;'>Products failed to load!</p>"
    }
}

// Function to add items to cart
function addToCart(id) {
    const product = items.find(item => item.id == id);
    if (!product) {
        alert("Product not found!");
        return;
    }
    
    console.log("🛒 Adding product:", product);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.id == product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        let cleanPrice = product.price;

        if (typeof cleanPrice === "string") {
            cleanPrice = parseFloat(cleanPrice.replace('$', '').replace(',', ''));
        }

        cart.push({
            id: product.id,
            name: product.name,
            price: cleanPrice != null ? cleanPrice : 0,
            image: product.image,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
}

document.addEventListener("DOMContentLoaded", initializeShop);

// Filter Button is Pressed
filter = document.document.getElementById("filter-label");
filter.addEventListener("click", () => {
    const list = document.getElementById("filter-list");
    if (filter.classList.contains("active")) {
        list.style.display = 'none';
    } else {
        list.style.display = 'inline-block';
    }
    fitler.toggle("active");
});

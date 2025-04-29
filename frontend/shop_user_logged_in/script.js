// Logic for getting the items from backend to be displayed
// and Logic for displaying the correct number of items on each page
const NUM_PAGE_ITEMS = 6;
const API_URL = '/products';

const productList = document.getElementById('product-list');
const pagination = document.getElementById('pagination');
let viewItems = [];
let allItems = [];
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
    const itemsSlice = viewItems.slice(startCard, endCard);

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

function applyCategory(cat) {
    viewItems = cat ? allItems.filter(p => p.category === cat) : allItems;

    totalPages = Math.ceil(viewItems.length / NUM_PAGE_ITEMS);
    buildPagination();
    displayPage(1);
}

function categoryHTML(category) {
    return `
    <li class="filter-item" data-value="${category.trim().toLowerCase()}">
    ${category.trim().charAt(0).toUpperCase() + category.trim().slice(1)}</li>
    `
}

function addListCategories() {
    const categories = [];
    for (let i = 0; i < allItems.length; i++) {
        let cat = allItems[i].category;
        if(!categories.includes(cat)) {
            categories.push(cat);
        }
    }
    const list = document.querySelector(".filter-list");
    const currentHTML = list.innerHTML;
    list.innerHTML = currentHTML + categories.map(categoryHTML).join("");
}

// Function to help initialize the shop
async function initializeShop() {
    try {
        const res = await fetch(API_URL);
        const json = await res.json();
        allItems = Array.isArray(json) ? json : json.items;
        viewItems = allItems;
        totalPages = Math.ceil(viewItems.length / NUM_PAGE_ITEMS);
        addListCategories();
        buildPagination();
        displayPage(1);
    } catch(err) {
        console.log("Failed to load products to be displayed:", err);
        productList.innerHTML = "<p style='color: royalblue;'>Products failed to load!</p>"
    }
}

// Function to add items to cart
function addToCart(id) {
    const product = viewItems.find(item => item.id == id);
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

// Filter logic
const filter = document.getElementById("category-filter");
const list = document.querySelector(".filter-list");
const label = document.querySelector(".filter-label");
let options = Array.from(list.children);
let open = false;

function toggleList(openNow = !open) {
    open = openNow;
    list.hidden = !open;
    filter.classList.toggle("open", open);
}

function closeList() {
    toggleList(false);
}

function selectOption(li) {
    options.forEach(o => o.removeAttribute("aria-selected"));
    li.setAttribute("aria-selected", "true");
    label.textContent = li.textContent;
    applyCategory(li.dataset.value);
    closeList();
}

filter.addEventListener("click", e => {
    if (!open) {
        toggleList(true);
        return;
    }

    const li = e.target.closest(".filter-list li");
    if (li) {
        selectOption(li);
    } else {
        closeList();
    }
});

document.addEventListener("click", e => {
    if (!filter.contains(e.target)) {
        closeList();
    }
});

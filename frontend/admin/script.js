document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("image");
    const preview = document.getElementById("image-preview");

    imageInput.addEventListener("change", () => {
        if (preview.classList.contains("active")) {
            preview.classList.toggle("active");
        }

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                preview.src = reader.result;
            };

            preview.classList.toggle("active");
            reader.readAsDataURL(file);
        } else {
            preview.src = '';
        }
    });


    // Initialize Category List
    const API_URL = '/products';
    let allItems = [];

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

    async function intializeCategoryList() {
        try {
            const res = await fetch(API_URL);
            const json = await res.json();
            allItems = Array.isArray(json) ? json : json.items;
            addListCategories();
        } catch(err) {
            console.log("Failed to load categories to be displayed:", err);
        }
    }

    intializeCategoryList();

        // Logic for putting selected category into input element
        document.querySelectorAll(".filter-list li").forEach(item => {
            item.addEventListener("click", () => {
            document.getElementById("discounts-category").value = item.dataset.value;
            document.querySelector(".filter-label").textContent = item.textContent;
            });
        });

    // Filter logic
    const filter = document.getElementById("category-filter");
    const list = document.querySelector(".filter-list");
    const label = document.querySelector(".filter-label");
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
        list.querySelectorAll('[aria-selected="true"]')
        .forEach(o => o.removeAttribute('aria-selected'));
        li.setAttribute("aria-selected", "true");
        label.textContent = li.textContent;
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
});
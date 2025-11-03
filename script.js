console.log("Script Loaded");

const cart = [];
let allProducts = [];

// Load and display products

async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();
    allProducts = data;

    // fill categories dropdown
    fillCategories(data);

    displayProducts(data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
loadProducts();

// Display products dynamically

function displayProducts(products) {
  const container = document.querySelector(".products-grid");
  container.innerHTML = "";

  container.innerHTML = products
    .map(
      (product) => `
      <div class="product-card" 
           data-id="${product.id}" 
           data-title="${product.title}" 
           data-price="${product.price}">
        <img src="${product.image}" alt="${product.title}" class="product-image" />
        <div class="product-name">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div class="product-buttons">
          <button class="btn btn-details">View Details</button>
          <button class="btn btn-cart">Add to Cart</button>
        </div>
      </div>
    `
    )
    .join("");

  addToCartEvents();
}

// Fill category dropdown

function fillCategories(products) {
  const select = document.getElementById("category");
  const categories = [
    "All Categories",
    ...new Set(products.map((p) => p.category)),
  ];

  select.innerHTML = categories
    .map((cat) => `<option value="${cat}">${cat}</option>`)
    .join("");
}

// Add-to-cart button listeners

function addToCartEvents() {
  document.querySelectorAll(".btn-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productElement = btn.closest(".product-card");
      const product = {
        id: +productElement.dataset.id,
        title: productElement.dataset.title,
        price: +productElement.dataset.price,
      };
      addItemToCart(product);
    });
  });
}

// Cart Logic

function addItemToCart(product) {
  const exists = cart.some((item) => item.id === product.id);
  if (!exists) {
    cart.push(product);
    console.log("Item added");
  } else {
    alert("Item already in your cart");
  }
  displayCartItems();
}

function displayCartItems() {
  const cartContainer = document.querySelector(".shopping-cart");

  cartContainer.innerHTML = "<h2>Shopping Cart</h2>";

  if (cart.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "cart-empty";
    emptyDiv.textContent = "Your cart is empty.";
    cartContainer.append(emptyDiv);
    return;
  }

  const list = document.createElement("div");
  list.className = "cart-list";

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.dataset.id = item.id;

    const title = document.createElement("div");
    title.className = "cart-title";
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "cart-meta";

    const priceText = document.createTextNode(`$${item.price.toFixed(2)} `);
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-item";
    removeBtn.dataset.id = item.id;
    removeBtn.textContent = "Remove";

    meta.append(priceText, removeBtn);
    row.append(title, meta);
    list.append(row);
  });

  cartContainer.append(list);

  // Remove button listeners
  cartContainer.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      removeItemFromCart(id);
    });
  });
}

function removeItemFromCart(id) {
  const idx = cart.findIndex((it) => it.id === id);
  if (idx > -1) {
    cart.splice(idx, 1);
    displayCartItems();
  }
}

// Filtering + Sorting Logic

// Apply Filters button
document.querySelector(".apply-btn").addEventListener("click", applyFilters);

// Sort select change
document.getElementById("sort").addEventListener("change", applyFilters);

function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice =
    parseFloat(document.getElementById("maxPrice").value) || Infinity;
  const sort = document.getElementById("sort").value;

  // Filter logic
  let filtered = allProducts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search);
    const matchesCategory =
      category === "All Categories" || p.category === category;
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort logic
  if (sort === "asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}

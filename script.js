console.log("Script Loaded");
const cart = [];
async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();

    const container = document.querySelector(".products-grid");
    container.innerHTML = "";

    container.innerHTML = data
      .map(
        (product) => `
        <div class="product-card" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" >
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
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
loadProducts();

// Adding event listeners to buttons that were rendered dynamically //
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

// Add to cart Logic

function addItemToCart(product) {
  const exists = cart.some((item) => item.id === product.id);
  if (!exists) {
    cart.push(product);
    console.log("item added");
  } else {
    alert("Iteam already in your cart");
  }
  displayCartItems();
}
function displayCartItems() {
  const cartContainer = document.querySelector(".shopping-cart");
  cartContainer.innerHTML = `
    <h2>Shopping Cart</h2>
    ${cart
      .map(
        (
          item
        ) => `<div>${item.title} - $${item.price} <button class="remove-item"> Remove </button></div>
    `
      )
      .join("")}
  `;
}

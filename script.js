console.log("Script Loaded");
async function loadProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const data = await res.json();

    const container = document.querySelector(".products-grid");
    container.innerHTML = "";

    container.innerHTML = data
      .map(
        (product) => `
        <div class="product-card" data-id="${product.id} data-title="${product.title}" data-price="${product.price}" >
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
function addToCartEvents() {
  document.querySelectorAll(".btn-cart").forEach((btn) => {
    btn.addEventListener("click");
  });
}

// ------------------ Product Data ------------------
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "smartphones",
    price: 1199,
    originalPrice: 1299,
    rating: 4.8,
    reviewCount: 2547,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
    description: "The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system.",
    inStock: true
  },
  {
    id: 2,
    name: "MacBook Pro 14-inch",
    category: "laptops",
    price: 1999,
    originalPrice: 2199,
    rating: 4.9,
    reviewCount: 1834,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    description: "Supercharged by M3 Pro and M3 Max chips. Built for Apple Intelligence. Up to 22 hours of battery life.",
    inStock: true
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    category: "headphones",
    price: 399,
    originalPrice: 449,
    rating: 4.7,
    reviewCount: 927,
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop",
    description: "Industry-leading noise cancellation headphones with crystal clear sound and comfortable design.",
    inStock: true
  },
  {
    id: 4,
    name: "Samsung Galaxy S23 Ultra",
    category: "smartphones",
    price: 1099,
    originalPrice: 1199,
    rating: 4.6,
    reviewCount: 1532,
    image: "s241.jpg",
    description: "Experience epic with the Galaxy S23 Ultra, featuring a 200MP camera and S Pen integration.",
    inStock: true
  },
  {
    id: 5,
    name: "Dell XPS 15",
    category: "laptops",
    price: 1599,
    originalPrice: 1799,
    rating: 4.5,
    reviewCount: 892,
    image: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?w=400&h=300&fit=crop",
    description: "Stunning 15-inch laptop with InfinityEdge display, Intel Core processors, and NVIDIA graphics.",
    inStock: false
  },
  {
    id: 6,
    name: "Apple AirPods Pro 2",
    category: "accessories",
    price: 249,
    originalPrice: 279,
    rating: 4.8,
    reviewCount: 2314,
    image: "https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?w=400&h=300&fit=crop",
    description: "AirPods Pro with Adaptive Audio, Personalized Volume, and 2x more Active Noise Cancellation.",
    inStock: true
  }
];

// ------------------ State ------------------
let cart = [];
let filteredProducts = [...products];

// ------------------ DOM Elements ------------------
const productsGrid = document.getElementById("productsGrid");
const productsCount = document.getElementById("productsCount");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sortSelect");
const productModal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// ------------------ Utility Functions ------------------
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ------------------ Render Products ------------------
function renderProducts(productsToRender) {
  productsGrid.innerHTML = "";

  if (productsToRender.length === 0) {
    productsGrid.innerHTML = `<p>No products found.</p>`;
    productsCount.textContent = "Showing 0 products";
    return;
  }

  productsToRender.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-rating">
          <div class="stars">${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}</div>
          <span class="rating-count">(${product.reviewCount})</span>
        </div>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.price)}</span>
          <span class="original-price">${formatPrice(product.originalPrice)}</span>
          <span class="discount">-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
        </div>
        <button class="add-to-cart" ${!product.inStock ? "disabled" : ""} data-id="${product.id}">
          ${product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    `;
    productsGrid.appendChild(productCard);

    // Product card click (open modal)
    productCard.querySelector(".product-image").addEventListener("click", () => openProductModal(product));
    productCard.querySelector(".product-title").addEventListener("click", () => openProductModal(product));

    // Add to cart button
    const addToCartBtn = productCard.querySelector(".add-to-cart");
    addToCartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product.id, 1);
    });
  });

  productsCount.textContent = `Showing ${productsToRender.length} products`;
}

// ------------------ Filtering & Sorting ------------------
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const category = btn.dataset.category;
    filteredProducts = category === "all" ? [...products] : products.filter(p => p.category === category);
    applySearchAndSort();
  });
});

sortSelect.addEventListener("change", applySearchAndSort);

searchInput.addEventListener("input", applySearchAndSort);

function applySearchAndSort() {
  const searchTerm = searchInput.value.toLowerCase();

  let result = filteredProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm)
  );

  const sortValue = sortSelect.value;
  switch (sortValue) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
    default:
      result.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderProducts(result);
}

// ------------------ Product Modal ------------------
function openProductModal(product) {
  modalBody.innerHTML = `
    <div class="product-details">
      <img src="${product.image}" alt="${product.name}" class="detail-image">
      <div class="detail-info">
        <h2>${product.name}</h2>
        <div class="product-rating">
          <div class="stars">${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}</div>
          <span class="rating-count">(${product.reviewCount})</span>
        </div>
        <p class="detail-description">${product.description}</p>
        <div class="product-price">
          <span class="current-price">${formatPrice(product.price)}</span>
          <span class="original-price">${formatPrice(product.originalPrice)}</span>
          <span class="discount">-${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
        </div>
        <div class="quantity-selector">
          <button class="quantity-btn" id="decreaseQty">-</button>
          <input type="number" id="quantityInput" value="1" min="1" class="quantity-input">
          <button class="quantity-btn" id="increaseQty">+</button>
        </div>
        <button class="add-to-cart" ${!product.inStock ? "disabled" : ""} data-id="${product.id}">
          ${product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  `;
  productModal.style.display = "block";

  const decreaseQty = document.getElementById("decreaseQty");
  const increaseQty = document.getElementById("increaseQty");
  const quantityInput = document.getElementById("quantityInput");
  const addToCartBtn = modalBody.querySelector(".add-to-cart");

  decreaseQty.addEventListener("click", () => {
    if (quantityInput.value > 1) quantityInput.value--;
  });
  increaseQty.addEventListener("click", () => {
    quantityInput.value++;
  });

  addToCartBtn.addEventListener("click", () => {
    addToCart(product.id, parseInt(quantityInput.value));
    productModal.style.display = "none";
  });
}

closeModal.addEventListener("click", () => {
  productModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === productModal) {
    productModal.style.display = "none";
  }
});

// ------------------ Cart ------------------
function addToCart(productId, quantity) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }

  updateCart();
  showNotification(`${product.name} added to cart`);
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let itemCount = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    itemCount += item.quantity;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="quantity-selector">
          <button class="quantity-btn decrease" data-id="${item.id}">-</button>
          <input type="number" value="${item.quantity}" min="1" class="quantity-input">
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
        </div>
      </div>
    `;
    cartItems.appendChild(cartItem);

    // Decrease
    cartItem.querySelector(".decrease").addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart = cart.filter(i => i.id !== item.id);
      }
      updateCart();
    });

    // Increase
    cartItem.querySelector(".increase").addEventListener("click", () => {
      item.quantity++;
      updateCart();
    });
  });

  cartCount.textContent = itemCount;
  cartTotal.textContent = formatPrice(total);
}

cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("open");
});

closeCart.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    showNotification("Your cart is empty", "error");
    return;
  }
  showNotification("Checkout successful!");
  cart = [];
  updateCart();
  cartSidebar.classList.remove("open");
});

// ------------------ Init ------------------
applySearchAndSort();

import { checkMode, darkMode, lightMode } from './mode.js';

checkMode();
displayProducts();

async function fetchAndFilterData(search = '') {
  try {
    const response = await fetch('../data/food-data.json');
    if (!response.ok) {
      throw new Error('Could not fetch data');
    }
    const data = await response.json();

    if (search) {
      return data.filter(product =>
        Object.values(product).some(
          value => typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to load products. Please try again later.'); // Reverted to alert
    return [];
  }
}

function renderProducts(filteredData) {
  const container = document.querySelector('main .products');
  container.innerHTML = '';

  if (filteredData.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 mt-10">No products found.</p>';
    container.style.fontSize = '4rem';
    return;
  }

  filteredData.forEach(product => {
    container.innerHTML += `
            <div class="product rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 transform transition-transform hover:scale-105">
                <div class="info p-4 flex flex-col justify-between h-full">
                    <span class="title text-lg font-semibold text-gray-900 dark:text-white mb-2">${
                      product.name
                    }</span>
                    <p class="description text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">${
                      product.description
                    }</p>
                    <span class="price text-xl font-bold text-green-600 dark:text-green-400">$${parseFloat(
                      product.price_usd
                    ).toFixed(2)}</span>
                </div>
                <img src="${product['preview-image'] || '../images/faild-to-load-zoom-2.png'}"
                     alt="${product.description}"
                     class="w-full h-48 object-cover object-center rounded-b-lg"
                     onerror="this.onerror=null;this.src='../images/faild-to-load-zoom-2.png';" />
            </div>
        `;
  });
}

function setupZoomAndCart(filteredData) {
  const products = document.querySelectorAll('main .product');
  const productZoom = document.querySelector('main .product-zoom');
  const productZoomBox = productZoom.querySelector('.product-zoom-box');
  const productZoomImg = productZoomBox.querySelector('.zoom-image');
  const productZoomTitle = productZoomBox.querySelector('.zoom-title');
  const productZoomDescription = productZoomBox.querySelector('.zoom-description');
  const productZoomPrice = productZoomBox.querySelector('.zoom-price');
  const productZoomCategory = productZoomBox.querySelector('.zoom-category');
  const productZoomOrigin = productZoomBox.querySelector('.zoom-origin');
  const productZoomCalories = productZoomBox.querySelector('.zoom-calories');
  const closeButton = productZoomBox.querySelector('.close-button');
  const addToCartBtn = productZoomBox.querySelector('.add-to-cart-btn');
  const layout = productZoom.querySelector('.layout');

  let currentProduct = null;

  products.forEach((product, index) => {
    product.addEventListener('click', () => {
      currentProduct = filteredData[index];
      productZoom.style.display = 'flex';
      productZoomImg.src = currentProduct['zoom-in-image'] || '../images/faild-to-load-zoom.png'; // Reverted to original image
      productZoomTitle.textContent = currentProduct.name;
      productZoomDescription.textContent = currentProduct.description;
      productZoomPrice.textContent = `$${parseFloat(currentProduct.price_usd).toFixed(2)}`;
      productZoomCategory.textContent = currentProduct.category;
      productZoomOrigin.textContent = currentProduct.origin_country;
      productZoomCalories.textContent = currentProduct.calories_per_100g;
    });
  });

  const closeZoom = () => (productZoom.style.display = 'none');
  closeButton.addEventListener('click', closeZoom);
  layout.addEventListener('click', closeZoom);

  addToCartBtn.addEventListener('click', () => {
    if (!currentProduct) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(currentProduct);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`🛒 "${currentProduct.name}" added to cart!`);
    updateCartCounter();
  });
}

async function displayProducts(search = '') {
  const filteredData = await fetchAndFilterData(search);
  renderProducts(filteredData);
  setupZoomAndCart(filteredData);
}

const inputElement = document.querySelector('main .search-bar input');
let debounceTimeout;

function searchProducts() {
  inputElement.addEventListener('input', event => {
    const inputText = event.target.value;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      displayProducts(inputText);
    }, 300);
  });
}
searchProducts();

const navToggleButton = document.querySelector('header .nav-icon-close');
const nav = document.querySelector('nav');
const navOverlay = nav.querySelector('.overlay');

let isNavOpen = false;

navToggleButton.addEventListener('click', () => {
  if (isNavOpen) {
    nav.style.display = '';
    navToggleButton.classList.replace('fa-xmark', 'fa-bars');
  } else {
    nav.style.display = 'flex';
    navToggleButton.classList.replace('fa-bars', 'fa-xmark');
  }
  isNavOpen = !isNavOpen;
});

navOverlay.addEventListener('click', () => {
  nav.style.display = '';
  navToggleButton.classList.replace('fa-xmark', 'fa-bars');
  isNavOpen = false;
});

const categoryItems = document.querySelectorAll('main .category-item');

categoryItems.forEach(item => {
  item.addEventListener('click', () => {
    categoryItems.forEach(cat => cat.classList.remove('active'));
    item.classList.add('active');

    const categoryText = item.querySelector('.category-text').textContent;
    inputElement.value = ''; // Clear search input on category change
    if (categoryText === 'All') {
      displayProducts('');
    } else {
      fetchAndFilterData().then(allProducts => {
        const categoryFiltered = allProducts.filter(
          product => product.category.toLowerCase() === categoryText.toLowerCase()
        );
        renderProducts(categoryFiltered);
        setupZoomAndCart(categoryFiltered);
      });
    }
  });
});

async function displayQuotes() {
  try {
    const response = await fetch('../data/quotes.json');
    if (!response.ok) {
      throw new Error('Failed to fetch quotes.');
    }
    const quotes = await response.json();

    let currentIndex = parseInt(localStorage.getItem('quoteIndex')) || 0;

    if (currentIndex >= quotes.length) {
      currentIndex = 0;
    }

    const quote = quotes[currentIndex];

    document.querySelector('footer .quotes .text').textContent = `"${quote.text}"`;
    document.querySelector('footer .quotes .author').textContent = `-${quote.author}`;

    localStorage.setItem('quoteIndex', currentIndex + 1);
  } catch (error) {
    console.error('Error loading quotes:', error);
    document.querySelector('footer .quotes .text').textContent =
      '“The only way to do great work is to love what you do.”';
    document.querySelector('footer .quotes .author').textContent = '- Steve Jobs';
  }
}

function changeQuote(time = 12000) {
  displayQuotes();
  setInterval(displayQuotes, time);
}
changeQuote();

const modeIcon = document.querySelector('nav .navbar ul .mode-icon i');

modeIcon.addEventListener('click', () => {
  if (localStorage.getItem('mode') === 'light') {
    darkMode();
    modeIcon.classList.replace('fa-moon', 'fa-sun');
  } else if (localStorage.getItem('mode') === 'dark') {
    lightMode();
    modeIcon.classList.replace('fa-sun', 'fa-moon');
  }
});

if (localStorage.getItem('mode') === 'light') {
  modeIcon.classList.replace('fa-sun', 'fa-moon');
} else if (localStorage.getItem('mode') === 'dark') {
  modeIcon.classList.replace('fa-moon', 'fa-sun');
}

function renderCart() {
  const cartDisplay = document.querySelector('.cart-display');
  const cartBox = document.querySelector('.cart-box');
  const cartItemsList = cartBox.querySelector('.cart-items');
  const cartTotalPrice = cartBox.querySelector('.cart-total-price');
  const cartFinalPrice = cartBox.querySelector('.cart-final-price');
  const cartDiscountAmount = cartBox.querySelector('.cart-discount-amount');
  const discountInput = cartBox.querySelector('.discount-code');
  const applyDiscountBtn = cartBox.querySelector('.apply-discount-btn');
  const discountMsg = cartBox.querySelector('.discount-msg');
  const discountRow = cartBox.querySelector('.discount-row');
  const checkoutBtn = cartBox.querySelector('.buy-btn');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentDiscount = 0;
  updateCartCounter();

  function updatePrices() {
    let total = cart.reduce((sum, item) => sum + parseFloat(item.price_usd || 0), 0);
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;

    if (currentDiscount > 0) {
      const discountValue = total * currentDiscount;
      cartDiscountAmount.textContent = `-$${discountValue.toFixed(2)}`;
      cartFinalPrice.textContent = `$${(total - discountValue).toFixed(2)}`;
      discountRow.style.display = 'block';
    } else {
      cartFinalPrice.textContent = `$${total.toFixed(2)}`;
      discountRow.style.display = 'none';
    }
  }

  cartItemsList.innerHTML = '';

  if (cart.length === 0) {
    cartItemsList.innerHTML =
      '<li class="text-gray-600 dark:text-gray-400 text-center py-4">Your cart is empty.</li>';
  } else {
    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.classList.add(
        'flex',
        'justify-between',
        'items-center',
        'py-2',
        'border-b',
        'border-gray-200',
        'dark:border-gray-700'
      );
      li.innerHTML = `
                <span class="text-gray-900 dark:text-white">${item.name} - $${parseFloat(
        item.price_usd
      ).toFixed(2)}</span>
                <button class="remove-item text-red-500 hover:text-red-700 text-xl font-bold transition-colors" title="Remove">&times;</button>
            `;
      li.querySelector('.remove-item').addEventListener('click', () => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
      cartItemsList.appendChild(li);
    });
  }

  applyDiscountBtn.onclick = () => {
    const code = discountInput.value.trim().toLowerCase();
    switch (code) {
      case 'itamar1':
        currentDiscount = 0.1;
        discountMsg.textContent = '✅ 10% discount applied!';
        discountMsg.style.color = 'green';
        break;
      case 'doronking':
        currentDiscount = 0.25;
        discountMsg.textContent = '🌱 25% veggie discount applied!';
        discountMsg.style.color = 'green';
        break;

      default:
        currentDiscount = 0;
        discountMsg.textContent = '❌ Invalid code.';
        discountMsg.style.color = 'red';
    }
    updatePrices();
  };

  checkoutBtn.onclick = () => {
    if (cart.length === 0) {
      alert('🛒 Your cart is empty!'); // Reverted to alert
      return;
    }

    alert('✅ Thank you for your purchase!'); // Reverted to alert
    localStorage.removeItem('cart');
    cart = [];
    renderCart();
    updateCartCounter();
  };

  updatePrices();
}

const openCartBtn = document.querySelector('nav .cart-icon');
const cartDisplay = document.querySelector('.cart-display');
const cartLayout = cartDisplay.querySelector('.layout');
const closeCartBtn = cartDisplay.querySelector('.close-icon');

openCartBtn.addEventListener('click', () => {
  cartDisplay.style.display = 'flex';
  renderCart();
  nav.style.display = '';
  navToggleButton.classList.replace('fa-xmark', 'fa-bars');
  isNavOpen = false;
});

cartLayout.addEventListener('click', () => {
  cartDisplay.style.display = 'none';
});

closeCartBtn.addEventListener('click', () => {
  cartDisplay.style.display = 'none';
});

const cartCountElement = document.querySelector('.cart-icon .cart-count');

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCountElement.textContent = cart.length;
}

updateCartCounter();

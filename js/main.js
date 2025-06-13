import { checkMode, darkMode, lightMode } from './mode.js';

checkMode();

const container = document.querySelector('main .products');

displayProducts();

async function fetchAndFilterData(search = '') {
  try {
    const response = await fetch('../data/food-data.json');
    if (!response.ok) throw new Error('Could not fetch data');

    const data = await response.json();
    return data.filter(product =>
      Object.values(product).some(
        value => typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())
      )
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

function renderProducts(filteredData) {
  const container = document.querySelector('main .products');
  container.innerHTML = '';

  filteredData.forEach(product => {
    container.innerHTML += `
      <div class="product">
        <div class="info">
          <span class="title">${product.name}</span>
          <p class="description">${product.description}</p>
          <span class="price">$${product.price_usd}</span>
        </div>
        <img src="${product['preview-image'] || '../images/faild-to-load-zoom-2.png'}" alt="${
      product.description
    }" />
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
      productZoomImg.src = currentProduct['zoom-in-image'] || '../images/faild-to-load-zoom.png';
      productZoomTitle.textContent = currentProduct.name;
      productZoomDescription.textContent = currentProduct.description;
      productZoomPrice.textContent = `$${currentProduct.price_usd}`;
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
    }, 1000);
  });
}

searchProducts();

const element = document.querySelector('header .nav-icon-close');
const nav = document.querySelector('nav');
const overlay = nav.querySelector('.overlay');

let isOpen = false;

element.addEventListener('click', () => {
  if (isOpen) {
    nav.style.display = '';
    element.classList.replace('fa-xmark', 'fa-bars');
    isOpen = !isOpen;
    return;
  }

  nav.style.display = 'flex';
  element.classList.replace('fa-bars', 'fa-xmark');
  isOpen = !isOpen;
});

overlay.addEventListener('click', () => {
  nav.style.display = '';
  element.classList.replace('fa-xmark', 'fa-bars');
});

async function displayQuotes() {
  try {
    const response = await fetch('../data/quotes.json');
    if (!response.ok) throw new Error('Failed to fetch quotes.');

    const quotes = await response.json();

    let currentIndex = parseInt(localStorage.getItem('quoteIndex')) || 0;

    const quote = quotes[currentIndex];

    if (currentIndex >= quotes.length) {
      currentIndex = 0;
      localStorage.setItem('quoteIndex', 0);
    }

    document.querySelector('footer .quotes .text').textContent = `"${quote.text}"`;
    document.querySelector('footer .quotes .author').textContent = `-${quote.author}`;
  } catch (error) {
    console.error('Error loading quotes:', error);
  }
}

function changeQuote(time = 12000) {
  displayQuotes();
  setInterval(displayQuotes, time);
  setInterval(() => {
    let currentIndex = parseInt(localStorage.getItem('quoteIndex')) || 0;
    localStorage.setItem('quoteIndex', currentIndex + 1);
  }, time);
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

async function zoomIn() {
  let data;

  try {
    const respond = await fetch('../data/food-data.json');

    if (!respond.ok) {
      throw new Error('Could not fetch data');
    }

    data = await respond.json();
  } catch (error) {
    console.log(error + 'ol');
  }

  products.forEach((product, index) => {
    product.addEventListener('click', () => {
      console.log('d');
      productZoom.style.display = 'flex';
      productZoomImg.src = data[index]['zoom-in-image'];
    });
  });
}

zoomIn();

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
  const closeCartBtn = cartBox.querySelector('.close-cart');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let discount = 0;

  function updatePrices() {
    let total = cart.reduce((sum, item) => sum + parseFloat(item.price_usd || 0), 0);
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;

    if (discount > 0) {
      const discountAmount = total * discount;
      cartDiscountAmount.textContent = `-$${discountAmount.toFixed(2)}`;
      cartFinalPrice.textContent = `$${(total - discountAmount).toFixed(2)}`;
      discountRow.style.display = 'block';
    } else {
      cartFinalPrice.textContent = `$${total.toFixed(2)}`;
      discountRow.style.display = 'none';
    }
  }

  cartItemsList.innerHTML = '';

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} - $${parseFloat(item.price_usd).toFixed(2)}</span>
      <button class="remove-item" title="Remove">&times;</button>
    `;
    li.querySelector('.remove-item').addEventListener('click', () => {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });
    cartItemsList.appendChild(li);
  });

  applyDiscountBtn.addEventListener('click', () => {
    const code = discountInput.value.trim().toLowerCase();
    switch (code) {
      case 'itamar':
        discount = 0.1;
        discountMsg.textContent = '✅ 10% discount applied!';
        break;
      case 'doronking':
        discount = 0.25;
        discountMsg.textContent = '🌱 25% veggie discount applied!';
        break;
      case 'raz':
        discount = 10;
        discountMsg.textContent = '🛒 -200%  discount applied!';
        break;
      default:
        discount = 0;
        discountMsg.textContent = '❌ Invalid code.';
    }

    updatePrices();
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('🛒 Your cart is empty!');
      return;
    }

    alert('✅ Thank you for your purchase!');
    localStorage.removeItem('cart');
    cart = [];
    renderCart();
  });

  updatePrices();
}

const openCartBtn = document.querySelector('nav .cartBtn');
const cartDisplay = document.querySelector('.cart-display');
const cartBox = cartDisplay.querySelector('.cart-box');
const layout = cartDisplay.querySelector('.layout');
const closeCartBtn = cartDisplay.querySelector('.close-icon');

openCartBtn.addEventListener('click', () => {
  cartDisplay.style.display = 'flex';
  renderCart();
  nav.style.display = '';
  element.classList.replace('fa-xmark', 'fa-bars');
  isOpen = !isOpen;
});

layout.addEventListener('click', () => {
  cartDisplay.style.display = 'none';
});

closeCartBtn.addEventListener('click', () => {
  cartDisplay.style.display = 'none';
});

import { checkMode, darkMode, lightMode } from './mode.js';

checkMode();

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
  isOpen = false;
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

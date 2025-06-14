let currentMode = 'dark';

function darkMode() {
  localStorage.setItem('mode', 'dark');
  currentMode = 'dark';

  const root = document.documentElement;

  root.style.setProperty('--header-background-color', 'rgb(83, 125, 93)');
  root.style.setProperty('--header-logo-color', 'rgb(231, 255, 237)');

  root.style.setProperty('--nav-navbar-background-color', 'rgb(54, 59, 51)');
  root.style.setProperty('--nav-navbar-color', 'rgb(255, 255, 255)');
  root.style.setProperty('--nav-overlay-background-color', 'rgba(31, 41, 27, 0.253)');

  root.style.setProperty('--backgrounsd-color', 'rgb(158, 188, 138)');
  root.style.setProperty('--main-search-background-color', 'rgb(47, 66, 52)');
  root.style.setProperty('--main-product-border-color', 'rgb(31, 41, 27)');
  root.style.setProperty('--main-producsdlt-title-color', 'rgb(45, 55, 72)');
}

function lightMode() {
  localStorage.setItem('mode', 'light');
  currentMode = 'light';

  const root = document.documentElement;

  root.style.setProperty('--header-background-color', 'rgb(155, 170, 148)');
  root.style.setProperty('--header-logo-color', 'rgb(68, 71, 68)');

  root.style.setProperty('--nav-navbar-background-color', 'rgb(223, 236, 216)');
  root.style.setProperty('--nav-navbar-color', 'rgb(0, 0, 0)');
  root.style.setProperty('--nav-overlay-background-color', 'rgba(31, 41, 27, 0.253)');

  root.style.setProperty('--background-color', 'rgb(236, 250, 229)');
  root.style.setProperty('--main-search-background-color', 'rgb(119, 133, 123)');
  root.style.setProperty('--main-product-border-color', 'rgb(98, 114, 92)');
  root.style.setProperty('--main-product-title-color', 'rgb(45, 55, 72)');
}

function checkMode() {
  if (!localStorage.getItem('mode')) {
    localStorage.setItem('mode', 'light');
  }

  if (localStorage.getItem('mode') === 'dark') {
    darkMode();
    return;
  }

  lightMode();
}

export { checkMode, darkMode, lightMode, currentMode };

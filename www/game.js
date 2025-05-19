const coinBtn = document.getElementById('coinButton');
const coinCounter = document.getElementById('coinCounter');
const autoUpgrade = document.getElementById('autoUpgrade');
const shopBtn = document.getElementById('shopBtn');
const settingsBtn = document.getElementById('settingsBtn');
const toggleTheme = document.getElementById('toggleTheme');
const toggleSound = document.getElementById('toggleSound');
const buyMultiplierBtn = document.getElementById('buyMultiplier');
const buyAutoBtn = document.getElementById('buyAuto');

// Game state
let coins = parseInt(localStorage.getItem('coins')) || 0;
let multiplier = parseInt(localStorage.getItem('multiplier')) || 1;
let autoClickLevel = parseInt(localStorage.getItem('autoClickLevel')) || 0;
let soundEnabled = localStorage.getItem('sound') === 'true';
let theme = localStorage.getItem('theme') || 'light';
let autoClickerActive = localStorage.getItem('autoClickerActive') === 'true';

// Apply theme
if (theme === 'dark') {
  document.body.classList.add('dark');
  if (toggleTheme) toggleTheme.checked = true;
}

// Apply autoclicker button state
if (autoClickerActive && autoClickLevel > 0) {
  autoUpgrade.style.backgroundColor = '#4caf50';
  startAutoClicker();
} else {
  autoUpgrade.style.backgroundColor = '#ff4444';
}

// UI update
function updateUI() {
  coinCounter.textContent = `Coins: ${coins}`;
  buyMultiplierBtn.textContent = `x2 | ${50 * multiplier}💰 | Lvl ${multiplier}`;
  buyAutoBtn.textContent = `Авто | ${50 + autoClickLevel * 25}💰 | Lvl ${autoClickLevel}`;
  localStorage.setItem('coins', coins);
  localStorage.setItem('multiplier', multiplier);
  localStorage.setItem('autoClickLevel', autoClickLevel);
  localStorage.setItem('theme', theme);
  localStorage.setItem('sound', soundEnabled);
  localStorage.setItem('autoClickerActive', autoClickerActive);
}

// Coin button animation setup
let currentGradientX = 50;
let currentGradientY = 50;
let currentHighlightX = 30;
let currentHighlightY = 30;

function updateCoinStyle() {
  coinBtn.style.setProperty('--gradient-x', currentGradientX + '%');
  coinBtn.style.setProperty('--gradient-y', currentGradientY + '%');
  coinBtn.style.setProperty('--highlight-x', currentHighlightX + 'px');
  coinBtn.style.setProperty('--highlight-y', currentHighlightY + 'px');
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

let targetGradientX = 50;
let targetGradientY = 50;
let targetHighlightX = 30;
let targetHighlightY = 30;

function animate() {
  currentGradientX = lerp(currentGradientX, targetGradientX, 0.2);
  currentGradientY = lerp(currentGradientY, targetGradientY, 0.2);
  currentHighlightX = lerp(currentHighlightX, targetHighlightX, 0.3);
  currentHighlightY = lerp(currentHighlightY, targetHighlightY, 0.3);
  updateCoinStyle();
  requestAnimationFrame(animate);
}
animate();

// Coin click
coinBtn.addEventListener('mousedown', (e) => {
  coins += multiplier;
  updateUI();
  if (soundEnabled) playSound();
  triggerClickEffect(coinBtn);

  const rect = coinBtn.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const offsetX = (e.clientX - centerX) / (rect.width / 2);
  const offsetY = (e.clientY - centerY) / (rect.height / 2);
  const rotateX = offsetY * -15;
  const rotateY = offsetX * 10;
  coinBtn.style.setProperty('--rotate-x', rotateX + 'deg');
  coinBtn.style.setProperty('--rotate-y', rotateY + 'deg');
  targetGradientX = 50 - offsetX * 20;
  targetGradientY = 50 - offsetY * 20;
  targetHighlightX = 30 - offsetX * 15;
  targetHighlightY = 30 - offsetY * 15;
});

function resetCoin() {
  coinBtn.style.setProperty('--rotate-x', '0deg');
  coinBtn.style.setProperty('--rotate-y', '0deg');
  targetGradientX = 50;
  targetGradientY = 50;
  targetHighlightX = 30;
  targetHighlightY = 30;
}

coinBtn.addEventListener('mouseup', resetCoin);
coinBtn.addEventListener('mouseleave', resetCoin);

function playSound() {
  const audio = new Audio('https://www.myinstants.com/media/sounds/mario-coin.mp3');
  audio.play();
}

// Autoclick toggle
autoUpgrade.addEventListener('click', () => {
  if (autoClickLevel > 0) {
    autoClickerActive = !autoClickerActive;
    localStorage.setItem('autoClickerActive', autoClickerActive);
    if (autoClickerActive) {
      startAutoClicker();
      autoUpgrade.style.backgroundColor = '#4caf50';
      alert(`Автокликер включён (уровень ${autoClickLevel})`);
    } else {
      clearInterval(window.autoClicker);
      autoUpgrade.style.backgroundColor = '#ff4444';
      alert('Автокликер выключен');
    }
    triggerClickEffect(autoUpgrade);
  } else {
    alert('Сначала купите автокликер в магазине!');
  }
});

// Autoclick loop
function startAutoClicker() {
  clearInterval(window.autoClicker);
  if (autoClickLevel > 0 && autoClickerActive) {
    window.autoClicker = setInterval(() => {
      coins += multiplier * autoClickLevel;
      updateUI();
    }, 1000);
  }
}

// Theme & sound
if (toggleTheme) {
  toggleTheme.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    theme = toggleTheme.checked ? 'dark' : 'light';
    updateUI();
  });
}

if (toggleSound) {
  toggleSound.checked = soundEnabled;
  toggleSound.addEventListener('change', () => {
    soundEnabled = toggleSound.checked;
    updateUI();
  });
}

// Shop purchases
buyMultiplierBtn.addEventListener('click', () => {
  const cost = 50 * multiplier;
  if (coins >= cost) {
    coins -= cost;
    multiplier++;
    updateUI();
    alert(`Множитель увеличен! Теперь: x${multiplier}`);
    triggerClickEffect(buyMultiplierBtn);
  } else {
    alert(`Не хватает монет. Нужно ${cost}`);
  }
});

buyAutoBtn.addEventListener('click', () => {
  const cost = 50 + autoClickLevel * 25;
  if (coins >= cost) {
    coins -= cost;
    autoClickLevel++;
    updateUI();
    startAutoClicker();
    alert(`Автоклик улучшен до уровня ${autoClickLevel}`);
    triggerClickEffect(buyAutoBtn);
  } else {
    alert(`Не хватает монет. Нужно ${cost}`);
  }
});

// Modal windows
shopBtn.addEventListener('click', () => {
  openModal('shopModal');
  triggerClickEffect(shopBtn);
});
settingsBtn.addEventListener('click', () => {
  openModal('settingsModal');
  triggerClickEffect(settingsBtn);
});

function openModal(id) {
  const modal = document.getElementById(id);
  modal.style.display = 'flex';
  modal.classList.add('modal-open');
}
function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('modal-open');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300); // Match CSS animation duration
}

// Click effect
function triggerClickEffect(button) {
  button.classList.add('clicked');
  setTimeout(() => {
    button.classList.remove('clicked');
  }, 200);
}

updateUI();
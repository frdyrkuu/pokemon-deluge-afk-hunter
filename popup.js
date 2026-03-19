function getActiveFilters() {
  return Array.from(document.querySelectorAll('.filter-chip.active'))
    .map(el => el.dataset.type);
}

function saveFilters(filters) {
  sessionStorage.setItem('huntFilters', JSON.stringify(filters));
}

function loadFilters() {
  try {
    return JSON.parse(sessionStorage.getItem('huntFilters')) || null;
  } catch { return null; }
}

function applyFilters(filters) {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.classList.toggle('active', filters.includes(chip.dataset.type));
  });
  updateToggleLabel();
}

function sendMsg(action, filters = []) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    chrome.tabs.sendMessage(tabs[0].id, { action, filters }, (response) => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript(
          { target: { tabId: tabs[0].id }, files: ["content.js"] },
          () => {
            setTimeout(() => {
              chrome.tabs.sendMessage(tabs[0].id, { action, filters });
            }, 300);
          }
        );
      }
    });
  });
}

function setStatus(state) {
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  dot.className = 'dot';
  if (state === 'hunting') {
    dot.classList.add('active');
    txt.textContent = 'Hunting...';
  } else if (state === 'stopped') {
    dot.classList.add('stopped');
    txt.textContent = 'Stopped';
  } else {
    txt.textContent = 'Ready to hunt';
  }
}

// Filter chip toggles
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('active');
    updateToggleLabel();
    saveFilters(getActiveFilters());
  });
});

function updateToggleLabel() {
  const all = document.querySelectorAll('.filter-chip');
  const active = document.querySelectorAll('.filter-chip.active');
  document.getElementById('toggleAll').textContent =
    active.length === all.length ? 'Deselect all' : 'Select all';
}

document.getElementById('toggleAll').addEventListener('click', () => {
  const all = document.querySelectorAll('.filter-chip');
  const active = document.querySelectorAll('.filter-chip.active');
  const shouldSelect = active.length < all.length;
  all.forEach(c => c.classList.toggle('active', shouldSelect));
  updateToggleLabel();
  saveFilters(getActiveFilters());
});

// Load saved filters on open
const saved = loadFilters();
if (saved) {
  applyFilters(saved);
} else {
  updateToggleLabel();
}

document.getElementById('startBtn').onclick = () => {
  const filters = getActiveFilters();
  if (filters.length === 0) return;
  saveFilters(filters);
  sendMsg('start', filters);
  setStatus('hunting');
};

document.getElementById('stopBtn').onclick = () => {
  sendMsg('stop');
  setStatus('stopped');
};
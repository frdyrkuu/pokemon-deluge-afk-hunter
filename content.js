let running = false;
let activeFilters = [];

const legendarySound = new Audio(chrome.runtime.getURL("pokemon_battle.mp3"));

// 🛑 STOP via ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    running = false;
    console.log("🛑 Stopped manually");
  }
});

// 🚶 movement
function getValidMove() {
  const moves = document.querySelectorAll('[data-dir]');
  const valid = Array.from(moves).filter(el => {
    const isBlocked = el.title.includes("Blocked");
    const isDisabled = el.querySelector(".m-disable") !== null;
    return !isBlocked && !isDisabled;
  });
  return valid[Math.floor(Math.random() * valid.length)];
}

// 🌟 DETECT by rarity
function isRarityMatch() {
  const mapContext = document.querySelector("#mapcontext");
  if (!mapContext) return false;
  const text = mapContext.textContent.toLowerCase();
  if (activeFilters.includes("legendary") && text.includes("legendary")) return "Legendary";
  if (activeFilters.includes("paradox") && text.includes("paradox")) return "Paradox";
  return false;
}

// 🎨 DETECT by pokemon type prefix
function isTypeMatch() {
  const dexy = document.querySelector("#dexy");
  if (!dexy) return false;
  const text = dexy.textContent.toLowerCase();
  const typeFilters = activeFilters.filter(f => !["legendary", "paradox"].includes(f));
  return typeFilters.some(type => text.includes(type));
}

// 🎯 detect ANY encounter
function isEncounter() {
  return !!document.querySelector("#hp");
}

async function autoHunt() {
  running = true;
  console.log("🚀 Auto Hunt Started | Filters:", activeFilters);

  while (running) {
    if (isEncounter()) {
      const rarityMatch = isRarityMatch();
      const typeMatch = isTypeMatch();

      if (rarityMatch || typeMatch) {
        running = false;
        legendarySound.play();
        const label = rarityMatch || "Type Match";
        console.log(`🌟 Stopped: ${label} detected`);
        break;
      } else {
        console.log("❌ No match, continue...");
      }
    }

    const btn = getValidMove();
    if (!btn) break;
    btn.click();
    await new Promise(r => setTimeout(r, 600));
  }

  console.log("⛔ Loop Ended");
}

function stopHunt() {
  running = false;
  console.log("🛑 Stopped via popup");
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "start") {
    activeFilters = msg.filters || [];
    autoHunt();
  }
  if (msg.action === "stop") stopHunt();
});
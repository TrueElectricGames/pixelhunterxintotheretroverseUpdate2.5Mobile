window.onload = () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
canvas.height = 600;
canvas.style.maxWidth = '100%';
canvas.style.height = 'auto';


















  const screens = {
    main: document.getElementById('main-menu'),
    mode: document.getElementById('mode-select'),
    shop: document.getElementById('shop'),
    skins: document.getElementById('skins'),
    achievements: document.getElementById('achievements'),
    update: document.getElementById('update-log'),
    quests: document.getElementById('patriotic-quests'),
    events: document.getElementById('events'),
    back: document.getElementById('game-back-btn'),
    patrioticShop: document.getElementById('patriotic-shop'),
    patrioticUpgrades: document.getElementById('patriotic-upgrades')
  };
















    let player, bullets = [], enemies = [], barriers = [];
  let level = 1;
  let lives = 3;
  let coins = parseInt(localStorage.getItem('coins') || '0');
  let stars = parseInt(localStorage.getItem('stars') || '0');
  let mode = 'classic';
  let gameRunning = false;
  let canShoot = true;
















  let upgrades = {
    speed: parseInt(localStorage.getItem('upgrade_speed') || '0'),
    fireRate: parseInt(localStorage.getItem('upgrade_fireRate') || '0'),
    doubleLaser: parseInt(localStorage.getItem('upgrade_doubleLaser') || '0')
  };
















  let patrioticUpgrades = {
    damage: parseInt(localStorage.getItem('patriotic_damage') || '0'),
    speed: parseInt(localStorage.getItem('patriotic_speed') || '0'),
    triple: parseInt(localStorage.getItem('patriotic_triple') || '0')
  };
















  let ownedSkins = JSON.parse(localStorage.getItem('ownedSkins') || '["red-blue"]');
  let activeSkin = localStorage.getItem('activeSkin') || 'red-blue';
  hasInfernoTrail = ownedSkins.includes('inferno-galaxy');
  let totalKills = parseInt(localStorage.getItem('totalKills') || '0');
  let questProgress = JSON.parse(localStorage.getItem('patriotic_quests') || '{"kills":0,"coins":0,"boss":false}');
















  function getPatrioticCosts() {
    return {
      damage: 125 + patrioticUpgrades.damage * 75,
      speed: 75 + patrioticUpgrades.speed * 50,
      triple: 900
    };
  }
















  function updateEventTimer() {
    const now = new Date();
    const end = new Date("2025-07-04T00:00:00");
    const diff = end - now;
    if (diff <= 0) {
      document.getElementById('event-timer').textContent = "🎆 Patriotic Event is over!";
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const timer = `${d}d ${h}h ${m}m ${s}s`;
    document.getElementById('event-timer').textContent = `⏳ Time Remaining: ${timer}`;
  }
  setInterval(updateEventTimer, 1000);
















  // === Button Event Listeners ===
document.getElementById("play-btn").onclick = () => showModeSelect();
document.getElementById("shop-btn").onclick = () => openShop();
document.getElementById("skins-btn").onclick = () => openSkins();
document.getElementById("events-btn").onclick = () => openEvents(); document.getElementById("patriotic-shop-btn").onclick = () => openPatrioticShop(); document.getElementById("patriotic-upgrades-btn").onclick = () => openPatrioticUpgrades();
document.getElementById("patriotic-quests-btn").onclick = () => openPatrioticQuests();
document.getElementById("update-log-btn").onclick = () => openUpdateLog();
document.getElementById("achievements-btn").onclick = () => openAchievements();
document.getElementById("exit-game-btn").onclick = () => goHome(); document.querySelectorAll(".back-btn").forEach(btn => btn.onclick = goHome); document.getElementById("classic-btn").onclick = () => startGame("classic"); document.getElementById("endless-btn").onclick = () => startGame("endless"); document.getElementById("patriotic-mode-btn").onclick = () => startGame("patriotic"); document.getElementById("patriotic-mode-btn-2").onclick = () => startGame("patriotic");








// Add upgrade buttons event listeners here:
document.getElementById('upgrade-speed').onclick = () => {
  const cost = 75 + upgrades.speed * 50;
  if (coins >= cost && upgrades.speed < 5) {
    coins -= cost;
    upgrades.speed++;
    saveAll();
    openShop(); // refresh
  }
};








document.getElementById('upgrade-fire').onclick = () => {
  const cost = 125 + upgrades.fireRate * 75;
  if (coins >= cost && upgrades.fireRate < 5) {
    coins -= cost;
    upgrades.fireRate++;
    saveAll();
    openShop(); // refresh
  }
};








document.getElementById('upgrade-double').onclick = () => {
  if (coins >= 2500 && upgrades.doubleLaser === 0) {
    coins -= 2500;
    upgrades.doubleLaser = 1;
    saveAll();
    openShop(); // refresh
  }
};
















  function showModeSelect() {
    hideAll();
    screens.mode.classList.remove('hidden');
  }
















  function goHome() {
    gameRunning = false;
    hideAll();
    screens.main.classList.remove('hidden');
    document.body.classList.remove('patriotic-mode');
    saveAll();
  }
















  function hideAll() {
    for (let key in screens) screens[key].classList.add('hidden');
    canvas.style.display = 'none';
  }
















 function openShop() {
  hideAll();
  screens.shop.classList.remove('hidden');
  document.getElementById('coin-count').textContent = coins;








  const speedLevel = upgrades.speed;
  const fireLevel = upgrades.fireRate;








  const speedBtn = document.getElementById('upgrade-speed');
  const fireBtn = document.getElementById('upgrade-fire');
  const doubleBtn = document.getElementById('upgrade-double');








  // Speed
  const speedCost = 75 + speedLevel * 50;
  document.getElementById('speed-cost').textContent =
    speedLevel >= 5 ? '💨 Speed Upgrade: MAXED' : `💨 Speed Upgrade (Cost: ${speedCost} Coins)`;
  speedBtn.disabled = speedLevel >= 5;








  // Fire Rate
  const fireCost = 125 + fireLevel * 75;
  document.getElementById('fire-cost').textContent =
    fireLevel >= 5 ? '⚡ Fire Rate Upgrade: MAXED' : `⚡ Fire Rate Upgrade (Cost: ${fireCost} Coins)`;
  fireBtn.disabled = fireLevel >= 5;








  // Triple Laser (doubleLaser)
  doubleBtn.disabled = upgrades.doubleLaser > 0;
  doubleBtn.textContent = upgrades.doubleLaser > 0 ? '✅ Triple Laser Unlocked' : 'Unlock Triple Laser';
}
















  function openSkins() {
    hideAll();
    screens.skins.classList.remove('hidden');
    loadSkins();
  }
















  function openAchievements() {
    hideAll();
    screens.achievements.classList.remove('hidden');
  }
















  function openUpdateLog() {
    hideAll();
    screens.update.classList.remove('hidden');
  }
















  function openPatrioticQuests() {
    hideAll();
    screens.quests.classList.remove('hidden');
    updatePatrioticQuestsUI();
  }
















  function openEvents() {
    hideAll();
    screens.events.classList.remove('hidden');
  }
















  function openPatrioticShop() {
  hideAll();
  screens.patrioticShop.classList.remove('hidden');
  document.getElementById('star-count').textContent = stars;
















  const skinBtn = document.getElementById('buy-patriotic-skin');
  const skinCostText = document.querySelector('#patriotic-shop p strong');
















  if (ownedSkins.includes('gold-rainbow')) {
    skinBtn.disabled = true;
    skinBtn.textContent = "✅ Owned";
    skinCostText.innerHTML = "🎁 Golden Rainbow Skin - Owned";
  } else {
    skinBtn.disabled = stars < 30000;
    skinBtn.textContent = "Unlock Skin";
    skinCostText.innerHTML = "🎁 Golden Rainbow Skin - 30,000 Fireworks";
  }
}
document.getElementById('buy-patriotic-skin').onclick = () => {
  if (!ownedSkins.includes('gold-rainbow')) {
    if (stars >= 30000) {
      stars -= 30000;
      ownedSkins.push('gold-rainbow');
      alert("🎉 You unlocked the Golden Rainbow Skin!");
      saveAll();
      openPatrioticShop(); // Refresh UI
    } else {
      alert("❌ Not enough Fireworks!");
    }
  } else {
    alert("✅ You already own this skin!");
  }
};








document.getElementById('buy-neon-patriotic-skin').onclick = () => {
  if (!ownedSkins.includes('neon-patriotic')) {
    if (stars >= 50000) {
      stars -= 50000;
      ownedSkins.push('neon-patriotic');
      alert("🌈 You unlocked the Neon Rainbow Patriotic Skin!");
      saveAll();
      openPatrioticShop(); // Refresh UI
    } else {
      alert("❌ Not enough Fireworks!");
    }
  } else {
    alert("✅ You already own this skin!");
  }
};




// 🔥🌌 Buy Inferno Galaxy Skin
document.getElementById('buy-inferno-galaxy').onclick = () => {
  if (!ownedSkins.includes('inferno-galaxy')) {
    if (stars >= 90000) {
      stars -= 90000;
      ownedSkins.push('inferno-galaxy');
      hasInfernoTrail = true;
      alert("🔥🌌 You unlocked the Inferno Galaxy Skin!");
      saveAll();
      openPatrioticShop();
    } else {
      alert("❌ Not enough Fireworks!");
    }
  } else {
    alert("✅ You already own this skin!");
  }
};
























  function openPatrioticUpgrades() {
    hideAll();
    screens.patrioticUpgrades.classList.remove('hidden');
    const costs = getPatrioticCosts();
















    document.getElementById('patriotic-stars').textContent = stars;
















    // DAMAGE Upgrade
    const damageBtn = document.getElementById('patriotic-damage');
    const damageCostElem = document.getElementById('cost-damage');
    damageCostElem.textContent =
      patrioticUpgrades.damage >= 5 ? '✅ Max' : costs.damage;
    damageBtn.disabled = patrioticUpgrades.damage >= 5;
    damageBtn.textContent = patrioticUpgrades.damage >= 5
      ? 'Max Damage Reached'
      : `Upgrade Damage (Level ${patrioticUpgrades.damage} / 5)`;
















    // SPEED Upgrade
    const speedBtn = document.getElementById('patriotic-speed');
    const speedCostElem = document.getElementById('cost-speed');
    speedCostElem.textContent =
      patrioticUpgrades.speed >= 5 ? '✅ Max' : costs.speed;
    speedBtn.disabled = patrioticUpgrades.speed >= 5;
    speedBtn.textContent = patrioticUpgrades.speed >= 5
      ? 'Max Speed Reached'
      : `Upgrade Speed (Level ${patrioticUpgrades.speed} / 5)`;
















    // TRIPLE SHOT Upgrade
    const tripleBtn = document.getElementById('patriotic-triple');
    const tripleCostElem = document.getElementById('cost-triple');
    tripleCostElem.textContent =
      patrioticUpgrades.triple > 0 ? '✅ Unlocked' : costs.triple;
    tripleBtn.disabled = patrioticUpgrades.triple > 0;
    tripleBtn.textContent = patrioticUpgrades.triple > 0
      ? 'Triple Shot Unlocked'
      : 'Unlock Triple Shot';
  }
















  function loadSkins() {
    const list = document.getElementById('skin-list');
    list.innerHTML = '';
    const skins = [
  { id: 'red-blue', name: 'Red-Blue (Free)', unlock: true },
  {
    id: 'patriotic',
    name: 'Patriotic (Complete Quests)',
    unlock: questProgress.kills >= 10000 &&
            questProgress.coins >= 5000 &&
            questProgress.boss
  },
  {
    id: 'gold-rainbow',
    name: 'Golden Rainbow (30,000 Fireworks)',
    unlock: ownedSkins.includes('gold-rainbow')
  },
 {
  id: 'neon-patriotic',
  name: 'Neon Rainbow Patriotic (50,000 Fireworks)',
  unlock: ownedSkins.includes('neon-patriotic')
},
{
  id: 'inferno-galaxy',
  name: 'Inferno Galaxy (90,000 Fireworks)',
  unlock: ownedSkins.includes('inferno-galaxy')
}
];
















    skins.forEach(skin => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      let label = skin.name;
















      if (ownedSkins.includes(skin.id)) label += ' (Owned)';
      if (activeSkin === skin.id) label += ' ✅';
















      btn.textContent = label;
      btn.disabled = !skin.unlock;
      btn.onclick = () => {
        activeSkin = skin.id;
        saveAll();
        loadSkins();
      };
















      li.appendChild(btn);
      list.appendChild(li);
    });
  }
















  function saveAll() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('stars', stars);
    localStorage.setItem('upgrade_speed', upgrades.speed);
    localStorage.setItem('upgrade_fireRate', upgrades.fireRate);
    localStorage.setItem('upgrade_doubleLaser', upgrades.doubleLaser);
    localStorage.setItem('patriotic_damage', patrioticUpgrades.damage);
    localStorage.setItem('patriotic_speed', patrioticUpgrades.speed);
    localStorage.setItem('patriotic_triple', patrioticUpgrades.triple);
    localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
    localStorage.setItem('activeSkin', activeSkin);
    localStorage.setItem('totalKills', totalKills);
    localStorage.setItem('patriotic_quests', JSON.stringify(questProgress));
  }
















  function startGame(selectedMode) {
    mode = selectedMode;
    level = 1;
    lives = 3;
    bullets = [];
    enemies = [];
    barriers = createBarriers();
















    player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 60,
      w: 50,
      h: 20,
      speed: 5 + upgrades.speed + (mode === 'patriotic' ? patrioticUpgrades.speed : 0)
    };


    document.getElementById("touch-left").ontouchstart = () => {
  if (gameRunning) player.x = Math.max(0, player.x - player.speed);
};
document.getElementById("touch-right").ontouchstart = () => {
  if (gameRunning) player.x = Math.min(canvas.width - player.w, player.x + player.speed);
};
document.getElementById("touch-fire").ontouchstart = () => {
  if (gameRunning && canShoot) {
    fireBullet();
    canShoot = false;
    setTimeout(() => canShoot = true, 300 - upgrades.fireRate * 20);
  }
};




    document.body.classList.toggle('patriotic-mode', mode === 'patriotic');
    hideAll();
    canvas.classList.remove('hidden');
    screens.back.classList.remove('hidden');
    canvas.style.display = 'block';
    spawnEnemies();
    gameRunning = true;
    requestAnimationFrame(gameLoop);
  }
















  function createBarriers() {
    const b = [];
    for (let i = 0; i < 4; i++) {
      b.push({
        x: 100 + i * 150,
        y: canvas.height - 120,
        w: 100,
        h: 25,
        hp: 25
      });
    }
    return b;
  }
















  function spawnEnemies() {
    enemies = [];
    const rows = 6;
    const cols = 6;
    const baseHP = mode === 'patriotic' ? 3 + level : 2 + Math.floor(level);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        enemies.push({
          x: 60 + c * 60,
          y: 40 + r * 30,
          w: 40,
          h: 20,
          dx: 2,
          dir: 1,
          hp: baseHP,
          type: "normal",
          color: mode === 'patriotic'
            ? ['red', 'white', 'blue'][Math.floor(Math.random() * 3)]
            : '#f00'
        });
      }
    }
  }
















  function fireBullet() {
    const mid = player.x + player.w / 2 - 2.5;
    bullets.push({ x: mid, y: player.y, w: 5, h: 12, enemy: false });
















    const isTriple = (mode === 'patriotic' && patrioticUpgrades.triple > 0) ||
                     (mode !== 'patriotic' && upgrades.doubleLaser > 0);
















    if (isTriple) {
      bullets.push({ x: mid - 15, y: player.y, w: 5, h: 12, enemy: false });
      bullets.push({ x: mid + 15, y: player.y, w: 5, h: 12, enemy: false });
    }
  }
















// Handle player movement and shooting
window.addEventListener('keydown', (e) => {
  if (!gameRunning) return;
  if (e.key === 'ArrowLeft') player.x = Math.max(0, player.x - player.speed);
  if (e.key === 'ArrowRight') player.x = Math.min(canvas.width - player.w, player.x + player.speed);
  if ((e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter') && canShoot) {
    fireBullet();
    canShoot = false;
    setTimeout(() => canShoot = true, 300 - upgrades.fireRate * 20);
  }
});
















// Main game loop - draws everything and updates state
function gameLoop() {
  if (!gameRunning) return;
















  ctx.clearRect(0, 0, canvas.width, canvas.height);
















  drawPlayer();
  drawEnemies();
  drawBullets();
  drawBarriers();
  drawUI();
















  handleBullets();
  checkWaveEnd();
















  requestAnimationFrame(gameLoop);
}
















// Draw the player with skins or color
function drawPlayer() {
  if (activeSkin === 'gold-rainbow') {
    const gradient = ctx.createLinearGradient(player.x, player.y, player.x + player.w, player.y);
    gradient.addColorStop(0, 'gold');
    gradient.addColorStop(0.2, 'orange');
    gradient.addColorStop(0.4, 'red');
    gradient.addColorStop(0.6, 'blue');
    gradient.addColorStop(0.8, 'lime');
    gradient.addColorStop(1, 'magenta');
    ctx.fillStyle = gradient;




  } else if (activeSkin === 'neon-patriotic') {
    const neonGradient = ctx.createLinearGradient(player.x, player.y, player.x + player.w, player.y);
    neonGradient.addColorStop(0, '#ff00ff');
    neonGradient.addColorStop(0.2, '#00ffff');
    neonGradient.addColorStop(0.4, '#ffff00');
    neonGradient.addColorStop(0.6, '#00ff00');
    neonGradient.addColorStop(0.8, '#ff007f');
    neonGradient.addColorStop(1, '#ff00ff');
    ctx.fillStyle = neonGradient;




  } else if (activeSkin === 'inferno-galaxy') {
    const gradient = ctx.createLinearGradient(player.x, player.y, player.x + player.w, player.y);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.3, 'orange');
    gradient.addColorStop(0.6, 'purple');
    gradient.addColorStop(1, 'magenta');
    ctx.fillStyle = gradient;




    ctx.shadowBlur = 15;
    ctx.shadowColor = 'purple';




    const trail = ctx.createLinearGradient(player.x, player.y + player.h, player.x, player.y + player.h + 30);
    trail.addColorStop(0, 'orange');
    trail.addColorStop(0.5, 'red');
    trail.addColorStop(1, 'yellow');
    ctx.fillStyle = trail;
    ctx.fillRect(player.x + player.w / 2 - 5, player.y + player.h, 10, 30);




  } else {
    ctx.fillStyle = 'red';
  }




  ctx.fillRect(player.x, player.y, player.w, player.h);
}
;




// Draw enemies and move them side to side
function drawEnemies() {
  enemies.forEach(e => {
    e.x += e.dx * e.dir;
    if (e.x <= 0 || e.x + e.w >= canvas.width) {
      e.dir *= -1;
      e.y += 20;
    }
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.w, e.h);
    if (Math.random() < 0.0007) {
      bullets.push({ x: e.x + e.w / 2, y: e.y + e.h, w: 4, h: 10, enemy: true });
    }
  });
}
















// Draw barriers
function drawBarriers() {
  barriers.forEach(b => {
    ctx.fillStyle = '#0ff';
    ctx.fillRect(b.x, b.y, b.w, b.h);
  });
}
















// Draw UI: coins, fireworks, lives, level
function drawUI() {
  ctx.fillStyle = '#0ff';
  ctx.font = '16px Orbitron';
  ctx.fillText(`Coins: ${coins}`, 20, 25);
  ctx.fillText(`Fireworks: ${stars}`, 20, 45);
  ctx.fillText(`Lives: ${lives}`, 20, 65);
  ctx.fillText(`Level: ${level}`, 20, 85);
}
















// Draw bullets and update their positions
function drawBullets() {
  bullets.forEach(b => {
    ctx.fillStyle = b.enemy ? 'red' : 'lime';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    b.y += b.enemy ? 4 : -8;
  });
}
















// Handle bullet collisions with enemies, barriers, and player
function handleBullets() {
  bullets.forEach((b, bi) => {
    if (!b.enemy) {
      // Player bullets hit enemies and barriers
      enemies.forEach((e, ei) => {
        if (isColliding(b, e)) {
          let damage = 1;
          if (mode === 'patriotic') damage += patrioticUpgrades.damage;
          e.hp -= damage;
          if (e.hp <= 0) {
            if (mode === 'patriotic') {
              stars += 5;
              questProgress.coins += 5;
            } else {
              coins += 5;
            }
            enemies.splice(ei, 1);
            totalKills++;
          }
          bullets.splice(bi, 1);
        }
      });
      barriers.forEach((bar, i) => {
        if (isColliding(b, bar)) {
          bullets.splice(bi, 1);
          bar.hp--;
          if (bar.hp <= 0) barriers.splice(i, 1);
        }
      });
    } else {
      // Enemy bullets hit player or barriers
      if (isColliding(b, player)) {
        lives--;
        bullets.splice(bi, 1);
        if (lives <= 0) endGame();
      } else {
        barriers.forEach((bar, i) => {
          if (isColliding(b, bar)) {
            bullets.splice(bi, 1);
            bar.hp--;
            if (bar.hp <= 0) barriers.splice(i, 1);
          }
        });
      }
    }
  });
}
















// Check if two rectangles collide (for bullets, enemies, player, barriers)
function isColliding(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}
















// Check if wave is finished; spawn new enemies or bosses
function checkWaveEnd() {
  if (enemies.length === 0) {
    level++;
















    if (level % 100 === 0) {
      enemies.push({
        x: 250, y: 40, w: 150, h: 70, dx: 2, dir: 1,
        hp: 8000,
        type: "space-titan",
        color: 'purple',
        speed: 4
      });
    } else if (mode === 'patriotic' && level === 50) {
      const flagGradient = ctx.createLinearGradient(0, 0, 200, 0);
      flagGradient.addColorStop(0, 'red');
      flagGradient.addColorStop(0.33, 'white');
      flagGradient.addColorStop(0.66, 'blue');
      flagGradient.addColorStop(1, 'white');
      enemies.push({
        x: 250, y: 40, w: 120, h: 60, dx: 1, dir: 1,
        hp: 4000,
        type: "boss",
        color: flagGradient,
        speed: 3
      });
      questProgress.boss = true;
      saveAll();
    } else if (level % 25 === 0) {
      enemies.push({
        x: 300, y: 50, w: 100, h: 50, dx: 1, dir: 1,
        hp: 4000,
        type: 'tank',
        color: 'navy green',
        speed: 0.9
      });
    } else if (level % 5 === 0) {
      enemies.push({
        x: 300, y: 50, w: 40, h: 20, dx: 3, dir: 1,
        hp: 300,
        type: 'quickster',
        color: 'yellow',
        speed: 3
      });
    } else {
      spawnEnemies();
    }
  }
















  if (lives <= 0) endGame();
}
















// End the game, save data and return to menu
function endGame() {
  gameRunning = false;
  saveAll();
  alert("💀 Game Over!");
  goHome();
}
































};
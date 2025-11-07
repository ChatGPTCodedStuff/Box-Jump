const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

const player = {
  x: 100,
  y: canvas.height - 150,
  width: 30,
  height: 30,
  dx: 0,
  dy: 0,
  gravity: 0.5,
  jumpPower: -10,
  grounded: false
};

const terrain = [];
const spikes = [];

function createTerrain() {
  for (let i = 0; i < canvas.width; i += 100) {
    terrain.push({ x: i, y: canvas.height - 100, width: 100, height: 100 });
    if (Math.random() < 0.2) {
      spikes.push({ x: i + 40, y: canvas.height - 120, width: 20, height: 20 });
    }
  }
}

function drawRect(obj, color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function resetGame() {
  player.x = 100;
  player.y = canvas.height - 150;
  player.dx = 0;
  player.dy = 0;
  player.grounded = false;

  terrain.length = 0;
  spikes.length = 0;
  createTerrain();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move terrain and spikes
  terrain.forEach(t => t.x -= 2);
  spikes.forEach(s => s.x -= 2);

  // Recycle terrain
  if (terrain[terrain.length - 1].x < canvas.width) {
    terrain.push({ x: canvas.width, y: canvas.height - 100, width: 100, height: 100 });
    if (Math.random() < 0.2) {
      spikes.push({ x: canvas.width + 40, y: canvas.height - 120, width: 20, height: 20 });
    }
  }

  // Player movement
  if (keys["ArrowLeft"]) player.dx = -5;
  else if (keys["ArrowRight"]) player.dx = 5;
  else player.dx = 0;

  if (keys["ArrowUp"] && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }

  player.dy += player.gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Collision with terrain
  player.grounded = false;
  terrain.forEach(t => {
    if (player.x < t.x + t.width &&
        player.x + player.width > t.x &&
        player.y < t.y + t.height &&
        player.y + player.height > t.y) {
      player.y = t.y - player.height;
      player.dy = 0;
      player.grounded = true;
    }
  });

  // Collision with spikes
  spikes.forEach(s => {
    if (player.x < s.x + s.width &&
        player.x + player.width > s.x &&
        player.y < s.y + s.height &&
        player.y + player.height > s.y) {
      resetGame();
    }
  });

  // Draw everything
  drawRect(player);
  terrain.forEach(t => drawRect(t));
  spikes.forEach(s => drawRect(s));
  
  requestAnimationFrame(update);
}

createTerrain();
update();

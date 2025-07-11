const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;

let birdY = canvas.height / 2;
let birdVelocity = 0;
const gravity = 0.6;
const flapPower = -10;
const birdSize = 30;

let pipes = [];
const pipeWidth = 60;
const pipeGap = 160;
let frame = 0;
let score = 0;
let gameStarted = false;
let gameOver = false;

const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

function resetGame() {
  birdY = canvas.height / 2;
  birdVelocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  scoreDisplay.innerText = "0";
}

// Load bird image
const birdImg = new Image();
birdImg.src = "https://img.poki-cdn.com/cdn-cgi/image/q=78,scq=50,width=1200,height=1200,fit=cover,f=png/5e0df231478aa0a331a4718d09dd91a2/flappy-bird.png"; // Replace with your own if desired

// Bird position and size
const birdX = 100;

function drawBird() {
  ctx.drawImage(birdImg, birdX - birdSize / 2, birdY - birdSize / 2, birdSize, birdSize);
}


function drawPipes() {
  ctx.fillStyle = "#228B22";
  pipes.forEach(pipe => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
  });
}

function updatePipes() {
  if (frame % 100 === 0) {
    const top = Math.random() * (canvas.height - pipeGap - 200) + 50;
    pipes.push({ x: canvas.width, top });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;
  });

  // Remove off-screen pipes
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function checkCollision() {
  if (birdY + birdSize / 2 > canvas.height || birdY - birdSize / 2 < 0) return true;

  return pipes.some(pipe => {
    const inX = 100 + birdSize / 2 > pipe.x && 100 - birdSize / 2 < pipe.x + pipeWidth;
    const inY = birdY - birdSize / 2 < pipe.top || birdY + birdSize / 2 > pipe.top + pipeGap;
    return inX && inY;
  });
}

function updateScore() {
  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + pipeWidth < 100) {
      pipe.passed = true;
      score++;
      scoreDisplay.innerText = score;
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameStarted && !gameOver) {
    birdVelocity += gravity;
    birdY += birdVelocity;

    updatePipes();
    updateScore();

    if (checkCollision()) {
      gameOver = true;
      startBtn.style.display = "block";
      startBtn.innerText = "Restart";
    }
  }

  drawBird();
  drawPipes();

  frame++;
  requestAnimationFrame(gameLoop);
}

function flap() {
  if (!gameStarted) {
    gameStarted = true;
    startBtn.style.display = "none";
    resetGame();
  }
  if (!gameOver) {
    birdVelocity = flapPower;
  }
}

startBtn.addEventListener("click", () => {
  resetGame();
  gameStarted = true;
  startBtn.style.display = "none";
});

document.addEventListener("keydown", e => {
  if (e.code === "Space") flap();
});

canvas.addEventListener("touchstart", flap);
canvas.addEventListener("mousedown", flap);

// Start game loop
gameLoop();

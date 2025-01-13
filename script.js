const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart");

// Game settings
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

// Player paddle positions
let player = { x: 0, y: canvas.height / 2 - paddleHeight / 2, dy: 0 };
let ai = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2 };

// Ball properties (slower speed)
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 2.5, dy: 2.5 }; // Slower ball

// Score tracking
let playerScore = 0;
let aiScore = 0;
let maxScore = 5; // Game restarts after 5 goals

// Draw the game elements
function drawGame() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(player.x, player.y, paddleWidth, paddleHeight);
  ctx.fillRect(ai.x, ai.y, paddleWidth, paddleHeight);

  // Draw ball
  ctx.fillRect(ball.x, ball.y, ballSize, ballSize);

  // Draw the score
  scoreDisplay.textContent = `Player: ${playerScore} | AI: ${aiScore}`;
}

// Move the paddles
function movePaddles() {
  // Move player paddle
  player.y += player.dy;
  if (player.y < 0) player.y = 0;
  if (player.y + paddleHeight > canvas.height) player.y = canvas.height - paddleHeight;

  // Move AI paddle (simple AI)
  if (ai.y + paddleHeight / 2 < ball.y) {
    ai.y += 3; // Move down
  } else if (ai.y + paddleHeight / 2 > ball.y) {
    ai.y -= 3; // Move up
  }
  if (ai.y < 0) ai.y = 0;
  if (ai.y + paddleHeight > canvas.height) ai.y = canvas.height - paddleHeight;
}

// Move the ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with top and bottom walls
  if (ball.y <= 0 || ball.y + ballSize >= canvas.height) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddles
  if (ball.x <= player.x + paddleWidth && ball.y >= player.y && ball.y <= player.y + paddleHeight) {
    ball.dx = -ball.dx;
    ball.dx *= 1.02; // Slightly increase speed after hitting the player paddle
    ball.dy *= 1.02; // Slightly increase vertical speed
  }
  if (ball.x + ballSize >= ai.x && ball.y >= ai.y && ball.y <= ai.y + paddleHeight) {
    ball.dx = -ball.dx;
    ball.dx *= 1.02; // Slightly increase speed after hitting the AI paddle
    ball.dy *= 1.02; // Slightly increase vertical speed
  }

  // Scoring
  if (ball.x <= 0) {
    aiScore++;
    checkForRestart();
    resetBall();
  } else if (ball.x + ballSize >= canvas.width) {
    playerScore++;
    checkForRestart();
    resetBall();
  }
}

// Reset the ball to the center after scoring
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 2.5 * (Math.random() < 0.5 ? 1 : -1); // Randomize horizontal direction with slower speed
  ball.dy = 2.5 * (Math.random() < 0.5 ? 1 : -1); // Randomize vertical direction with slower speed
}

// Check if someone reached the max score
function checkForRestart() {
  if (playerScore === maxScore || aiScore === maxScore) {
    setTimeout(() => {
      alert(`${playerScore === maxScore ? 'Player' : 'AI'} wins! Restarting game...`);
      playerScore = 0;
      aiScore = 0;
      ball.dx = 2.5;
      ball.dy = 2.5;
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      restartButton.style.display = "block"; // Show the restart button
    }, 1000);
  }
}

// Update game logic
function gameLoop() {
  movePaddles();
  moveBall();
  drawGame();
}

// Listen for player paddle movement (up/down keys)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.dy = -6;
  if (e.key === "ArrowDown") player.dy = 6;
});

document.addEventListener("keyup", () => {
  player.dy = 0;
});

// Restart the game
restartButton.addEventListener("click", () => {
  restartButton.style.display = "none";
  playerScore = 0;
  aiScore = 0;
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = 2.5;
  ball.dy = 2.5;
  gameLoopInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
});

// Start the game
let gameLoopInterval = setInterval(gameLoop, 1000 / 60); // 60 FPS
restartButton.style.display = "none";
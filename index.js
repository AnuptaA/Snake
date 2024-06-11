canvas = document.getElementById("snakeCanvas");
ctx = canvas.getContext("2d");
curr_score = document.getElementsByClassName("curr-score")[0];
high_score = document.getElementsByClassName("high-score")[0];
restart = document.getElementById("restart-btn");

const dim = snakeCanvas.width;
const origin = 0;
const block_size = 20;
const MOVE_KEYS = [38, 87, 40, 83, 37, 65, 39, 68];

var x_dir, y_dir, velocity, score;
var moveUp, moveDown, moveLeft, moveRight, initFoodGen, collided;
var food, remBlocks, snake;
var timeoutId;

function snakeInit() {
  x_dir = -1;
  y_dir = 0;
  velocity = block_size;
  score = 0;

  moveUp = false;
  moveDown = false;
  moveLeft = true;
  moveRight = false;
  initFoodGen = false;
  collided = false;

  remBlocks = [];
  snake = [
    { x: dim / 2 - 4 * block_size, y: dim / 2 },
    { x: dim / 2 - 3 * block_size, y: dim / 2 },
    { x: dim / 2 - 2 * block_size, y: dim / 2 },
    { x: dim / 2 - block_size, y: dim / 2 },
    { x: dim / 2, y: dim / 2 },
  ];

  for (let i = 0; i < dim; i += block_size) {
    for (let j = 0; j < dim; j += block_size) {
      remBlocks.push({ x: i, y: j });
    }
  }

  for (let i = 0; i < snake.length; i++) {
    let idx = remBlocks.findIndex(
      (block) => block.x == snake[i].x && block.y == snake[i].y
    );
    if (idx != -1) remBlocks.splice(idx, 1);
  }
}

function clearCanvas() {
  ctx.fillStyle = "white";
  ctx.fillRect(origin, origin, dim, dim);
  ctx.strokeStyle = "black";
  ctx.strokeRect(origin, origin, dim, dim);
}

function drawSnakeBlock(coordinate) {
  ctx.fillStyle = "#a2e920";
  ctx.fillRect(coordinate.x, coordinate.y, block_size, block_size);
  ctx.strokeStyle = "#bffc4e";
  ctx.strokeRect(coordinate.x, coordinate.y, block_size, block_size);
}

function drawFoodBlock(coordinate) {
  ctx.fillStyle = "red";
  ctx.fillRect(coordinate.x, coordinate.y, block_size, block_size);
  ctx.strokeStyle = "black";
  ctx.strokeRect(coordinate.x, coordinate.y, block_size, block_size);
}

function drawSnake() {
  snake.forEach((value) => drawSnakeBlock(value));
}

function mod(m, n) {
  return ((m % n) + n) % n;
}

function updateScore() {
  score = snake.length;
  curr_score.textContent = score;
  if (score > parseInt(high_score.textContent)) {
    high_score.textContent = score;
    localStorage.setItem("high_score", score);
  }
}

function moveSnake() {
  const head = {
    x: mod(snake[0].x + x_dir * velocity, dim),
    y: mod(snake[0].y + y_dir * velocity, dim),
  };
  if (checkCollision(head)) {
    collided = true;
    return;
  } else if (head.x == food.x && head.y == food.y) generateFood();
  else snake.pop();
  remBlocks.push(snake[snake.length - 1]);

  let idx = remBlocks.findIndex(
    (block) => block.x == head.x && block.y == head.y
  );
  if (idx != -1) remBlocks.splice(idx, 1);

  snake.unshift(head);
}

function moveSnakeUp() {
  x_dir = 0;
  y_dir = -1;
  moveSnake();
}

function moveSnakeDown() {
  x_dir = 0;
  y_dir = 1;
  moveSnake();
}

function moveSnakeLeft() {
  x_dir = -1;
  y_dir = 0;
  moveSnake();
}

function moveSnakeRight() {
  x_dir = 1;
  y_dir = 0;
  moveSnake();
}

function generateFood() {
  let idx = Math.floor(Math.random() * remBlocks.length);
  food = remBlocks[idx];
  remBlocks.splice(idx, 1);
}

function checkCollision(coordinate) {
  for (let i = 3; i < snake.length; i++) {
    if (coordinate.x == snake[i].x && coordinate.y == snake[i].y) return true;
  }
  return false;
}

function refresh() {
  clearCanvas();

  if (!initFoodGen) {
    initFoodGen = true;
    generateFood();
  }
  drawFoodBlock(food);

  if (moveUp) moveSnakeUp();
  else if (moveDown) moveSnakeDown();
  else if (moveLeft) moveSnakeLeft();
  else moveSnakeRight();

  drawSnake();
  updateScore();

  if (collided) return;
  main();
}

function changeDir(event) {
  const key = event.keyCode;
  if ((key == MOVE_KEYS[0] || key == MOVE_KEYS[1]) && !moveDown) {
    moveUp = true;
    moveLeft = false;
    moveRight = false;
  } else if ((key == MOVE_KEYS[2] || key == MOVE_KEYS[3]) && !moveUp) {
    moveDown = true;
    moveLeft = false;
    moveRight = false;
  } else if ((key == MOVE_KEYS[4] || key == MOVE_KEYS[5]) && !moveRight) {
    moveLeft = true;
    moveUp = false;
    moveDown = false;
  } else if ((key == MOVE_KEYS[6] || key == MOVE_KEYS[7]) && !moveLeft) {
    moveRight = true;
    moveUp = false;
    moveDown = false;
  }
  if (MOVE_KEYS.includes(key)) event.preventDefault();
}

function restartGame() {
  snakeInit();
  main();
}

function main() {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(refresh, 100);
}

document.addEventListener("DOMContentLoaded", function () {
  const storedHighScore = localStorage.getItem("high_score");
  if (storedHighScore !== null) {
    high_score.textContent = parseInt(storedHighScore);
  } else {
    high_score.textContent = 0;
  }
  high_score_element.textContent = score;
});
restart.addEventListener("click", restartGame);
document.addEventListener("keydown", changeDir);
snakeInit();
main();

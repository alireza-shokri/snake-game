let blockSize, row, column;

let bg = new Image();
bg.src = "./images/background.webp";

let snakeX;
let snakeY;
let gameover = false;
let mySnakeLength = [];
let interval;

let score = 0;
let high_score = 0;

const root = document.getElementById("root");
const allBtn_phone = document.querySelectorAll(".btn");
const context = root.getContext("2d");
const high_Score_element = document.querySelector(".high_Score span");
const Score_element = document.querySelector(".Score span");
const mediaQuery = window.matchMedia("(max-width: 600px)");

// ----------------------------------------------------- Direction
let newX = 0;
let newY = 0;
const changeDirection = function (keyCode) {
  if (keyCode === 39 && newX !== -1) {
    newX = 1;
    newY = 0;
  } else if (keyCode === 37 && newX !== 1) {
    newX = -1;
    newY = 0;
  } else if (keyCode === 38 && newY !== 1) {
    newX = 0;
    newY = -1;
  } else if (keyCode === 40 && newY !== -1) {
    newX = 0;
    newY = 1;
  }
};

// ----------------------------------------------------- food

let foodX = 0;
let foodY = 0;

const createFood = function () {
  foodX = Math.floor(Math.random() * column) * blockSize;
  foodY = Math.floor(Math.random() * row) * blockSize;
};

// -----------------------------------------------------update

const updateSnake = function () {
  if (gameover) {
    clearInterval(interval);
    if (score > high_score) localStorage.setItem("high_score", score);
    alert("شما باختید از اول امتحان کنید ");
    window.location.reload();
  }

  context.fillStyle = "black";
  context.drawImage(bg, 0, 0, root.width, root.height);

  context.fillStyle = "pink";
  context.fillRect(foodX, foodY, blockSize, blockSize);

  // eat food
  if (snakeX === foodX && snakeY === foodY) {
    mySnakeLength.push([foodX, foodY]);
    createFood();
    score += 10;
    Score_element.textContent = score;
  }

  for (let i = mySnakeLength.length - 1; i > 0; i--) {
    mySnakeLength[i] = mySnakeLength[i - 1];
  }
  if (mySnakeLength.length) mySnakeLength[0] = [snakeX, snakeY];

  // move Snake
  snakeX += newX * blockSize;
  snakeY += newY * blockSize;
  context.fillStyle = "yellow";
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  context.fillStyle = "gray";
  for (let i = 0; i < mySnakeLength.length; i++) {
    context.fillRect(
      mySnakeLength[i][0],
      mySnakeLength[i][1],
      blockSize,
      blockSize
    );
  }

  // gameover
  if (
    snakeX < 0 ||
    snakeX >= column * blockSize ||
    snakeY < 0 ||
    snakeY >= row * blockSize
  ) {
    gameover = true;
  }

  // kill yourself
  for (let i = 0; i < mySnakeLength.length; i++) {
    if (snakeX === mySnakeLength[i][0] && snakeY === mySnakeLength[i][1]) {
      gameover = true;
    }
  }
};
let time = 100;
// MediaQuery
function handleMediaQueryChange(e) {
  if (e.matches) {
    row = 24;
    column = 19;
    blockSize = 20;
    time = 150;
  } else {
    if (window.matchMedia("(min-width: 1440px)").matches) {
      blockSize = 25;
      row = 28;
      column = 40;
    } else {
      blockSize = 18;
      row = 28;
      column = 40;
    }
  }
  root.height = blockSize * row;
  root.width = blockSize * column;
  snakeX = Math.floor(row / 2) * blockSize;
  snakeY = Math.floor(column / 2) * blockSize;
}
const ChakLocalSorage = function () {
  if (localStorage.getItem("high_score")) {
    high_score = localStorage.getItem("high_score");
    high_Score_element.textContent = high_score;
  } else localStorage.setItem("high_score", 0);
};

const BtnClick = function (e) {
  changeDirection(Number(e.target.closest(".btn").getAttribute("data-btn")));
};

// ----------------------------------------------------- Load
const initFunc = function () {
  handleMediaQueryChange(mediaQuery);
  ChakLocalSorage();
  createFood();
  interval = setInterval(updateSnake, time);
};
// Load page 
window.onload = function () {
  document.querySelector(".contenar").style.display = "block";
  initFunc();
};
document.body.addEventListener("keydown", (e) => changeDirection(e.keyCode));
allBtn_phone.forEach((item) => item.addEventListener("click", BtnClick));

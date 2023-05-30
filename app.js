// dec
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); // return a drawing context that can be drawn
let currentScoreTag = document.querySelector("#myScore");
let highestScoreTag = document.querySelector("#myScore2");
let slowerTag = document.querySelector("#slow");
let fasterTag = document.querySelector("#fast");

// width, height = 320 x 320
// col = 320/ 20 = 16, rows = 320/20 = 16
const unit = 20;
const row = canvas.height / unit;
const col = canvas.width / unit;

// difficulty of the game
let time = 100;
// element inside of the array is an object
let snake = [];

// function of snake creation, 4 objects
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

// Fruit class
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * col) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  randomLocation() {
    let valid = false;
    let newX;
    let newY;

    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          return true;
        }
      }
    }
    do {
      newX = Math.floor(Math.random() * col) * unit;
      newY = Math.floor(Math.random() * row) * unit;
    } while (checkOverlap(newX, newY));
    this.x = newX;
    this.y = newY;
  }
}
// initialize
createSnake();
let myFruit = new Fruit();

// score
let score = 0;
let highestScore;
getHighestScore();
// update the html tag
currentScoreTag.innerHTML = "Score: " + score;
highestScoreTag.innerHTML = "Highest Score: " + highestScore;

// default direction -> right
let direction = "right";

window.addEventListener("keydown", changeDirection);
function changeDirection(e) {
  if (e.key == "ArrowLeft" && direction != "right") {
    direction = "left";
  } else if (e.key == "ArrowRight" && direction != "left") {
    direction = "right";
  } else if (e.key == "ArrowUp" && direction != "down") {
    if (direction != "down") {
      direction = "up";
    }
  } else if (e.key == "ArrowDown" && direction != "up") {
    direction = "down";
  }
  // every time of pressing keys, before the next step of snake
  // the application won't accept any keydown event to avoid the snake dead because of the fast click
  window.removeEventListener("keydown", changeDirection);
}

// highest score functions
function getHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

// drawing the snake
function draw() {
  // A black background -> to remove the previous frame
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();
  // drawing the snake body
  for (let i = 0; i < snake.length; i++) {
    // color of snake
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    //  check if the snake goes through the boundary
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //rectangle(x, y, width, height)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // current direction determines the next step of snake
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // although it changes the snakeX value,
  // but it won't affect the original data of array
  // number is a value type
  if (direction == "left") {
    snakeX -= unit;
  } else if (direction == "right") {
    snakeX += unit;
  } else if (direction == "up") {
    snakeY -= unit;
  } else if (direction == "down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };
  // to check does snake eat fruit
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.randomLocation();
    // handling score
    score++;
    currentScoreTag.innerHTML = "Score: " + score;
    setHighestScore(score); 
    highestScoreTag.innerHTML = "Highest Score: " + highestScore;
  } else {
    snake.pop();
  }

  // check if the snake eat itself
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }
  snake.unshift(newHead);

  window.addEventListener("keydown", changeDirection);
}

slowerTag.addEventListener("click", () => {
  time += 10;
  clearInterval(myGame);
  myGame = setInterval(draw, time);
});

fasterTag.addEventListener("click", () => {
  time -= 10;
  clearInterval(myGame);
  myGame = setInterval(draw, time);
})
let myGame = setInterval(draw, time);



const snakeBoard = document.getElementById('gameCanvas');
const snakeBoardContext = snakeBoard.getContext("2d");
const board_border = 'black';
const board_background = 'white';
const snakeCol = 'lightblue';
const snakeBorder = 'darkblue';
let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
];

let score = 0;
let changingDirection = false;
let foodX;
let foodY;
let dx = 10;
let dy = 0;

main();
generateFood();
document.addEventListener("keydown", changeDirection);

function main() {
    if (hasGameEnded())
        return;

    changingDirection = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawFood()
        moveSnake();
        drawSnake();
        main();
    }, 100)
}

function clearCanvas() {
    snakeBoardContext.fillStyle = board_background;
    snakeBoardContext.strokestyle = board_border;
    snakeBoardContext.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
    snakeBoardContext.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
}

function drawSnakePart(snakePart) {
    snakeBoardContext.fillStyle = snakeCol;
    snakeBoardContext.strokeStyle = snakeBorder;
    snakeBoardContext.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeBoardContext.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    snakeBoardContext.fillStyle = 'lightgreen';
    snakeBoardContext.strokeStyle = 'darkgreen';
    snakeBoardContext.fillRect(foodX, foodY, 10, 10);
    snakeBoardContext.strokeRect(foodX, foodY, 10, 10);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
    if (hasEatenFood) {
        score += 10;
        document.getElementById('score').innerHTML = score;
        generateFood();
    }
    else {
        snake.pop();
    }
}

function changeDirection(event) {
    const leftKey = 37;
    const rightKey = 39;
    const upKey = 38;
    const downKey = 40;
    if (changingDirection)
        return;
    changingDirection = true;
    const keyPressed = event.keyCode;
    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === leftKey && !goingRight) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === upKey && !goingDown) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === rightKey && !goingLeft) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === downKey && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++)
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
            return true

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeBoard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeBoard.height - 10;
    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

function randomFood(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateFood() {
    foodX = randomFood(0, snakeBoard.width - 10);
    foodY = randomFood(0, snakeBoard.height - 10);
    snake.forEach(function hasSnakeEatenFood(part) {
        const hasEaten = part.x === foodX && part.y === foodY;
        if (hasEaten)
            generateFood();
    });
}
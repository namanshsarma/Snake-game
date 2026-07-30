const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

// Mobile D-Pad Button Bindings
const btnUp = document.getElementById("btnUp");
const btnDown = document.getElementById("btnDown");
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");

const gridSize = 20; 
const tileCount = canvas.width / gridSize;

let snake = [];
let food = { x: 0, y: 0 };
let dx = gridSize; 
let dy = 0;        
let score = 0;
let gameInterval;
let changingDirection = false; 
let gameActive = false; 

initCanvas();

function initCanvas() {
    clearCanvas();
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(gridSize * 5, gridSize * 5, gridSize, gridSize);
    ctx.fillStyle = "#ff3333";
    ctx.fillRect(gridSize * 12, gridSize * 8, gridSize, gridSize);
}

function startGame() {
    snake = [
        { x: gridSize * 5, y: gridSize * 5 },
        { x: gridSize * 4, y: gridSize * 5 },
        { x: gridSize * 3, y: gridSize * 5 }
    ];
    score = 0;
    dx = gridSize;
    dy = 0;
    scoreElement.innerText = score;
    
    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    
    spawnFood();
    gameActive = true;
    
    clearInterval(gameInterval);
    gameInterval = setInterval(update, 200); 
}

function update() {
    if (hasGameEnded()) {
        gameOverScreen.classList.remove("hidden");
        clearInterval(gameInterval);
        gameActive = false;
        return;
    }

    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
}

function clearCanvas() {
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? "#00ff88" : "#00aa5e";
        ctx.strokeStyle = "#1a1a1a";
        ctx.fillRect(part.x, part.y, gridSize, gridSize);
        ctx.strokeRect(part.x, part.y, gridSize, gridSize);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
    if (hasEatenFood) {
        score += 10;
        scoreElement.innerText = score;
        spawnFood();
    } else {
        snake.pop(); 
    }
}

function spawnFood() {
    while (true) {
        food.x = Math.floor(Math.random() * tileCount) * gridSize;
        food.y = Math.floor(Math.random() * tileCount) * gridSize;
        
        let foodOnSnake = snake.some(part => part.x === food.x && part.y === food.y);
        if (!foodOnSnake) break;
    }
}

function drawFood() {
    ctx.fillStyle = "#ff3333";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// Direction Validation Logic
function handleDirectionChange(direction) {
    if (!gameActive || changingDirection) return;

    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (direction === "LEFT" && !goingRight) {
        dx = -gridSize; dy = 0; changingDirection = true;
    }
    if (direction === "UP" && !goingDown) {
        dx = 0; dy = -gridSize; changingDirection = true;
    }
    if (direction === "RIGHT" && !goingLeft) {
        dx = gridSize; dy = 0; changingDirection = true;
    }
    if (direction === "DOWN" && !goingUp) {
        dx = 0; dy = gridSize; changingDirection = true;
    }
}

// Keyboard Event Handlers
document.addEventListener("keydown", (event) => {
    const keyPressed = event.key;
    if (keyPressed === " " || keyPressed === "Spacebar") {
        if (!gameActive) { startGame(); return; }
    }
    
    if (keyPressed === "ArrowLeft" || keyPressed === "a") handleDirectionChange("LEFT");
    if (keyPressed === "ArrowUp" || keyPressed === "w") handleDirectionChange("UP");
    if (keyPressed === "ArrowRight" || keyPressed === "d") handleDirectionChange("RIGHT");
    if (keyPressed === "ArrowDown" || keyPressed === "s") handleDirectionChange("DOWN");
});

// Mobile Button Touch Listeners
btnLeft.addEventListener("click", () => handleDirectionChange("LEFT"));
btnUp.addEventListener("click", () => handleDirectionChange("UP"));
btnRight.addEventListener("click", () => handleDirectionChange("RIGHT"));
btnDown.addEventListener("click", () => handleDirectionChange("DOWN"));

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

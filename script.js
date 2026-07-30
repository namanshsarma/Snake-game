const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreValElement = document.getElementById("score-val");
const startButton = document.getElementById("btn-start");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Snake Initial Setup
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0; // Starts completely frozen at zero velocity
let dy = 0; 
let score = 0;
let gameInterval = null;
let isGameRunning = false;

function toggleGameState() {
    if (!isGameRunning) {
        resetGameVariables();
        dx = 1; // Give it initial moving momentum
        gameInterval = setInterval(gameLoop, 200);
        isGameRunning = true;
        startButton.style.display = "none"; // Hide button while actively playing
    }
}

function gameLoop() {
    moveSnake();
    if (checkGameOver()) {
        handleGameOver();
        return;
    }
    checkFoodCollision();
    drawGame();
}

function drawGame() {
    // Clear Canvas Display
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Apple Food Target
    ctx.fillStyle = "#ff3333";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Draw Snake Entity
    ctx.fillStyle = "#00ff66";
    snake.forEach((part) => {
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    snake.pop();
}

function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreValElement.innerText = score;
        generateFood();
        const tail = { ...snake[snake.length - 1] };
        snake.push(tail);
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Don't spawn food directly on top of snake blocks
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            generateFood();
        }
    });
}

function checkGameOver() {
    const head = snake[0];
    // Boundary Canvas Collisions
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }
    // Self-eating Tail Collisions
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function handleGameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    startButton.innerText = "Play Again";
    startButton.style.display = "block"; // Show button again on death screen
}

function resetGameVariables() {
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    scoreValElement.innerText = score;
    generateFood();
}

// ----------------------------------------------------
// SYSTEM STATE INTERFACES (Desktop & Mobile Click)
// ----------------------------------------------------
startButton.addEventListener("click", toggleGameState);
startButton.addEventListener("touchstart", (e) => {
    e.preventDefault();
    toggleGameState();
});

// ----------------------------------------------------
// KEYBOARD COMMAND INTERFACES (Desktop Support)
// ----------------------------------------------------
document.addEventListener("keydown", (e) => {
    if (!isGameRunning) return; // Ignore keys if game hasn't started
    
    switch (e.key) {
        case "ArrowUp":
            if (dy === 1) break; 
            dx = 0; dy = -1;
            break;
        case "ArrowDown":
            if (dy === -1) break;
            dx = 0; dy = 1;
            break;
        case "ArrowLeft":
            if (dx === 1) break;
            dx = -1; dy = 0;
            break;
        case "ArrowRight":
            if (dx === -1) break;
            dx = 1; dy = 0;
            break;
    }
});

// ----------------------------------------------------
// SIMULATED INTERFACE LISTENERS (Mobile Cross D-Pad Bridge)
// ----------------------------------------------------
function triggerFakeKey(keyString) {
    const fakeEvent = new KeyboardEvent("keydown", {
        key: keyString,
        code: keyString,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(fakeEvent);
}

document.getElementById("btn-up").addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerFakeKey("ArrowUp");
});
document.getElementById("btn-down").addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerFakeKey("ArrowDown");
});
document.getElementById("btn-left").addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerFakeKey("ArrowLeft");
});
document.getElementById("btn-right").addEventListener("touchstart", (e) => {
    e.preventDefault();
    triggerFakeKey("ArrowRight");
});

// Initial canvas draw to show static scene on load
resetGameVariables();
drawGame();

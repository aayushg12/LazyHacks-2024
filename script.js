let alarmTime = null;
let alarmTriggered = false; // Add a flag to track if the alarm has already triggered
let streak = parseInt(localStorage.getItem("streak")) || 0;
let currency = parseInt(localStorage.getItem("currency")) || 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;

// Clock and Alarm
function displayClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById("clock").innerText = now.toLocaleTimeString();

        // Check if the alarm should trigger
        if (alarmTime && now.toTimeString().slice(0, 5) === alarmTime && !alarmTriggered) {
            triggerAlarm();
            alarmTriggered = true; // Ensure the alarm triggers only once
        }
    }, 1000);
}

function setAlarm() {
    alarmTime = document.getElementById("alarmTime").value;
    alarmTriggered = false; // Reset the flag when a new alarm is set
    if (alarmTime) alert(`Alarm set for ${alarmTime}`);
}

// Alarm and Puzzle System
function triggerAlarm() {
    document.getElementById("alarmSound").play();
    document.getElementById("puzzleSection").style.display = "block";
    generatePuzzles();
}

const puzzles = [
    { question: "What has keys but can't open locks?", answer: "keyboard" },
    { question: "I speak without a mouth and hear without ears. What am I?", answer: "echo" },
    { question: "What’s 7 + 8 x 2?", answer: "23" },
];

function generatePuzzles() {
    const puzzleDiv = document.getElementById("puzzles");
    puzzleDiv.innerHTML = ""; // Clear previous puzzle content

    // Randomly select one puzzle
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    puzzleDiv.innerHTML = `
        <p>${puzzle.question}</p>
        <input type="text" id="userAnswer" placeholder="Your Answer">
        <input type="hidden" id="correctAnswer" value="${puzzle.answer}">
    `;
}

function submitPuzzles() {
    const userAnswer = document.getElementById("userAnswer").value.toLowerCase();
    const correctAnswer = document.getElementById("correctAnswer").value;
    if (userAnswer === correctAnswer) {
        alert("Correct! Alarm stopped.");
        document.getElementById("puzzleSection").style.display = "none";
        document.getElementById("alarmSound").pause();
        streak++;
        currency += 10;
        saveProgress();
    } else {
        alert("Incorrect. Try again.");
    }
}

// Save and Update Progress
function saveProgress() {
    localStorage.setItem("streak", streak);
    localStorage.setItem("currency", currency);
    document.getElementById("streakCount").innerText = streak;
    document.getElementById("currency").innerText = currency;
}

// Snake Game
let snake, food, score, snakeInterval;

function startSnakeGame() {
    document.getElementById("gameSection").style.display = "block";
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    score = 0;
    let direction = "RIGHT";

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") direction = "UP";
        else if (e.key === "ArrowDown") direction = "DOWN";
        else if (e.key === "ArrowLeft") direction = "LEFT";
        else if (e.key === "ArrowRight") direction = "RIGHT";
    });

    snakeInterval = setInterval(() => {
        ctx.clearRect(0, 0, 400, 400);
        snake.unshift({ x: snake[0].x + (direction === "RIGHT") - (direction === "LEFT"), y: snake[0].y + (direction === "DOWN") - (direction === "UP") });
        if (snake[0].x === food.x && snake[0].y === food.y) {
            score++;
            food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
        } else snake.pop();

        ctx.fillStyle = "green";
        snake.forEach((s) => ctx.fillRect(s.x * 20, s.y * 20, 20, 20));
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * 20, food.y * 20, 20, 20);

        if (snake.some((s, i) => i > 0 && s.x === snake[0].x && s.y === snake[0].y)) {
            clearInterval(snakeInterval);
            alert("Game Over!");
            highScore = Math.max(highScore, score);
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").innerText = highScore;
        }
        document.getElementById("gameScore").innerText = `Score: ${score}`;
    }, 200);
}

displayClock();
saveProgress();

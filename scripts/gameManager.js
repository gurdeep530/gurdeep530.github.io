import { createSnakeGame } from './games/snake.js';
import { createBreakoutGame } from './games/breakout.js';
import { createMemoryGame } from './games/memory.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreDisplay = document.getElementById("score-display");
const gameTitle = document.getElementById("game-title");

const tileCount = 20;
const maxCanvasWidth = Math.min(window.innerWidth * 0.9, 375);
const gridSize = Math.floor(maxCanvasWidth / tileCount);
const canvasSize = gridSize * tileCount;

const games = [
    createSnakeGame(canvas, ctx, scoreDisplay, gridSize, tileCount),
    createBreakoutGame(canvas, ctx, scoreDisplay, gridSize, tileCount),
    createMemoryGame(canvas, ctx, scoreDisplay)
];

let currentGameIndex = 0;
let currentGame = games[currentGameIndex];
let isGameRunning = false;
let gameInterval;

function setCanvasSize() {
    if (currentGame.name === "Memory") {
        canvas.width = 340;
        canvas.height = 340;
    } else {
        canvas.width = canvasSize;
        canvas.height = canvasSize;
    }
}

const gameSelector = document.getElementById("gameSelector");
gameSelector.addEventListener("change", () => {
    if (isGameRunning) {
        clearInterval(gameInterval);
        isGameRunning = false;
        startBtn.style.display = "block";
        scoreDisplay.style.display = "none";
        canvas.style.backgroundImage = currentGame.background;
    }
    currentGameIndex = parseInt(gameSelector.value);
    currentGame = games[currentGameIndex];
    setCanvasSize();
    currentGame.init();
    canvas.style.backgroundImage = currentGame.background;
    gameTitle.innerText = currentGame.name;
    startBtn.innerText = `Start ${currentGame.name}`;
});

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        startBtn.style.display = "none";
        scoreDisplay.style.display = "block";
        canvas.style.backgroundImage = "none";
        canvas.style.backgroundColor = "#f0f0f0";
        if (currentGame.name === "Memory") {
            currentGame.start();
        } else {
            gameInterval = setInterval(() => {
                if (!currentGame.update()) {
                    stopGame();
                }
            }, currentGame.name === "Snake" ? 100 : 1000 / 60);
        }
    }
}

function stopGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    startBtn.style.display = "block";
    scoreDisplay.style.display = "none";
    startBtn.innerText = `Restart ${currentGame.name}`;
    canvas.style.backgroundImage = currentGame.background;
}

document.addEventListener("keydown", e => {
    if (isGameRunning && currentGame.handleKey) {
        currentGame.handleKey(e);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    startBtn.addEventListener("click", () => {
        if (startBtn.innerText.includes("Start")) {
            startGame();
        } else {
            currentGame.init();
            startGame();
        }
    });
    setCanvasSize();
    currentGame.init();
});
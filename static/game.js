const socket = io();

const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;

let timeLeft = 10;
let score1 = 0;
let score2 = 0;
let timer;
let gameActive = false;

const canvas = document.getElementById("canvas");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;
const context = canvas.getContext("2d");

socket.emit("new player");

canvas.addEventListener("click", () => {
  socket.emit("click");
});

// Обновляем отображение счёта
function updateScores() {
  document.getElementById("scorePlayer1").textContent =
    "Player 1 Score: " + score1;
  document.getElementById("scorePlayer2").textContent =
    "Player 2 Score: " + score2;
}

// Функция запуска игры
document.getElementById("startGameButton").addEventListener("click", () => {
  // Сбрасываем данные и начинаем игру
  score1 = 0;
  score2 = 0;
  timeLeft = 10;
  gameActive = true;
  updateScores();
  document.getElementById("timerDisplay").textContent =
    "Time Left: " + timeLeft + "s";

  // Включаем кнопки для кликов
  document.getElementById("clickButtonPlayer1").disabled = false;
  document.getElementById("clickButtonPlayer2").disabled = false;

  // Начинаем отсчёт времени
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      gameActive = false;
      document.getElementById("clickButtonPlayer1").disabled = true;
      document.getElementById("clickButtonPlayer2").disabled = true;

      // Определяем победителя
      let winner =
        score1 > score2
          ? "Player 1"
          : score2 > score1
          ? "Player 2"
          : "No one, it's a tie!";
      alert("Game Over! Winner: " + winner);
    } else {
      timeLeft--;
      document.getElementById("timerDisplay").textContent =
        "Time Left: " + timeLeft + "s";
    }
  }, 1000);
});

// Обработчик кликов для игроков
document.getElementById("clickButtonPlayer1").addEventListener("click", () => {
  if (gameActive) score1++;
  updateScores();
});

document.getElementById("clickButtonPlayer2").addEventListener("click", () => {
  if (gameActive) score2++;
  updateScores();
});

socket.on("state", (players) => {
  context.beginPath();
  context.fillStyle = "black";
  context.fillRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
  context.closePath();
  for (const id in players) {
    const player = players[id];
    drawPlayer(context, player);
  }
});

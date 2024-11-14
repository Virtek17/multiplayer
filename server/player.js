const players = {};

class Player {
  constructor(props) {
    this._name = props.name;
    this._id = props.id;
    this._playerRadius = 30;

    this.positionX = 300;
    this.positionY = 300;
    this.score = 0;
  }
}

module.exports.getPlayers = (socket) => {
  socket.on("new player", () => {
    players[socket.id] = new Player({
      id: socket.id,
      name: Object.keys(players).length,
    });
  });

  socket.on("movement", (move) => {
    const player = players[socket.id] || {};
    if (move.left) {
      player.positionX -= 5;
    }
    if (move.right) {
      player.positionX += 5;
    }
    if (move.up) {
      player.positionY -= 5;
    }
    if (move.down) {
      player.positionY += 5;
    }
  });

  socket.on("click", () => {
    const player = players[socket.id];
    if (player) {
      player.score += 1; // Увеличиваем счёт на 1
    }
  });

  socket.on("start game", () => {
    // Когда получаем событие "start game", мы начинаем игру для всех игроков
    for (const playerId in players) {
      players[playerId].score = 0; // Сбрасываем счёт
    }
    io.emit("game started"); // Отправляем всем игрокам, что игра началась
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
  });

  return players;
};

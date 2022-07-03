function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y <=
      rectangle2.position.y + rectangle2.height &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  if (player.health === enemy.health) {
    document.querySelector("#display-text").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#display-text").innerHTML = "Player 1 Win";
  } else if (player.health < enemy.health) {
    document.querySelector("#display-text").innerHTML = "Player 2 Win";
  }
  document.querySelector("#display-text").style.display = "flex";
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  } else {
    determineWinner({ player, enemy, timerId });
  }
}

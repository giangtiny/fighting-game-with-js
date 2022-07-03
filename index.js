const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const music = document.querySelector("audio");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});

const shop = new Sprite({
  position: {
    x: 630,
    y: 128,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.75,
  frameMax: 6,
  frameHold: 5,
});

const player = new Fighter({
  position: {
    x: 130,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samuraiMack/Idle.png",
  scale: 2.5,
  frameMax: 8,
  frameHold: 5,
  offset: {
    x: 225,
    y: 156,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samuraiMack/Idle.png",
      frameMax: 8,
    },
    run: {
      imageSrc: "./assets/samuraiMack/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./assets/samuraiMack/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./assets/samuraiMack/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samuraiMack/Attack1.png",
      frameMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samuraiMack/Take Hit - white silhouette.png",
      frameMax: 4,
    },
    death: {
      imageSrc: "./assets/samuraiMack/Death.png",
      frameMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 55,
      y: 40,
    },
    width: 180,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/kenji/Idle.png",
  scale: 2.5,
  frameMax: 4,
  frameHold: 5,
  offset: {
    x: 220,
    y: 171,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      frameMax: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      frameMax: 8,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      frameMax: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      frameMax: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      frameMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/kenji/Take hit.png",
      frameMax: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      frameMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  music.play();
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -4;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 4;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  //jumping and falling
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -4;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 4;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  //jumping and falling
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect player attack
  if (
    rectangularCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    player.isAttacking = false;
    enemy.takeHit();
    gsap.to("#enemy-health", { width: enemy.health + "%" });
  }
  //player attack missed
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  //detect enemy attack
  if (
    rectangularCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    enemy.isAttacking = false;
    player.takeHit();
    gsap.to("#player-health", { width: player.health + "%" });
  }
  //enemy attack missed
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  //determine winner base on health
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead && !enemy.dead) {
    switch (event.key) {
      //player keys
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
      //enemy keys
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //player keys
    case "d":
      keys.d.pressed = false;
      player.lastKey = "a";
      break;
    case "a":
      keys.a.pressed = false;
      player.lastKey = "d";
      break;
    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      enemy.lastKey = "ArrowRight";
      break;
  }
});

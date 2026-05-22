var playerOne, playerTwo, ball1, c1, c2;
function setup() {
  createCanvas(windowWidth, windowHeight);
  playerOne = new Player(25);
  playerTwo = new Player(width - 25);
  ball1 = new Ball(width / 2, height / 2);
  textSize(32);
  textAlign(CENTER);
  c1 = color(255, 100, 50);
  c2 = color(50, 50, 200);
  setGradient(c1, c2);
}

function draw() {
  setGradient(c1, c2);
  noStroke();
  fill(255);
  playerOne.draw();
  playerTwo.draw();
  ball1.draw();
  ball1.move(playerOne, playerTwo);
  playerOne.move(65, 68, 87, 83);
  playerTwo.move(LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Player {
  constructor(xOffset) {
    this.x = xOffset;
    this.y = height / 2;
    this.velocity = 0;
    this.acceleration = 0;
    this.points = 0;
  }

  draw() {
    rect(this.x, this.y, 50, 100);
    text(this.points, this.x, 30);
  }

  move(upKey1, downKey1, upKey2, downKey2) {
    if ((keyIsDown(upKey1) || keyIsDown(upKey2)) && this.y - 50 > 0) {
      this.acceleration += 0.2;
      this.velocity -= this.acceleration;
      this.y += this.velocity;
    } else if (
      (keyIsDown(downKey1) || keyIsDown(downKey2)) &&
      this.y + 50 < height
    ) {
      this.acceleration += 0.2;
      this.velocity += this.acceleration;
      this.y += this.velocity;
    } else {
      this.acceleration = 0;
      this.velocity *= 0.8;
      if (this.y + 100 < height && this.y - 50 > 0) {
        this.y += this.velocity;
      }
    }
    // make sure to lock to the edges
    if (this.y + 50 > height) {
      this.y = height - 50;
    }
    if (this.y - 50 < 0) {
      this.y = 50;
    }
  }
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.a = createVector(
      width / 200,
      random([-1, 1]) * random(height / 150, height / 150 + 10),
    );
    this.length = 50;
    // cathoic humanist
    // superstitious but not spiritual
  }

  move(leftPlayer, rightPlayer) {
    this.x += this.a.x;
    if (this.x > rightPlayer.x - this.length) {
      if (abs(rightPlayer.y - this.y) - this.length / 2 < this.length) {
        this.a.x *= -1;
      } else {
        this.x = width / 2;
        this.y = height / 2;
        this.a.y = random([-1, 1]) * random(height / 150, height / 150 + 10);
        leftPlayer.points++;
      }
    }
    if (this.x < leftPlayer.x + this.length) {
      if (abs(leftPlayer.y - this.y) - this.length / 2 < this.length) {
        this.a.x *= -1;
      } else {
        this.x = width / 2;
        this.y = height / 2;
        this.a.y = random([-1, 1]) * random(height / 150, height / 150 + 10);
        rightPlayer.points++;
      }
    }
    this.y += this.a.y;
    if (this.y < this.length / 2) {
      this.a.y *= -1;
    }
    if (this.y > height - this.length / 2) {
      this.a.y *= -1;
    }
  }

  draw() {
    rectMode(CENTER);
    rect(this.x, this.y, this.length, this.length);
  }
}

function setGradient(c1, c2) {
  // noprotect
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

class Particle {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.rays = [];
    // for(let a=0; a<360; a+=90) {
    for (let a = 0; a < 360; a += 1) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
    this.v = p5.Vector.random2D().mult(2);
  }

  show() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, 1);
    // noFill();
    // ellipse(this.pos.x, this.pos.y,75);
    for (let ray of this.rays) {
      ray.show();
    }
  }

  look(walls) {
    strokeWeight(1);

    for (let ray of this.rays) {
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);

          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      }
      if (closest) {
        stroke(255, 150);

        line(this.pos.x, this.pos.y, closest.x, closest.y);
        if (
          Math.sqrt(
            Math.pow(closest.x - this.pos.x, 2) +
              Math.pow(closest.y - this.pos.y, 2),
          ) < 32.5
        ) {
          let d = ray.dir;
          if (d.x == 1) {
            this.v.x *= -1;
          } else if (d.x == -1) {
            this.v.x *= -1;
          } else if (d.y == 1) {
            this.v.y *= -1;
          } else if (d.y == -1) {
            this.v.y *= -1;
          }
        }
      }
    }
  }

  update(x, y) {
    // this.pos.set(x,y);
    this.pos.add(this.v);
  }
}

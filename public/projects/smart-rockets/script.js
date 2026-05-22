let population;
let lifespan = 300;
let count = 0;
let target;
let overallFitness = 0;
let mutationRate = 0.02;
let rx, ry, rw, rh;
function setup() {
  createCanvas(windowWidth, windowHeight);
  population = new Population();
  target = createVector(width / 2, 50);
  rx = (3 * windowWidth) / 8;
  ry = windowHeight / 2;
  rw = (2 * windowWidth) / 8;
  rh = 10;
}

function draw() {
  background(40);
  fill(255, 0, 0);
  ellipse(target.x, target.y, 20);

  population.run();
  fill(255);
  textSize(32);
  text(count, 10, 30);
  text(overallFitness, 10, windowHeight - 30);

  rect(rx, ry, rw, rh);

  count++;
  if (count == lifespan) {
    population.evaluate();
    population.selection();
    count = 0;
  }
}

class Population {
  constructor() {
    this.rockets = [];
    this.popsize = 350;
    for (let i = 0; i < this.popsize; i++) {
      this.rockets.push(new Rocket());
    }
    this.matingpool = [];
  }
  run() {
    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].update();
      this.rockets[i].show();
    }
  }

  evaluate() {
    let maxFit = 0;
    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].calcFitness();
      if (this.rockets[i].fitness > maxFit) {
        maxFit = this.rockets[i].fitness;
      }
    }
    overallFitness = maxFit;

    for (let i = 0; i < this.popsize; i++) {
      this.rockets[i].fitness /= maxFit;
      if (this.rockets[i].fitness == 1) {
        this.rockets[i].fitness = 2;
      }
    }

    this.matingpool = [];
    for (let i = 0; i < this.popsize; i++) {
      let n = this.rockets[i].fitness * 100;
      for (let j = 0; j < n; j++) {
        this.matingpool.push(this.rockets[i]);
      }
    }
  }

  selection() {
    let newRockets = [];
    for (let i = 0; i < this.popsize; i++) {
      let parentADNA = random(this.matingpool).DNA;
      let parentBDNA = random(this.matingpool).DNA;
      let child = parentADNA.crossover(parentBDNA);
      child.mutation();
      newRockets[i] = new Rocket(child);
    }

    this.rockets = newRockets;
  }
}

class Rocket {
  constructor(dna) {
    if (dna) {
      this.DNA = dna;
    } else {
      this.DNA = new DNA();
    }
    this.pos = createVector(width / 2, height);
    this.vel = createVector();
    this.acc = createVector();
    this.fitness = 0;
    this.completed = false;
    this.timeCompleted = lifespan;
    this.crashed = false;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    if (d < 10) {
      if (this.completed == false) {
        this.timeCompleted = count;
      }
      this.completed = true;
      this.pos = target.copy();
    } else {
      if (
        this.pos.x > rx &&
        this.pos.x < rx + rw &&
        this.pos.y > ry &&
        this.pos.y < ry + rh
      ) {
        this.crashed = true;
      } else {
        this.applyForce(this.DNA.genes[count]);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
      }
    }
  }
  show() {
    push();
    noStroke();
    fill(255, 150);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    rect(0, 0, 25, 5);
    pop();
  }
  calcFitness() {
    let d = dist(this.pos.x, this.pos.y, target.x, target.y);
    this.fitness = map(d, 0, height, height, 0);
    if (this.completed) {
      this.fitness = pow(this.fitness, 5);
      this.fitness *= pow(lifespan - this.timeCompleted, 4);
    }

    if (this.crashed) this.fitness = 0;
  }
}

class DNA {
  constructor(genes) {
    if (genes == null) {
      this.genes = [];
      for (let i = 0; i < lifespan; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(0.5);
      }
    } else {
      this.genes = genes;
    }
  }

  crossover(partnerDNA) {
    let partnerGenes = partnerDNA.genes;
    let childGenes = [];
    for (let i = 0; i < lifespan; i++) {
      childGenes[i] = random([this.genes[i], partnerGenes[i]]);
    }
    return new DNA(childGenes);
  }

  mutation() {
    for (let i = 0; i < lifespan; i++) {
      if (random(1) < mutationRate) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(0.5);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let walls = [], particle;
let xoff = 0, yoff =123141;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for(let i = 0; i<5; i++) {
        let x1 = random(width);
        let x2 = random(width);
        let y1 = random(height);
        let y2 = random(height);
        walls[i] = new Boundary(x1, y1, x2, y2);
    }
    particle = new Particle();
    noStroke();
}

function draw() {
    background(0);
    for(let wall of walls) {
        wall.show();
        
    }
    particle.update(noise(xoff)*width, noise(yoff)*height);
    particle.show();
    particle.look(walls);
    
    xoff += 0.01;
    yoff += 0.01;
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
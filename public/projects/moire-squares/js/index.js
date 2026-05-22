var img;
var angle = 0;

var frames;
function setup() {
  createCanvas(windowWidth, windowHeight);

  img = createImage(450, 450);
  img.loadPixels();
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y += 3) {
      // var b = map(y, 0, img.height, 255, 0);
      for (var z = 0; z <= 1; z += 0.5) {
        img.set(x, y, [50, 200, 50, 255]);
        y++;
      }
      // for(var z=0; z<1; z++){
      //   img.set(x, y, [0, 0, 255, 255]);
      //   y++;
      // }
    }
  }
  img.updatePixels();
}

function draw() {
  background(40);
  imageMode(CENTER);

  translate(width / 2, height / 2);
  image(img, 0, 0);
  rotate(0.2 * sin(angle));
  image(img, 0, 0);

  noFill();
  strokeWeight(100);
  stroke(40);
  ellipse(0, 0, 550, 550);
  angle += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

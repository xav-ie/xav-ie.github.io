let num = 0b11111111;
let byteArray = [];
let bits = 32;
var w;
var currentBit;
var shiftRightButton, shiftLeftButton;
var numInput;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  textSize(82);
  numInput = createInput('');
  numInput.input(updateBits);
  numInput.size(windowWidth - 80, 100);
  numInput.position(40, windowHeight / 2 - 50);
  styleElement(numInput, [
    'background-color',
    '#444444',
    'border',
    'none',
    'border-radius',
    '25px',
    'text-align',
    'center',
    'color',
    'white',
    'font-size',
    '72px',
  ]);
  w = windowWidth / bits;
  let binaryString = createBinaryString(num);
  for (var i = 0; i < bits; i++) {
    byteArray.push(
      new Bit(i * w + w / 2, w / 2, w - w / bits, binaryString.charAt(i)),
    );
  }

  shiftLeftButton = createButton('<<');
  shiftLeftButton.position(windowWidth / 2 - 40, windowHeight / 2 + 65);
  shiftLeftButton.mousePressed(shiftLeft);
  styleElement(shiftLeftButton, [
    'background-color',
    '#444444',
    'color',
    'white',
    'border',
    'none',
    'padding',
    '10px',
    'border-radius',
    '10px',
  ]);
  shiftRightButton = createButton('>>');
  shiftRightButton.position(windowWidth / 2 + 10, windowHeight / 2 + 65);
  shiftRightButton.mousePressed(shiftRight);
  styleElement(shiftRightButton, [
    'background-color',
    '#444444',
    'color',
    'white',
    'border',
    'none',
    'padding',
    '10px',
    'border-radius',
    '10px',
  ]);
}

function draw() {
  background(40);
  for (var i = 0; i < bits; i++) {
    byteArray[i].show();
  }
  updateInput();
}

function mouseMoved() {
  if (mouseY < windowWidth / bits) {
    if (((mouseX - w / 2) / w).toFixed(0) != currentBit) {
      currentBit = ((mouseX - w / 2) / w).toFixed(0);
      byteArray[currentBit].toggleState();
      num = updateDecimal(byteArray);
    }
  } else {
    currentBit = -1;
  }
}

function shiftLeft() {
  num = num << 1;
  var bin = createBinaryString(num);
  for (var i = 0; i < byteArray.length; i++) {
    var bit = parseInt(bin.charAt(i), 2);
    byteArray[i].setState(bit);
  }
}

function shiftRight() {
  num = num >> 1;
  var bin = createBinaryString(num);
  for (var i = 0; i < byteArray.length; i++) {
    var bit = parseInt(bin.charAt(i), 2);
    byteArray[i].setState(bit);
  }
}

function updateBits() {
  num = parseInt(this.value());
  var bin = createBinaryString(num);
  for (var i = 0; i < byteArray.length; i++) {
    var bit = parseInt(bin.charAt(i), 2);
    byteArray[i].setState(bit);
  }
}

function updateInput() {
  if (!isNaN(num)) numInput.elt.value = num;
}

function updateDecimal(bitArray) {
  let sum = 0;
  if (bitArray[0].getState() == 1) {
    for (let i = bitArray.length - 1; i > 0; i--) {
      let bit = ~parseInt(bitArray[i].getState(), 2);
      sum += bit * pow(2, 31 - i);
    }
    sum = ~sum + 2;
  } else {
    for (let i = bitArray.length - 1; i > 0; i--) {
      let bit = parseInt(bitArray[i].getState(), 2) >>> 0;
      sum += bit * pow(2, 31 - i);
    }
  }
  return sum;
}

function createBinaryString(nMask) {
  // nMask must be between -2147483647 and 2147483650
  var nShifted = nMask;
  var sMask = '';
  for (var nFlag = 0; nFlag < 32; nFlag++) {
    sMask += String(nShifted >>> 31);
    nShifted <<= 1;
  }
  return sMask;
}

function binaryToDecimal(val) {
  let sum = 0;
  if (val.charAt(0) == '1') {
    for (let i = val.length - 1; i > 0; i--) {
      let bit = ~parseInt(val.charAt(i), 2);
      sum += bit * pow(2, 31 - i);
    }
    sum = ~sum + 2;
  } else {
    for (let i = val.length - 1; i > 0; i--) {
      let bit = parseInt(val.charAt(i), 2) >>> 0;
      sum += bit * pow(2, 31 - i);
    }
  }
  return sum;
}

function styleElement(element, styles) {
  if (styles.length == 0 || styles.length % 2 !== 0) {
    throw 'Styles array is not evenly sized or is empty!';
  }
  for (var i = 0; i < styles.length; i += 2) {
    element.style(styles[i], styles[i + 1]);
  }
}

class Bit {
  constructor(x, y, d, s) {
    this.x = x;
    this.y = y;
    this.diameter = d;
    this.state = s;
  }

  show() {
    stroke(60);
    strokeWeight(4);
    fill(255 * this.state);
    ellipse(this.x, this.y, this.diameter);
  }

  toggleState() {
    if (this.state == 0) {
      this.state = 1;
    } else {
      this.state = 0;
    }
  }

  getState() {
    return this.state;
  }

  setState(n) {
    this.state = n;
  }
}

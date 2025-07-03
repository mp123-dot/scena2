//*************************************************************
//*  KONFIG – zmieniasz tylko liczby poniżej
//*************************************************************
const BTN_DIAMETER = 120;  // Ø przycisku "DALEJ" (px)
const BTN_YOFF     = 100;  // odległość środka przycisku od dołu okna
const HOVER_SCALE  = 1.05; // powiększenie przy hoverze
const KWADRAT      = 40;   // rozmiar pojedynczego pola koloru
const GAP          = 20;   // odstęp między polami
//*************************************************************

let font, tloKolor, flowerMouse, clickSound;
let rawBtnImg, btnImg;
let selectedColor = null;
let colorSelected = false;
let glitterParticles = [];

// definicja palety
const allowedColors = [
  '#ffc0cb', '#ff69b4', '#ffb6c1', '#f9c6d3', '#f4a6b3',
  '#0000ff', '#228B22', '#ffff00', '#03A9F4'
];
const correctColors = allowedColors.slice(0, 5);

/***************** PRELOAD *****************/
function preload() {
  font        = loadFont('futura.ttf');
  tloKolor    = loadImage('t.kolor.png');
  flowerMouse = loadImage('flowerMouse.png');
  rawBtnImg   = loadImage('PrzyciskDALEJ.png');
  clickSound  = loadSound('glimmer.wav');   // dźwięk glimmer
}

/***************** SETUP *****************/
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textFont(font);
  noCursor();

  // maskujemy PNG do idealnego koła
  const s = min(rawBtnImg.width, rawBtnImg.height);
  btnImg = createImage(s, s);
  rawBtnImg.loadPixels();
  btnImg.copy(
    rawBtnImg,
    (rawBtnImg.width  - s) / 2,
    (rawBtnImg.height - s) / 2,
    s, s,
    0, 0, s, s
  );
  const maskG = createGraphics(s, s);
  maskG.noStroke(); maskG.fill(255);
  maskG.circle(s/2, s/2, s);
  btnImg.mask(maskG);
}

/***************** DRAW *****************/
function draw() {
  background(255);
  image(tloKolor, 0, 0, width, height);

  drawScene1();

  // efekt brokatu
  for (let i = glitterParticles.length - 1; i >= 0; i--) {
    glitterParticles[i].update();
    glitterParticles[i].show();
    if (glitterParticles[i].finished()) {
      glitterParticles.splice(i, 1);
    }
  }

  // kursor-kwiatek
  imageMode(CENTER);
  image(flowerMouse, mouseX, mouseY, 32, 32);
  imageMode(CORNER);
}

/***************** SCENA 1 *****************/
function drawScene1() {
  // paleta kolorów
  const paletteWidth = allowedColors.length * KWADRAT +
                       (allowedColors.length - 1) * GAP;
  const poleX = width/2 - paletteWidth/2;
  const poleY = height/3;

  allowedColors.forEach((c, i) => {
    fill(c); noStroke();
    rect(poleX + i*(KWADRAT+GAP), poleY, KWADRAT, KWADRAT, 8);
  });

  // komunikat + przycisk „DALEJ”
  if (selectedColor) {
    textSize(24);
    fill('#222');
    if (correctColors.includes(selectedColor)) {
      text('To było przewidywalne :)', width/2, poleY + 180);
      colorSelected = true;
      drawDalejButton();
    } else {
      text('Ten kolor nie jest dla dziewczyn', width/2, poleY + 180);
      colorSelected = false;
      drawDalejButton();
    }
  }
}

/***************** RYSUJ PRZYCISK *****************/
function drawDalejButton() {
  const cx = width/2;
  const cy = height - BTN_YOFF;
  const r  = BTN_DIAMETER/2;
  const over = dist(mouseX, mouseY, cx, cy) < r;
  const d    = over ? BTN_DIAMETER*HOVER_SCALE : BTN_DIAMETER;

  imageMode(CENTER);
  image(btnImg, cx, cy, d, d);
  imageMode(CORNER);
}

/***************** KLIKNIĘCIA *****************/
function mousePressed() {
  // dźwięk i brokat przy każdym kliknięciu
  if (clickSound.isLoaded()) clickSound.play();
  for (let i = 0; i < 18; i++) {
    glitterParticles.push(new Glitter(mouseX, mouseY));
  }

  // wybór koloru
  const paletteWidth = allowedColors.length * KWADRAT +
                       (allowedColors.length - 1) * GAP;
  const poleX = width/2 - paletteWidth/2;
  const poleY = height/3;

  allowedColors.forEach((c, i) => {
    const x = poleX + i*(KWADRAT+GAP);
    if (
      mouseX > x && mouseX < x + KWADRAT &&
      mouseY > poleY && mouseY < poleY + KWADRAT
    ) {
      selectedColor = c;
    }
  });

  // przejście do scena3 po kliknięciu w przycisk DALEJ
  const cx = width/2;
  const cy = height - BTN_YOFF;
  const r  = BTN_DIAMETER/2;
  if (selectedColor && dist(mouseX, mouseY, cx, cy) < r) {
    window.location.href = "https://mp123-dot.github.io/scena3/";
  }
}

/***************** GLITTER *****************/
class Glitter {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.vx = random(-1,1); this.vy = random(-1,1);
    this.life = 0; this.max = 30;
    this.size = random(3,7);
    this.col = color(
      random(180,255),
      random(120,200),
      random(200,255),
      200
    );
  }
  update() {
    this.life++;
    this.x += this.vx;
    this.y += this.vy;
  }
  finished() {
    return this.life > this.max;
  }
  show() {
    noStroke();
    fill(this.col);
    ellipse(this.x, this.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
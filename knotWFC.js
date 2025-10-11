

class Cell {
  constructor(x, y, resolution, options) {
    this.x = x;
    this.y = y;
    this.resolution = resolution;
    this.options = options; // array of possible tile options
    this.collapsed = false;
  }

  // method for drawing the cell
  draw(win) {
    if (this.options.length === 1) {
      this.options[0].draw(this.x * this.resolution, this.y * this.resolution, this.resolution, win);
    }

    if (this.options.length > 1){
      EMPTY_TILE.draw(this.x * this.resolution, this.y * this.resolution, this.resolution, win);
    }
  }

  drawDetails(win) {
    if (this.options.length === 1) {
      this.options[0].drawDetails(this.x * this.resolution, this.y * this.resolution, this.resolution, win);
    }
  }
  // return the entropy of the cell
  entropy() {
    // TODO: implement entropy logic (e.g., number of options left)
    return this.options.length;
  }

  // update the collapsed variable
  updateCollapsed() {
    this.collapsed = (this.options.length === 1);
  }

  // observe the cell/collapse the cell
  observe() {
    if (this.options.length > 1) {
      // pick a random option to collapse into
      let choice = floor(random(this.options.length));
      this.options = [this.options[choice]];
    }
    this.collapsed = true;
  }

  updateOptions(grid) {
    this.options = getValidOptions(this, grid)
  }

}

class Tile {
  constructor() {
    this.upConnection = false;
    this.rightConnection = false;
    this.downConnection = false;
    this.leftConnection = false;
    this.layer = 0;
  }

  // draw a single tile
  draw(x, y, size, win) {
    win.push();
    win.stroke(whiteColor);
    win.fill(primaryColor);
    win.pop();
  }

  drawDetails(x, y, size, win) {
    win.push();
    win.stroke(whiteColor);
    win.fill(primaryColor);
    win.pop();
  }

  styleSettings(win) {
    win.stroke(tertiaryColor);
    win.strokeWeight(8);
    win.strokeCap(ROUND);
    win.noFill();       // optional
    win.textAlign(CENTER, CENTER);
  }

}

class EmptyTile extends Tile {
  constructor() { super(); this.layer = 1;}
  draw(x, y, size, win) {
    super.draw(x, y, size, win);
  }
}

class BlankTile extends Tile {
  constructor() { super(); this.layer = 1;}
  draw(x, y, size, win) {
    super.draw(x, y, size, win);
    // blank, just border
  }
}

class TopRightTurnTile extends Tile {
  constructor() {
    super();
    this.upConnection = true;
    this.rightConnection = true;
    this.layer = 2;
  }
  draw(x, y, size, win) {
    super.draw(x, y, size, win);
    win.push();
    win.translate(x, y);
    super.styleSettings(win);
    win.arc(size, 0, size, size, HALF_PI, PI);
    win.pop();
  }
}

class TopLeftTurnTile extends Tile {
  constructor() {
    super();
    this.upConnection = true;
    this.leftConnection = true;
    this.layer = 2;
  }
  draw(x, y, size, win) {
    super.draw(x, y, size, win);

    win.push();
    win.translate(x, y);
    super.styleSettings(win);
    win.arc(0, 0, size, size, 0, HALF_PI);
    win.pop();

  }
}

class BottomRightTurnTile extends Tile {
  constructor() {
    super();
    this.downConnection = true;
    this.rightConnection = true;
    this.layer = 2;
  }
  draw(x, y, size, win) {
    super.draw(x, y, size, win);

    win.push();
    win.translate(x, y);
    super.styleSettings(win);
    win.arc(size, size, size, size, PI, 3*HALF_PI);
    win.pop();
  }
}

class BottomLeftTurnTile extends Tile {
  constructor() {
    super();
    this.downConnection = true;
    this.leftConnection = true;
    this.layer = 2;
  }
  draw(x, y, size, win) {
    super.draw(x, y, size, win);

    win.push();
    win.translate(x, y);
    super.styleSettings(win);
    win.arc(0, size, size, size, 3*HALF_PI, 2*PI);
    win.pop();
  }
}

class VerticleTile extends Tile {
  constructor() {
    super();
    this.downConnection = true;
    this.upConnection = true;
    this.layer = 2;
  }
  draw(x, y, size, win) {
    super.draw(x, y, size, win);

    win.push();
    win.translate(x, y);
    super.styleSettings(win);
    win.line(size/2, size, size/2, 0);
    win.pop();
  }
}

class HorizontalTile extends Tile {
  constructor() {
    super();
    this.leftConnection = true;
    this.rightConnection = true;
    this.layer = 2;
  }
  draw(x, y, size, win) {
    super.draw(x, y, size, win);

    win.push();
    win.translate(x, y);
    super.styleSettings(win);
    win.line(size, size/2, 0, size/2);
    win.pop();
  }
}

class VerticleCrossingTile extends Tile {
  constructor() {
    super();
    this.downConnection = true;
    this.upConnection = true;
    this.leftConnection = true;
    this.rightConnection = true;
    this.layer = 3;
  }
  draw(x, y, size, win) {
    super.draw(x, y, size, win);

    win.push();
    win.translate(x, y);
    super.styleSettings(win);
    //HorizontalUnder
      win.line(size/4, size/2, 0, size/2);
      win.line(size, size/2, 3*size/4, size/2);
    //VerticalOver
    win.line(size/2, size, size/2, 0);
    win.pop();
  }

  drawDetails(x, y, size, win) {
    super.drawDetails(x, y, size, win);
    super.styleSettings(win);

    //Shadow
    win.push();
    win.translate(x, y);
    win.stroke(0, 0, 0, 100);
      win.line(size/4, size/2, size/6, size/2);
      win.line(size*5/6, size/2, 3*size/4, size/2);
    win.pop();
  }

}

class HorizontalCrossingTile extends Tile {
  constructor() {
    super();
    this.downConnection = true;
    this.upConnection = true;
    this.leftConnection = true;
    this.rightConnection = true;
    this.layer = 3;
  }
  draw(x, y, size, win) {
    super.draw(x, y, size, win);

    win.push();
    win.translate(x, y);
    super.styleSettings(win);

    //VerticalUnder
        win.line(size/2, size/4, size/2, 0);
        win.line(size/2, size, size/2, 3*size/4);
    //HorizontalOver
    win.line(size, size/2, 0, size/2);
    win.pop();
  }

  drawDetails(x, y, size, win) {
    super.drawDetails(x, y, size, win);
    super.styleSettings(win);

    //Shadow
    win.push();
    win.translate(x, y);
    win.stroke(0, 0, 0, 100);
        win.line(size/2, size/4, size/2, size/6);
        win.line(size/2, size*5/6, size/2, 3*size/4);
    win.pop();
  }

}

let canvas;
let grid = [];
let running = false;  // whether WFC should run


const EMPTY_TILE = new EmptyTile();

const styles = getComputedStyle(document.documentElement);
const primaryColor = styles.getPropertyValue('--color-primary').trim();
const secondaryColor = styles.getPropertyValue('--color-secondary').trim();
const tertiaryColor = styles.getPropertyValue('--color-tertiary').trim();
const accentColor = styles.getPropertyValue('--color-accent').trim();
const whiteColor = styles.getPropertyValue('--white').trim();
const blackColor = styles.getPropertyValue('--black').trim();
const msuGreenColor = styles.getPropertyValue('--color-msu-green').trim();



let tileOptions = [
    new BlankTile(),
    new TopRightTurnTile(),
    new TopLeftTurnTile(),
    new BottomRightTurnTile(),
    new BottomLeftTurnTile(),
    new VerticleTile(),
    new HorizontalTile(),
    new VerticleCrossingTile(),
    new HorizontalCrossingTile()
];


function windowResized() {
  let size = min(canvas.parent().clientWidth, canvas.parent().clientHeight);
  resizeCanvas(size, size);
  
  let rows = 7;
  let columns = 7;
  let resolution = (size / rows) - rows/4;
  grid = createGrid(rows, columns, resolution);
}

function setup() {
  canvas = createCanvas(1, 1);
  canvas.parent("knotwfc-canvas-container");

  let size = min(canvas.parent().clientWidth, canvas.parent().clientHeight);
  resizeCanvas(size, size);

  // create tiles
  let blank = new BlankTile();
  let tr = new TopRightTurnTile();
  let tl = new TopLeftTurnTile();
  let br = new BottomRightTurnTile();
  let bl = new BottomLeftTurnTile();

  // make a grid of cells with chosen tiles
  let rows = 7;
  let columns = 7;
  let resolution = (width / rows); 
  grid = createGrid(rows, columns, resolution);

  document.getElementById("wfc-reset-button").addEventListener("click", () => {
    console.log("click")
    resetGrid(rows, columns, resolution);
    running = false; // don't start WFC
    loop();          // redraw the fresh grid
  })
}

function draw() {
  background(255);

  for (let row of grid) {
    for (let cell of row) {
      cell.draw(this);

    }
  }

  for (let row of grid) {
    for (let cell of row) {
      cell.drawDetails(this);

    }
  }

  // Run one WFC step per frame
  if (!isComplete(grid)) {
    wfcStep(grid);  // collapse one cell, propagate
  } else {
    noLoop();  // stop when finished
  }
}

function createGrid(rows, columns, resolution) {
  let grid = [];
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < columns; x++) {
      row.push(new Cell(x, y, resolution, tileOptions));
    }
    grid.push(row);
  }
  return grid;
}

function resetGrid(rows, cols, resolution) {
  grid = createGrid(rows, cols, resolution); // all tile options available
}

function isComplete(grid) {
  for (let row of grid) {
    for (let cell of row) {
      if (!cell.collapsed) {
        return false; // found an uncollapsed cell
      }
    }
  }
  return true; // all cells are collapsed
}

function wfcStep(grid) {
  for (let row of grid) {
    for (let cell of row) {
      if (!cell.collapsed){
        cell.updateOptions(grid);
        cell.observe();
        cell.updateCollapsed();
        return;
      }
    }
  }
}

function getValidOptions(cell, grid) {
  let valid = tileOptions.slice(); // copy all possible tiles
  let x = cell.x;
  let y = cell.y;

  // UP neighbor
  if (y === 0) {
    // edge: must be compatible with blank above
    valid = valid.filter(t => t.upConnection === false);
  } else if (grid[y-1][x].collapsed) {
    let neighbor = grid[y-1][x].options[0];
    valid = valid.filter(t => t.upConnection === neighbor.downConnection);
  }

  // DOWN neighbor
  if (y === grid.length - 1) {
    valid = valid.filter(t => t.downConnection === false);
  } else if (grid[y+1][x].collapsed) {
    let neighbor = grid[y+1][x].options[0];
    valid = valid.filter(t => t.downConnection === neighbor.upConnection);
  }

  // LEFT neighbor
  if (x === 0) {
    valid = valid.filter(t => t.leftConnection === false);
  } else if (grid[y][x-1].collapsed) {
    let neighbor = grid[y][x-1].options[0];
    valid = valid.filter(t => t.leftConnection === neighbor.rightConnection);
  }

  // RIGHT neighbor
  if (x === grid[0].length - 1) {
    valid = valid.filter(t => t.rightConnection === false);
  } else if (grid[y][x+1].collapsed) {
    let neighbor = grid[y][x+1].options[0];
    valid = valid.filter(t => t.rightConnection === neighbor.leftConnection);
  }

  return valid;
}

class Graph {
  constructor() {
    this.vertices = {};
  }

  addVertex(name, classification, position) {
    this.vertices[name] = { classification, position, edges: [] };
  }

  addEdge(from, to, weight = 1) {
    if (this.vertices[from] && this.vertices[to]) {
      this.vertices[from].edges.push({ to, weight });
    }
  }

  getVertex(name) {
    return this.vertices[name];
  }

  getNeighbors(name) {
    return this.vertices[name]?.edges.map(e => e.to) || [];
  }

  addGraph(otherGraph) {
    for (let [name, vertex] of Object.entries(otherGraph.vertices)) {
      if (!this.vertices[name]) {
        this.addVertex(name, vertex.classification, vertex.position);
      }
      for (let edge of vertex.edges) {
        this.addEdge(name, edge.to, edge.weight);
      }
    }
  }

  clearEdges() {
    for (let vertex of Object.values(this.vertices)) {
      vertex.edges = [];
    }
  }

  healGraph(kernelDistance, edgeWeight = 2) {
    /* add edges between vertices that are within kernelDistance of each other */
    const names = Object.keys(this.vertices);
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const v1 = this.vertices[names[i]];
        const v2 = this.vertices[names[j]];
        const dx = v1.position.x - v2.position.x;
        const dy = (v1.position.y - v2.position.y) * (height / width);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= kernelDistance) {
          // only add if edge doesn’t exist yet
          if (!v1.edges.some(e => e.to === names[j])) {
            this.addEdge(names[i], names[j], edgeWeight);
          }
          if (!v2.edges.some(e => e.to === names[i])) {
            this.addEdge(names[j], names[i], edgeWeight);
          }
        }

      }
    }
  }
}

const styles = getComputedStyle(document.documentElement);
const primaryColor = styles.getPropertyValue('--color-primary').trim();
const secondaryColor = styles.getPropertyValue('--color-secondary').trim();
const tertiaryColor = styles.getPropertyValue('--color-tertiary').trim();
const accentColor = styles.getPropertyValue('--color-accent').trim();
const whiteColor = styles.getPropertyValue('--white').trim();
const blackColor = styles.getPropertyValue('--black').trim();
const msuGreenColor = styles.getPropertyValue('--color-msu-green').trim();

const fontSizeBase = parseInt(styles.getPropertyValue('--font-size-base'));

var canvas;
let graphDrawing;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  n = random(100);
  noiseSeed(n);
  randomSeed(n);
  graphDrawing = createFullGraph(200, 0.25);

  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('background-canvas-container');
  
}

let ballRadius = 0.0;

function draw() {
  background(primaryColor);
  
  let maxDistance = 0.04;

  frameRate(10);

  // how many frames for a full up+down
  let period = 100;
  let startMultiplier = 0.1;
  ballRadius = maxDistance * (1 - abs(((frameCount+startMultiplier*period) % (2*period)) / period - 1));

  let edgeWeight = 2;


  for (let [name, vertex] of Object.entries(graphDrawing.vertices)) {
      drawKernelCircle(name, vertex);
  }

  let triangleList = findTriangles(graphDrawing);
  for (let tri of triangleList) {
    drawTriangle(tri, graphDrawing);
  }

  for (let [name, vertex] of Object.entries(graphDrawing.vertices)) {
      drawEdges(name, vertex, graphDrawing);
  }

  for (let [name, vertex] of Object.entries(graphDrawing.vertices)) {
      drawNode(name, vertex);
  }

  graphDrawing.clearEdges();
  graphDrawing.healGraph(2*ballRadius, edgeWeight);
}

function createFullGraph(numSubNodes) {
  let graph = createMainGraph();

  let g = createDistributionGraph(numSubNodes, (x, y) => Math.tan(-3*(x-1))/4 + 0.75 - y, 0.5);
  graph.addGraph(g);

  return graph;
}

function createMainGraph() {

  let graph = new Graph();

  let mainNodes = [
    {name: "A", x: 0.1, y: 0.6},
    {name: "B", x: 0.1, y: 0.6},
    {name: "C", x: 0.2, y: 0.7},
    {name: "D", x: 0.2, y: 0.7},
  ]

  for (let node of mainNodes) {
    graph.addVertex(node.name, "sub", {x: node.x, y: node.y});
  }

  return graph;
}

function createRandomSubGraph(numNodes) {
  let graph = new Graph();
  for (let i = 0; i < numNodes; i++) {
    let x = random(0.4, 0.95);
    let y = random(-0.05, 1.05);

    graph.addVertex(`Sub${i}`, "sub", {x, y});

    } 

  return graph;
}

function createDistributionGraph(numNodes, equation, sigma = 0.05) {
  let graph = new Graph(); // assuming your Graph class
  let tries = 0;

  while (Object.keys(graph.vertices).length < numNodes && tries < numNodes * 1000) {
    tries++;

    // sample uniform candidate point
    let x = random(-0.1, 1.1); // [0,1] normalized
    let y = random(-0.1, 1.1); // [0,1] normalized

    // signed "distance" from curve
    let d = Math.abs(equation(x, y));

    // acceptance probability: closer points more likely
    let p = Math.exp(-d / sigma);

    if (random() < p) {
      let name = "v" + Object.keys(graph.vertices).length;
      graph.addVertex(name, "main", { x, y });
    }
  }

  return graph;
}

function drawNode(name, vertex) {
    strokeWeight(2);
    diameter = max(2, width/200, height/200)

    vertexX = vertex.position.x * width;
    vertexY = vertex.position.y * height;
    
    //node
    fill(blackColor);
    stroke(blackColor);
    circle(vertexX, vertexY, diameter);

}

function drawKernelCircle(name, vertex) {
    strokeWeight(2);

    vertexX = vertex.position.x * width;
    vertexY = vertex.position.y * height;
    
    //kernelCircle
    let c = color(msuGreenColor);
    c.setAlpha(10);
    fill(c);
    stroke(c);
    circle(vertexX, vertexY, 2*ballRadius*width);

}

function drawEdges(name, vertex, graph) {
    vertexX = vertex.position.x * width;
    vertexY = vertex.position.y * height;

    for (let edge of vertex.edges) {
        let targetVertex = graph.vertices[edge.to];
        let targetX = targetVertex.position.x * width;
        let targetY = targetVertex.position.y * height;

        if (vertex.classification === "main" && targetVertex.classification === "main") {
            stroke(msuGreenColor);
        } else {
            stroke(msuGreenColor);
        }
        strokeWeight(edge.weight);
        line(vertexX, vertexY, targetX, targetY);
    }
}

function drawTriangle(tri, graph) {
  let [a, b, c] = tri.map(name => graph.vertices[name]);

  let ax = a.position.x * width;
  let ay = a.position.y * height;
  let bx = b.position.x * width;
  let by = b.position.y * height;
  let cx = c.position.x * width;
  let cy = c.position.y * height;

  let cFill = color(msuGreenColor);
  cFill.setAlpha(50);
  fill(cFill);
  noStroke();

  triangle(ax, ay, bx, by, cx, cy);
}

function findTriangles(graph) {
  let triangles = [];
  let seen = new Set();

  const names = Object.keys(graph.vertices);

  for (let a of names) {
    let neighborsA = graph.getNeighbors(a);

    for (let i = 0; i < neighborsA.length; i++) {
      for (let j = i + 1; j < neighborsA.length; j++) {
        let b = neighborsA[i];
        let c = neighborsA[j];

        // check if b and c are connected
        if (graph.getNeighbors(b).includes(c)) {
          let triangle = [a, b, c].sort(); // canonical order
          let key = triangle.join("-");

          if (!seen.has(key)) {
            seen.add(key);
            triangles.push(triangle);
          }
        }
      }
    }
  }
  return triangles;
}

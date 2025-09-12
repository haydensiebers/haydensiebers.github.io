
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

  healGraph(kernelDistance, edgeWeight = 2) {
    /* add edges between vertices that are within kernelDistance of each other */
    const names = Object.keys(this.vertices);
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        const v1 = this.vertices[names[i]];
        const v2 = this.vertices[names[j]];
        const dx = v1.position.x - v2.position.x;
        const dy = v1.position.y - v2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= kernelDistance) {
          this.addEdge(names[i], names[j], edgeWeight);
          this.addEdge(names[j], names[i], edgeWeight);
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

const fontSizeBase = parseInt(styles.getPropertyValue('--font-size-base'));

let canvas;
let graphDrawing;

function windowResized() {
    resizeCanvas(canvas.parent().clientWidth, canvas.parent().clientHeight);
}

function setup() {
  n = random(100);
  noiseSeed(n);
  randomSeed(n);
  graphDrawing = createFullGraph(35, 0.25);

  canvas = createCanvas(100, 100);
  canvas.parent("canvas-container");
  resizeCanvas(canvas.parent().clientWidth, canvas.parent().clientHeight);
}
console.log(canvas)

function draw() {
  background(255);
  noLoop();

  for (let [name, vertex] of Object.entries(graphDrawing.vertices)) {
      drawEdges(name, vertex, graphDrawing);
  }
  for (let [name, vertex] of Object.entries(graphDrawing.vertices)) {
      drawNode(name, vertex, "sub");
  }
  for (let [name, vertex] of Object.entries(graphDrawing.vertices)) {
      drawNode(name, vertex, "main");
  }

}

function createFullGraph(numSubNodes, kernelDistance, edgeWeight = 2) {
  let graph = createMainGraph();
  let subGraph = createRandomSubGraph(numSubNodes);

  graph.addGraph(subGraph);
  graph.healGraph(kernelDistance, edgeWeight);

  return graph;
}

function createMainGraph() {

  let graph = new Graph();
  console.log(graph)

  graph.addVertex("Research", "main", {x: 0.81, y: 0.17});
  graph.addVertex("Teaching", "main", {x: 0.71, y: 0.36});
  graph.addVertex("About", "main", {x: 0.86, y: 0.51});
  graph.addVertex("Fun", "main", {x: 0.75, y: 0.69});

  graph.addEdge("Research", "Teaching", 5);
  graph.addEdge("Teaching", "About", 5);
  graph.addEdge("About", "Fun", 5);

  console.log(graph)
  return graph;
}

function createRandomSubGraph(numNodes) {
  let graph = new Graph();
  console.log(1)
  for (let i = 0; i < numNodes; i++) {
    console.log(i)
    let x = random(-0.1, 1.1);
    let y = random(-0.1, 1.1);

    graph.addVertex(`Sub${i}`, "sub", {x, y});

    } 

  return graph;
}

function drawNode(name, vertex, classificationFilter = null) {
    vertexX = vertex.position.x * width;
    vertexY = vertex.position.y * height;

    diameter = max(10, width/20, height/20)
    if ((vertex.classification !== classificationFilter) && (classificationFilter !== null)) {
        return;
    }
    if (vertex.classification === "main") {
      drawMainNode(name, vertex);
    } 
    if (vertex.classification === "sub") {
      drawSubNode(name, vertex);
    }

}

function drawMainNode(name, vertex) {
  fill(whiteColor);
  stroke(accentColor);
  strokeWeight(2);

  vertexX = vertex.position.x * width;
  vertexY = vertex.position.y * height;
  
  handdrawnCicle(vertexX, vertexY, diameter, 9, 3);
  /*
  textAlign(CENTER, CENTER);
  text(str(name), vertexX - (str(name).length)*fontSizeBase, vertexY);
  */
}

function drawSubNode(name, vertex) {
    fill(primaryColor);
    stroke(secondaryColor);
    strokeWeight(2);

    vertexX = vertex.position.x * width;
    vertexY = vertex.position.y * height;
    handdrawnCicle(vertexX, vertexY, diameter/2, 6, 1);
}

function drawEdges(name, vertex, graph) {
    vertexX = vertex.position.x * width;
    vertexY = vertex.position.y * height;

    for (let edge of vertex.edges) {
        let targetVertex = graph.vertices[edge.to];
        let targetX = targetVertex.position.x * width;
        let targetY = targetVertex.position.y * height;

        if (vertex.classification === "main" && targetVertex.classification === "main") {
            stroke(secondaryColor);
        } else {
            stroke(secondaryColor);
        }
        strokeWeight(edge.weight);
        line(vertexX, vertexY, targetX, targetY);
    }
}

function handdrawnCicle(x, y, diameter, numPoints = 4, jitter = 1) {
  let radius = diameter / 2; 
  let numLines = 5; // number of overlapping lines for hand-drawn effect

  
  for (let l = 0; l < numLines; l++) {
    beginShape();
    for (let i = 0; i < numPoints; i++) {
      let angle = map(i, 0, numPoints, 0, TWO_PI);
      let r = radius; // jittered radius
      let positionX = x + r * cos(angle + random(-jitter, jitter)/50) + random(-jitter, jitter);
      let positionY = y + r * sin(angle + random(-jitter, jitter)/50) + random(-jitter, jitter);
      
      // curveVertex makes it smoother
      curveVertex(positionX, positionY);
    }
    endShape(CLOSE);
    noFill();
  }

  endShape(CLOSE);
}

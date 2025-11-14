let boxStepSketch = (p) => {
  const LIFETIME = 10;
  let boxes = [];
  let lastSpawn = 0;
  let step = -2;
  let theta = 0;
  let deltaTheta = 3 * Math.PI / 180;
  let stepSize = 10;
  let gapSize = 5;

  // Independent state
  let leftState = { x: null, y: null };
  let rightState = { x: null, y: null };

  p.setup = () => {
    p.createCanvas(300, 300);
    p.rectMode(p.CENTER);
    p.background(240);
  };

  p.draw = () => {
    p.background(240);

    const t = p.millis() / 100;

    // Spawn every second
    if (t - lastSpawn >= 1) {
      spawnBox(t);
      lastSpawn = t;
    }

    // Draw & fade boxes
    for (let i = boxes.length - 1; i >= 0; i--) {
      let b = boxes[i];
      let age = t - b.born;
      let fade = p.map(age, 0, LIFETIME, 255, 0);

      if (age >= LIFETIME) {
        boxes.splice(i, 1);
        continue;
      }

      p.noStroke();
      p.fill(b.color[0], b.color[1], b.color[2], fade);
      p.circle(b.x, b.y, b.size, b.size);
      //p.rect(b.x, b.y, b.size);

    }
  };

  function spawnBox(time) {
    let side = (step % 2 === 0) ? "left" : "right";
    let mod6 = step % 6;

    let box = {
      size: 10,
      born: time,
      x: 0,
      y: 0,
      color: side === "left" ? [50, 100, 255] : [50, 200, 50]
    };

    // -------------------------------
    // INITIALIZE STARTING POSITIONS
    // -------------------------------
    if (side === "left" && leftState.x === null) {
      leftState.x = p.width * 0.35;
      leftState.y = p.height * 0.5;
    }

    if (side === "right" && rightState.x === null) {
      rightState.x = p.width * 0.40;
      rightState.y = p.height * 0.5;
    }

    // -------------------------------
    // LEFT SIDE (3 BEHAVIORS)
    // -------------------------------
    if (side === "left") {
      switch (mod6) {
        case 0: // L0 behavior

          //leftState.x += 0;
          //leftState.y -= stepSize;

          leftState.x += 3*stepSize*sin(theta);
          leftState.y -= 3*stepSize*cos(theta);

          break;

        case 2: // L1 behavior
          leftState.x += 4*stepSize*cos(theta);
          leftState.y += 4*stepSize*sin(theta);
          break;

        case 4: // L2 behavior
          leftState.x += 5*stepSize*cos((theta+Math.PI-0.6435));
          leftState.y += 5*stepSize*sin((theta+Math.PI-0.6435));
          break;
      }

      box.x = leftState.x;
      box.y = leftState.y;
    }

    // -------------------------------
    // RIGHT SIDE (3 BEHAVIORS)
    // -------------------------------
    if (side === "right") {
      switch (mod6) {
        case 1: // R0 behavior
          rightState.x += 5*stepSize*cos((-theta+0.6435));
          rightState.y -= 5*stepSize*sin((-theta+0.6435));
          break;

        case 3: // R1 behavior
          rightState.x += 3*stepSize*sin(-theta);
          rightState.y += 3*stepSize*cos(-theta);
          break;

        case 5: // R2 behavior
          rightState.x -= 4*stepSize*cos(-theta);
          rightState.y += 4*stepSize*sin(-theta);
          break;
      }

      box.x = rightState.x;
      box.y = rightState.y;
    }

    boxes.push(box);
    step++;
    theta += deltaTheta;
  }
};

new p5(boxStepSketch, "boxstep");


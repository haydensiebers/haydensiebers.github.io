let boxStepSketch = (p) => {
  const LIFETIME = 100;
  let boxes = [];
  let lastSpawn = 0;
  let step = -2;

  function getTheta(step) {
    return (step + 2) * (5 * Math.PI / 180);  // 4° per step
  }

  let stepSize = 30;
  let stepRatio = 1.6180339887;
  let gapSize = 15;



  // Independent state
  let leftState = { x: null, y: null };
  let rightState = { x: null, y: null };

  p.setup = () => {
    p.createCanvas(250, 250);
    p.rectMode(p.CENTER);
    p.background(240);


    document.getElementById("boxStep-reset-button").addEventListener("click", () => {
      resetSketch(); // resets the animation
      p.loop();
      pauseBtn.textContent = "⏸";
    })

    const pauseBtn = document.getElementById("boxStep-pause-button");
    let isPaused = false;

    pauseBtn.addEventListener("click", () => {
      if (isPaused) {
        // Resume
        p.loop();
        pauseBtn.textContent = "⏸";
      } else {
        // Pause
        p.noLoop();
        pauseBtn.textContent = "▶";
      }

      isPaused = !isPaused;
    });

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
    for (let i = 0; i <= boxes.length - 1; i++) {
      let b = boxes[i];
      let age = t - b.born;
      let fade = p.map(age, 0, LIFETIME, 255, 0);

      if (age >= LIFETIME) {
        boxes.splice(i, 1);
        continue;
      }

      p.noStroke();

      if (i > boxes.length - 7) {
        p.stroke(0);
        p.strokeWeight(2);
      } else {
        p.noStroke();
      }
  
      p.fill(b.color[0], b.color[1], b.color[2], fade);
      p.circle(b.x, b.y, b.size, b.size);
      //p.rect(b.x, b.y, b.size, b.size);

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

          leftState.x += stepSize*sin(theta);
          leftState.y -= stepSize*cos(theta);

          break;

        case 2: // L1 behavior
          leftState.x += stepRatio*stepSize*cos(theta);
          leftState.y += stepRatio*stepSize*sin(theta);
          break;

        case 4: // L2 behavior

          leftState.x -= stepSize*sin(theta);
          leftState.y += stepSize*cos(theta);

          leftState.x -= stepRatio*stepSize*cos(theta);
          leftState.y -= stepRatio*stepSize*sin(theta);
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


          //rightState.x = leftState.x + gapSize*cos(-theta);
          //rightState.y = leftState.y + gapSize*sin(-theta);
      
          rightState.x -= stepSize*sin(-theta);
          rightState.y -= stepSize*cos(-theta);

          rightState.x += stepRatio*stepSize*cos(-theta);
          rightState.y -= stepRatio*stepSize*sin(-theta);

          break;

        case 3: // R1 behavior

          //rightState.x = leftState.x + gapSize*cos(-theta);
          //rightState.y = leftState.y + gapSize*sin(-theta);

          rightState.x += stepSize*sin(-theta);
          rightState.y += stepSize*cos(-theta);
          break;

        case 5: // R2 behavior

          // Set position relative to left state
          rightState.x = leftState.x + gapSize*cos(-theta);
          rightState.y = leftState.y - gapSize*sin(-theta);

          //rightState.x -= stepRatio*stepSize*cos(-theta);
          //rightState.y += stepRatio*stepSize*sin(-theta);
          break;
      }

      box.x = rightState.x;
      box.y = rightState.y;
    }

    boxes.push(box);
    step++;
    theta = getTheta(step);
  }

  function resetSketch() {
    boxes = [];
    lastSpawn = 0;
    theta = 0;
    step = -2;
    leftState = { x: null, y: null };
    rightState = { x: null, y: null };
  };




};

new p5(boxStepSketch, "boxstep");


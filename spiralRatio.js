
const ratioSlider = document.getElementById("spiralRatio-slider");
const ratioValue = document.getElementById("spiralRatio-value");
const goldenBtn = document.getElementById("spiralRatio-golden-btn");

const GOLDEN_RATIO = 0.6180339887;

ratio = parseFloat(ratioSlider.value);
ratioValue.textContent = ratio.toFixed(3);

let spiralRatioSketch = (p) => {
  const LIFETIME = 125;
  let seeds = [];
  let lastSpawn = 0;
  let radialStepSize = 0.5;
  let seedNumber = 0;
  let seedSize = 12;

  let goldenRatio = 0.6180339887;
  let ratio = goldenRatio;


  p.setup = () => {
    p.createCanvas(250, 250);
    p.rectMode(p.CENTER);
    p.background(240);

    const pauseBtn = document.getElementById("spiralRatio-pause-button");
    let isPaused = false;
    
    document.getElementById("spiralRatio-reset-button").addEventListener("click", () => {
      resetSketch(); // resets the animation
      p.loop();
      pauseBtn.textContent = "⏸";
    })

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

    ratioSlider.addEventListener("input", () => {
      ratio = parseFloat(ratioSlider.value);
      ratioValue.textContent = ratio.toFixed(3);
    });

    goldenBtn.addEventListener("click", () => {
      ratio = GOLDEN_RATIO;
      ratioSlider.value = ratio;
      ratioValue.textContent = ratio.toFixed(3);
    });

  };

  p.draw = () => {
    p.background(240);

    const t = p.millis() / 100;

    // Spawn every second
    if (t - lastSpawn >= 1) {
      spawnSeed(t);
      lastSpawn = t;
    }

    // Draw & fade seeds
    for (let i = 0; i <= seeds.length - 1; i++) {
      let thisSeed = seeds[i];
      let age = t - thisSeed.born;
      let fade = p.map(age, 0, LIFETIME, 255, 0);

      if (age >= LIFETIME) {
        seeds.splice(i, 1);
        continue;
      }

      radialSpread(thisSeed);
      growSize(thisSeed);

      // Draw seed

      p.noStroke();
      p.fill(p.red(thisSeed.color), p.green(thisSeed.color), p.blue(thisSeed.color), fade);

      p.circle(thisSeed.x, thisSeed.y, thisSeed.size, thisSeed.size);

    }
  };

  function spawnSeed(time) {

    seedNumber = seedNumber + 1;

    let seed = {
      size: 0,
      born: time,
      seedNumber: seedNumber,
      x: p.width / 2,
      y: p.height / 2,
      color: p.color(tertiaryColor),
    };

    seeds.push(seed);
  };

  
  function calculateRadialStepSizeModifier(radius) {
    return (-Math.tanh(0.0001*radius) + 1) * 0.5;
  };

  function calculateSeedSize(radius) {
    return (Math.tanh(0.0001*radius + 0.8) * seedSize);
  }

  function radialSpread(seed) {
    let seedNumber = seed.seedNumber;

    currentRadius = (seed.x-p.width/2)**2 + (seed.y-p.height/2)**2;
    radialStepSizeModifier = calculateRadialStepSizeModifier(currentRadius);

    let angle = (seedNumber * ratio * p.TAU) % p.TAU;
    let radius = radialStepSize*radialStepSizeModifier;    

    console.log(radialStepSizeModifier);

    let xDisplacement = p.cos(angle) * radius;
    let yDisplacement = p.sin(angle) * radius;

    seed.x += xDisplacement;
    seed.y += yDisplacement;
  };

  function growSize(seed) {
    let currentRadius = (seed.x-p.width/2)**2 + (seed.y-p.height/2)**2;
    seed.size = calculateSeedSize(currentRadius);
  }


  function resetSketch() {
    seeds = [];
    seedNumber = 0;
  };

};

new p5(spiralRatioSketch, "spiralRatio");

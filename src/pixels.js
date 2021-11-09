const createPixelElement = (i, j, size, competitor1, competitor2) => {
  let firstCompetitorSide = Math.ceil(size / 2);
  let competitor = i < firstCompetitorSide ? competitor1 : competitor2;

  return {
    color: competitor.color,
    force: competitor.force,
  };
};

class Pixel {
  constructor() {
    this.color = this.createColor();
    this.force = Math.floor(Math.random() * 9) + 1;

    console.log(`Color: ${this.color} || Force: ${this.force}`);
  }
  createColor() {
    let color = Math.floor(Math.random() * 16777215).toString(16);
    color = "#" + ("000000" + color).slice(-6);
    return color;
  }
}
class Simulate {
  constructor(size = 125) {
    this.current = 1;
    this.interval = setInterval(this.run, 2);
    this.competitor1 = new Pixel();
    this.competitor2 = new Pixel();

    this.size = size;
    this.step = 250 / size;
    //Normally the step would be 500 / size but I decreased to look better with a smaller size
    this.arena = this.createArena(size, this.competitor1, this.competitor2);
    this.oldArena = this.arena;
    setInterval(() => {
      this.run();
      document.getElementById("competitor1").innerHTML = this.competitor1.force;

      document.getElementById("competitor2").innerHTML = this.competitor2.force;
    }, 2);
  }
  run() {
    this.arena = calculate(
      this.arena,
      this.size,
      this.competitor1,
      this.competitor2
    );
    draw(this.arena, this.competitor1, this.competitor2, this.step, this.size);
  }

  createArena(size, competitor1, competitor2) {
    const arena = [];
    for (let i = 0; i < size; i++) {
      const currentI = [];
      for (let j = 0; j < size; j++) {
        currentI.push(createPixelElement(i, j, size, competitor1, competitor2));
      }
      arena.push(currentI);
    }
    return arena;
  }
}
function calculate(arena, size, competitor1, competitor2) {
  let newArena = arena;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let neighbours = getNeighbours(arena, i, j, size);
      let newPixel = getNewValue(
        neighbours,
        arena[i][j],
        competitor1,
        competitor2
      );
      newArena[i][j].color = newPixel.color;
      newArena[i][j].force = newPixel.force;
    }
  }
  return newArena;
}

function getNewValue(neighbours, curPixel, competitor1, competitor2) {
  let competitor1Force = 0;
  let competitor2Force = 0;
  competitor1Force += curPixel.force;
  let otherTeam = { color: undefined, force: undefined };
  if (competitor1.color == curPixel.color) {
    otherTeam.force = competitor2.force;
    otherTeam.color = competitor2.color;
  } else {
    otherTeam.force = competitor1.force;
    otherTeam.color = competitor1.color;
  }
  for (let i = 0; i < neighbours.length; i++) {
    if (neighbours[i] == undefined) continue;
    if (neighbours[i].color == curPixel.color) {
      competitor1Force += neighbours[i].force;
    } else {
      competitor2Force += neighbours[i].force;
    }
  }
  let random = Math.floor(Math.random() * 10);
  if (competitor1Force >= competitor2Force) {
    if (random < 2 && competitor2Force > 0) {
      return { color: otherTeam.color, force: otherTeam.force };
    }
    return { color: curPixel.color, force: curPixel.force };
  } else {
    if (random < 2) {
      return { color: curPixel.color, force: curPixel.force };
    }
    return { color: otherTeam.color, force: otherTeam.force };
  }
}
function getNeighbours(arena, i, j, size) {
  let left,
    right,
    up,
    down = undefined;
  if (j > 0) {
    left = arena[i][j - 1];
  }
  if (j < size - 1) {
    right = arena[i][j + 1];
  }
  if (i > 0) {
    up = arena[i - 1][j];
  }
  if (i < size - 1) {
    down = arena[i + 1][j];
  }
  return [right, left, up, down];
}
function draw(arena, competitor1, competitor2, step, size) {
  let canvas = document.getElementById("scrawl");
  let ctx = canvas.getContext("2d");
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      ctx.fillStyle = competitor2.color;
      if (arena[i][j].color === competitor1.color) {
        ctx.fillStyle = competitor1.color;
      }
      ctx.fillRect(i * step, j * step, step, step);
    }
  }
}

let simulation = new Simulate(75);

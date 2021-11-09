var canvas, ctx;
var interval;
var width, height;
var size, step;
var Sum_1;
const createPixelElement = (i, j, size, competitor1, competitor2) => {
  let firstCompetitorSide = Math.ceil(size / 2);
  let competitor = i < firstCompetitorSide ? competitor1 : competitor2;

  return {
    competitor: competitor,
  };
};

class Pixel {
  constructor() {
    this.color = this.createColor();
    this.force = Math.floor(Math.random() * 10);
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
    this.step = 500 / size;
    this.arena = this.createArena(size, this.competitor1, this.competitor2);
    this.oldArena = this.arena;
    setInterval(() => {
      this.run();
    }, 2);
  }
  run() {
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

function draw(arena, competitor1, competitor2, step, size) {
  let canvas = document.getElementById("scrawl");
  let ctx = canvas.getContext("2d");
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      ctx.fillStyle = competitor2.color;
      if (arena[i][j].competitor === competitor1) {
        ctx.fillStyle = competitor1.color;
      }
      ctx.fillRect(i * step, j * step, step, step);
    }
  }
}

let simulation = new Simulate(125);
console.log(simulation);

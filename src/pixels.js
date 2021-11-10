const createPixelElement = (i, j, size, competitor1, competitor2) => {
  let firstCompetitorSide = Math.ceil(size / 2);
  let competitor = i < firstCompetitorSide ? competitor1 : competitor2;

  return {
    team: competitor.team,
    color: competitor.color,
    force: competitor.force,
    i: i,
    j: j,
  };
};

class Pixel {
  constructor(size, team, parent1 = [], parent2 = []) {
    this.team = team;
    this.color = this.createColor();
    if (parent1.length < 1 || parent2.length < 1) {
      console.log("Parent:");

      this.force = Math.floor(Math.random() * 9) + 1;
      this.defenseAdvantage = Math.floor(Math.random() * 3) + 1;
      this.attackAdvantage = Math.floor(Math.random() * 3) + 1;
      this.gangAdvantage = Math.floor(Math.random() * 3) + 1;
      this.soloAdvantage = Math.floor(Math.random() * 3) + 1;
      this.surprise = Math.floor(Math.random() * 6) + 1;
      this.genes = new Genes();
      this.genes = this.genes.getGenes();
    } else {
      console.log("Child:");
      this.genes = new Genes(4, parent1.genes, parent2.genes);
      this.genes = this.genes.getGenes();

      console.log(this.genes);

      let parentsForce = Math.floor((parent1.force + parent2.force) / 2);
      let parentsAttackAdvantage = Math.floor(
        (parent1.attackAdvantage + parent2.attackAdvantage) / 2
      );
      let parentsDefenseAdvantage = Math.floor(
        (parent1.defenseAdvantage + parent2.defenseAdvantage) / 2
      );
      let parentsGangAdvantage = Math.floor(
        (parent1.gangAdvantage + parent2.gangAdvantage) / 2
      );
      let parentsSoloAdvantage = Math.floor(
        (parent1.soloAdvantage + parent2.soloAdvantage) / 2
      );
      let parentsSurprise = Math.floor(
        (parent1.surprise + parent2.surprise) / 2
      );
      this.force = this.genes[0] == 0 ? parentsForce - 1 : parentsForce + 1;
      this.attackAdvantage =
        this.genes[1] == 0
          ? parentsAttackAdvantage - 1
          : parentsAttackAdvantage + 1;
      this.defenseAdvantage =
        this.genes[2] == 0
          ? parentsDefenseAdvantage - 1
          : parentsDefenseAdvantage + 1;
      this.gangAdvantage =
        this.genes[3] == 0
          ? parentsGangAdvantage - 1
          : parentsGangAdvantage + 1;
      this.soloAdvantage =
        this.genes[4] == 0
          ? parentsSoloAdvantage - 1
          : parentsSoloAdvantage + 1;
      this.surprise =
        this.genes[5] == 0 ? parentsSurprise - 1 : parentsSurprise + 1;
    }
    this.totalPixels = Math.floor((size * size) / 2);
    this.numberOfExtraLifes = 50;
    // this.isKingAlive = true;
    // let row = Math.ceil(size / 2);
    // let column = team == 1 ? 0 : size - 1;
    // this.kingPosition = [row, column];
    console.log(`    Team ${team}
    Color: ${this.color} || Force: ${this.force}
    Defense Advantage: ${this.defenseAdvantage} || Attack Advantage: ${this.attackAdvantage}
    Gang Advantage: ${this.gangAdvantage} || Solo Advantage : ${this.soloAdvantage}`);
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
    this.competitor1 = new Pixel(
      size,
      1,
      new Pixel(size, 1),
      new Pixel(size, 2)
    );
    this.competitor2 = new Pixel(
      size,
      2,
      new Pixel(size, 1),
      new Pixel(size, 2)
    );

    this.size = size;
    this.step = 500 / size;
    //Normally the step would be 500 / size but I decreased to look better with a smaller size
    this.arena = this.createArena(size, this.competitor1, this.competitor2);
    this.oldArena = this.arena;
    this.interval = setInterval(() => {
      this.run();
      document.getElementById(
        "competitor1"
      ).innerHTML = `Color: ${this.competitor1.color} || Force: ${this.competitor1.force}
      Defense Advantage: ${this.competitor1.defenseAdvantage} || Attack Advantage: ${this.competitor1.attackAdvantage}
      Gang Advantage: ${this.competitor1.gangAdvantage} || Solo Advantage : ${this.competitor1.soloAdvantage} || PIXELS: ${this.competitor1.totalPixels}
      || Lifes: ${this.competitor1.numberOfExtraLifes}`;
      document.getElementById("competitor1").style.color =
        this.competitor1.color;

      document.getElementById(
        "competitor2"
      ).innerHTML = `Color: ${this.competitor2.color} || Force: ${this.competitor2.force}
      Defense Advantage: ${this.competitor2.defenseAdvantage} || Attack Advantage: ${this.competitor2.attackAdvantage}
      Gang Advantage: ${this.competitor2.gangAdvantage} || Solo Advantage : ${this.competitor2.soloAdvantage} || PIXELS: ${this.competitor2.totalPixels}
      || Lifes: ${this.competitor2.numberOfExtraLifes}`;
      document.getElementById("competitor2").style.color =
        this.competitor2.color;
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
  clearInterval() {
    clearInterval(this.interval);
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
  if (competitor1.totalPixels < 2000) competitor1.numberOfExtraLifes--;
  if (competitor2.totalPixels < 2000) competitor2.numberOfExtraLifes--;
  return newArena;
}

function getNewValue(neighbours, curPixel, competitor1, competitor2) {
  let defenseTeam,
    attackTeam = undefined;
  if (competitor1.color == curPixel.color) {
    defenseTeam = competitor1;
    attackTeam = competitor2;
  } else {
    defenseTeam = competitor2;
    attackTeam = competitor1;
  }
  let lowNumbersBonusDefense =
    defenseTeam.totalPixels < 2000 && defenseTeam.numberOfExtraLifes > 0
      ? 50
      : 0;
  let lowNumbersBonusAttack =
    attackTeam.totalPixels < 2000 && attackTeam.numberOfExtraLifes > 0 ? 50 : 0;
  let defenseForce = 0;
  let attackForce = 0;
  let defenders = 1;
  let attackers = 0;
  let defenseGangBonus = 0;
  let attackGangBonus = 0;
  let defenseBonus = defenseTeam.defenseAdvantage;
  let attackBonus = attackTeam.attackAdvantage;
  defenseForce += curPixel.force;

  for (let i = 0; i < neighbours.length; i++) {
    if (neighbours[i] == undefined) continue;
    if (neighbours[i].color == curPixel.color) {
      defenseForce += neighbours[i].force;
      defenders++;
    } else {
      attackForce += neighbours[i].force;
      attackers++;
    }
  }
  if (attackForce < 1) {
    return { color: defenseTeam.color, force: defenseTeam.force };
  }
  attackGangBonus =
    defenders > attackers ? attackTeam.soloAdvantage : attackTeam.gangAdvantage;
  defenseGangBonus =
    defenders > attackers
      ? defenseTeam.gangAdvantage
      : defenseTeam.soloAdvantage;
  let defenseScore =
    defenseForce +
    defenseGangBonus +
    defenseTeam.surprise +
    defenseBonus +
    lowNumbersBonusDefense +
    defenders -
    attackers;
  let attackScore =
    attackForce +
    attackGangBonus +
    attackTeam.surprise +
    attackBonus +
    lowNumbersBonusAttack +
    attackers -
    defenders;
  let random = Math.floor(Math.random() * 10);

  if (defenseScore >= attackScore) {
    if (random < 2) {
      attackTeam.totalPixels++;
      defenseTeam.totalPixels--;
      return { color: attackTeam.color, force: attackTeam.force };
    }
    return { color: defenseTeam.color, force: defenseTeam.force };
  } else {
    if (random < 2) {
      return { color: defenseTeam.color, force: defenseTeam.force };
    } else {
      attackTeam.totalPixels++;
      defenseTeam.totalPixels--;
      return { color: attackTeam.color, force: attackTeam.force };
    }
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

let simulation = new Simulate(125);

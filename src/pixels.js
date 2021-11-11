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
      this.force = Math.floor(Math.random() * 9) + 1;
      this.defenseAdvantage = Math.floor(Math.random() * 3) + 1;
      this.attackAdvantage = Math.floor(Math.random() * 3) + 1;
      this.gangAdvantage = Math.floor(Math.random() * 3) + 1;
      this.soloAdvantage = Math.floor(Math.random() * 3) + 1;
      this.surprise = Math.floor(Math.random() * 6) + 1;
      this.genes = new Genes();
      this.genes = this.genes.getGenes();
    } else {
      this.genes = new Genes(4, parent1.genes, parent2.genes);
      this.genes = this.genes.getGenes();

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
    // console.log(`    Team ${team}
    // Color: ${this.color} || Force: ${this.force}
    // Defense Advantage: ${this.defenseAdvantage} || Attack Advantage: ${this.attackAdvantage}
    // Gang Advantage: ${this.gangAdvantage} || Solo Advantage : ${this.soloAdvantage}`);
  }
  createColor() {
    let color = Math.floor(Math.random() * 16777215).toString(16);
    color = "#" + ("000000" + color).slice(-6);
    return color;
  }
  resetPixels() {
    this.totalPixels = Math.floor((size * size) / 2);
  }
  addPixelValues(
    force,
    defenseAdvantage,
    attackAdvantage,
    gangAdvantage,
    soloAdvantage,
    surprise
  ) {
    this.force = force;
    this.defenseAdvantage = defenseAdvantage;
    this.attackAdvantage = attackAdvantage;
    this.gangAdvantage = gangAdvantage;
    this.soloAdvantage = soloAdvantage;
    this.surprise = surprise;
    this.genes = new Genes();
    this.genes = this.genes.getGenes();
  }
}
class Simulate {
  constructor(size = 125, show = false, competitor1, competitor2) {
    this.current = 1;
    this.show = show;
    this.interval = setInterval(this.run, 2);
    this.competitor1 = competitor1;
    this.competitor2 = competitor2;
    // new Pixel(
    //   size,
    //   2,
    //   new Pixel(size, 1),
    //   new Pixel(size, 2)
    // );

    this.size = size;
    this.step = 500 / size;
    //Normally the step would be 500 / size but I decreased to look better with a smaller size
    this.arena = this.createArena(size, this.competitor1, this.competitor2);
    this.oldArena = this.arena;
    this.interval = setInterval(() => {
      this.run();
    }, 2);
  }
  run() {
    this.arena = calculate(
      this.arena,
      this.size,
      this.competitor1,
      this.competitor2
    );
    if (this.show) {
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
      draw(
        this.arena,
        this.competitor1,
        this.competitor2,
        this.step,
        this.size
      );
    }
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
      newArena[i][j].team = newPixel.team;
    }
  }
  if (competitor1.totalPixels < 2000) competitor1.numberOfExtraLifes--;
  if (competitor2.totalPixels < 2000) competitor2.numberOfExtraLifes--;
  return newArena;
}

function getNewValue(neighbours, curPixel, competitor1, competitor2) {
  let defenseTeam,
    attackTeam = undefined;
  if (competitor1.team == curPixel.team) {
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
    return {
      color: defenseTeam.color,
      force: defenseTeam.force,
      team: defenseTeam.team,
    };
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
      return {
        color: attackTeam.color,
        force: attackTeam.force,
        team: attackTeam.team,
      };
    }
    return {
      color: defenseTeam.color,
      force: defenseTeam.force,
      team: defenseTeam.team,
    };
  } else {
    if (random < 2) {
      return {
        color: defenseTeam.color,
        force: defenseTeam.force,
        team: defenseTeam.team,
      };
    } else {
      attackTeam.totalPixels++;
      defenseTeam.totalPixels--;
      return {
        color: attackTeam.color,
        force: attackTeam.force,
        team: attackTeam.team,
      };
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

// let simulation = new Simulate(125, true);
let participants = [];
let size = 125;
let rounds = 4;
// let createdPixel = new Pixel(size, 99);
// createdPixel.addPixelValues(10, 10, 10, 10, 10, 10);
// StartSimulation(rounds, createdPixel, createdPixel);
StartSimulation(rounds);

function playMatches(rounds, curRound = 0, numberOfParticipants) {
  //evaluateMatches
  if (participants.length < 3) {
    MultiplyAndRepeat(rounds, participants);
    return;
  }
  if (curRound != 0) {
    let newParticipants = [];
    for (let i = 0; i < participants.length; i += 2) {
      if (participants[i].totalPixels > participants[i + 1].totalPixels) {
        newParticipants.push(participants[i]);
      } else {
        newParticipants.push(participants[i + 1]);
      }
    }
    participants = newParticipants;
    //EVALUATE
  }
  let simulations = [];
  for (let i = 0; i < participants.length; i += 2) {
    let show = i == 0 ? true : false;
    participants[i].resetPixels();
    participants[i + 1].resetPixels();
    simulations.push(
      new Simulate(size, show, participants[i], participants[i + 1])
    );
  }
  //Start new Matches

  let interval = setTimeout(() => {
    curRound++;
    playMatches(rounds, curRound, numberOfParticipants);
    for (let i = 0; i < simulations.length; i++) {
      const simulation = simulations[i];
      simulation.clearInterval();
    }
  }, 2000);
}
let generation = 0;
function MultiplyAndRepeat(rounds, participants) {
  StartSimulation(rounds, participants[0], participants[1]);
  generation++;
  document.getElementById(
    "previousParent1"
  ).innerHTML = `Color: ${participants[0].color} || Force: ${participants[0].force}
  Defense Advantage: ${participants[0].defenseAdvantage} || Attack Advantage: ${participants[0].attackAdvantage}
  Gang Advantage: ${participants[0].gangAdvantage} || Solo Advantage : ${participants[0].soloAdvantage} || PIXELS: ${participants[0].totalPixels}
  || Lifes: ${participants[0].numberOfExtraLifes}`;
  document.getElementById("previousParent1").style.color =
    participants[0].color;
  document.getElementById(
    "previousParent2"
  ).innerHTML = `Color: ${participants[1].color} || Force: ${participants[1].force}
  Defense Advantage: ${participants[1].defenseAdvantage} || Attack Advantage: ${participants[1].attackAdvantage}
  Gang Advantage: ${participants[1].gangAdvantage} || Solo Advantage : ${participants[1].soloAdvantage} || PIXELS: ${participants[1].totalPixels}
  || Lifes: ${participants[1].numberOfExtraLifes}`;
  document.getElementById("previousParent2").style.color =
    participants[1].color;
}

function StartSimulation(rounds, parent1 = [], parent2 = []) {
  participants = [];
  let numberOfParticipants = Math.pow(2, rounds);
  for (let i = 0; i < numberOfParticipants; i++) {
    let participant = new Pixel(size, i, parent1, parent2);
    participants.push(participant);
  }
  playMatches(rounds, 0, numberOfParticipants);

  //create all pixels  needed for the tournment
}

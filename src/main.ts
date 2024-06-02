import { Vector2D } from "./utils/vector";
import { rgbToHex, hexToRgb } from "./utils/color";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
let context = canvas.getContext('2d');

class Organism {
  position: Vector2D;
  radius: number;
  color: string;
  isDead: boolean;

  /**
   * Constructor for Organism.
   * @param position {Vector2D} coordinates that the Organism will be drawn at on the canvas.
   * @param radius {number} radius of organism (circle) on canvas.
   * @param color {string} color of organism (circle) on canvas in rgb or hex.
   */
  constructor(position: Vector2D, radius: number, color: string) {
    this.position = position;
    this.radius = radius;
    this.color = color;
  }

  /**
   * Draw organism as a colour filled circle on the canvas at the organisms x,y coordinates.
   */
  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = this.color;
    context.fill();
  }

  /**
   * Return the Euclidean distance between this Organism and another organism
   * @param other {Organism}
   * @returns {number}
   */
  dist(other: Organism) {
    return this.position.distance(other.position);
  }

}


class Predator extends Organism {
  velocity: Vector2D;
  acceleration: Vector2D;
  energy: number;
  maxEnergy: number;
  senseDistance: number;
  speed: number;
  preyEaten: number;
  isDead: boolean;
  isSurvivor: boolean;

  /**
   * Constructor for Predator.
   * @param position {Vector2D} coordinates on canvas that the Predator will be drawn at.
   * @param radius {number} radius of the Predator
   * @param energy {number} the amount of energy the Predator can have, if it is <= 0 then it cannot move / is dead.
   * @param senseDistance {number} the distance from itself that it can detect objects in the environment
   * @param speed {number} the speed that the predator can move in environment
   * @param color {string} color of Predator
   */
  constructor(position: Vector2D, radius: number, energy: number, senseDistance: number, speed: number, color='#000000') {
    super(position, radius, color);

    this.velocity = new Vector2D(0, 0);
    this.acceleration = new Vector2D(0, 0);
    this.energy = energy; // energy is used as an index for the directions array
    this.maxEnergy = energy;
    this.senseDistance = senseDistance;
    this.speed = speed;
    this.preyEaten = 0;
    this.isDead = false;
    this.isSurvivor = false;
  }

  /**
   * Move the Predator by updating its acceleration, velocity and x,y coordinates.
   */
  move(direction: Vector2D) {
    this.acceleration = direction;
    this.velocity
      .add(direction)
      .normalize() // make velocity vector a unit vector to preserve direction given by acceleration
      .multiply(this.speed); // direction of velocity is different but speed is constant

    this.position.x += this.velocity.x;
    if (this.position.x < this.radius) {
      this.position.x = this.radius;
    } else if (this.position.x > canvas.width - this.radius) {
      this.position.x = canvas.width - this.radius;
    }

    this.position.y += this.velocity.y;
    if (this.position.y < this.radius) {
      this.position.y = this.radius;
    } else if (this.position.y > canvas.height - this.radius) {
      this.position.y = canvas.height - this.radius;
    }
  }

  update(prey: Prey) {
    if (!this.isDead) {
      if (this.energy > 1) {
        if (this.dist(prey) <= this.radius + 0.5) { // if on prey (/ very close to prey), move prey outside of canvas
          prey.position.x = -canvas.width;
          prey.position.y = -canvas.height;
          prey.isDead = true;
          this.preyEaten++;
        }

        if (this.dist(prey) <= this.senseDistance && this.preyEaten < 2) { // move to prey even if we sense an edge (prey are always on canvas)
          this.move(new Vector2D(prey.position.x - this.position.x, prey.position.y - this.position.y));
        } else if (this.distToEdge(this.radius, null) <= this.senseDistance) { // left edge
          if (0 < this.preyEaten) {
            if (this.distToEdge(this.radius, null) <= this.radius) {
              this.isSurvivor = true;
            } else {
              this.move(new Vector2D(-1 ,0));
            }
          } else {
            this.move(new Vector2D(Math.random(), (Math.random() * 2) - 1));
          }
        } else if (this.distToEdge(canvas.width, null) <= this.senseDistance) { // right edge
          if (0 < this.preyEaten) {
            if (this.distToEdge(canvas.width, null) <= this.radius) {
              this.isSurvivor = true;
            } else {
              this.move(new Vector2D(1 ,0));
            }
          } else {
            this.move(new Vector2D(-Math.random(), (Math.random() * 2) - 1));
          }
        } else if (this.distToEdge(null, this.radius) <= this.senseDistance) { // top edge
          if (0 < this.preyEaten) {
            if (this.distToEdge(null, this.radius) <= this.radius) {
              this.isSurvivor = true;
            } else {
              this.move(new Vector2D(0 ,-1));
            }
          } else {
            this.move(new Vector2D((Math.random() * 2) - 1, Math.random()));
          }
        } else if (this.distToEdge(null, canvas.height) <= this.senseDistance) { // bottom edge
          if (0 < this.preyEaten) {
            if (this.distToEdge(null, canvas.height) <= this.radius) {
              this.isSurvivor = true;
            } else {
              this.move(new Vector2D(0,1));
            }
          } else {
            this.move(new Vector2D((Math.random() * 2) - 1, -Math.random()));
          }
        } else {
          this.move(Vector2D.fromAngle(Math.random() * 2 * Math.PI));
        }
        this.updateEnergy();
      } else {
        this.isDead = true;
      }
    }
  }

  draw() {
    super.draw();
    this.drawSense();
    this.drawDirection();
  }

  drawSense() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.senseDistance, 0, 2 * Math.PI, false);
    context.stroke();
  }

  drawDirection() {
    context.beginPath();
    context.moveTo(this.position.x, this.position.y);
    context.lineTo(this.position.x + ((this.radius / 2) * this.velocity.x), this.position.y + ((this.radius / 2) * this.velocity.y));
    context.stroke();
  }

  clone() {
    return new Predator(this.position, this.radius, this.maxEnergy, this.senseDistance, this.speed, this.color);
  }

  /**
   * Mutates the organism by changing its sensory distance or speed, the chance of a mutation is given by mutationRate.
   * @param mutationRate {number} percentage chance that a mutation will occur
   */
  mutate(mutationRate) {
    let r = Math.random();
    if (r < mutationRate) {
      let rgb = hexToRgb(this.color);
      if (!rgb) return;
      r = Math.random();
      if (r < 0.5) { // mutate the sensory distance
        this.senseDistance = this.senseDistance * 1.1;
        if (rgb.b <= 223) rgb.b += 32;
      } else { // mutate the speed
        this.speed = this.speed * 1.1;
        if (rgb.r <= 223) rgb.r += 32;
      }
      this.color = rgbToHex(rgb.r, rgb.g, rgb.b);
    }
  }

  /**
   * updates the energy values based on the properties of the organism.
   */
  updateEnergy() {
    let senseCost = 0.25*this.radius + 0.25;
    let speedCost = 0.5*(this.speed - 3)*(this.speed - 3) + 1;
    this.energy = this.energy - senseCost - speedCost;
  }

  distToEdge(x, y) {
    let a = 0;
    let b = 0;
    let c = 0;

    if (x === null) {
      if (0 < y) {
        b = 1;
      }
      c = -y;
    }

    if (y === null) {
      if (0 < x) {
        a = 1;
      }
      c = -x;
    }
    return Math.abs(a*this.position.x + b*this.position.y + c) / Math.sqrt((a * a) + (b * b));
  }
}


class Prey extends Organism {
  /**
   * Constructor for Prey.
   * @param position {Vector2D} coordinates on canvas that Prey will be drawn at
   * @param radius {number} radius of the Prey
   */
  constructor(position: Vector2D, radius: number) {
    super(position, radius, '#23BA4C');
  }
}


class Population<T extends Organism> {
  size: number;
  organisms: T[];
  allDead: boolean;
  generation: number;

  /**
   * Constructor for Population.
   * @param size of Population
   */
  constructor(size) {
    this.size = size;
    this.organisms = [];
    this.allDead = false;
  }
}


class PredatorPopulation extends Population<Predator> {
  constructor(size) {
    super(size);
    let radius = 5;
    let randomX = Math.floor(Math.random() * (canvas.width - radius) + radius);
    let randomY = Math.floor(Math.random() * (canvas.height - radius) + radius);
    let energy = 1000;
    let senseDistance = radius*4;
    let speed = 3;
    for (let i = 0; i < size; i++) {
      if (Math.random() < 0.5) {
        if (Math.random() < 0.5) {
          this.organisms.push(new Predator(new Vector2D(randomX, radius), radius, energy, senseDistance, speed));
        } else {
          this.organisms.push(new Predator(new Vector2D(randomX, canvas.height - radius), radius, energy, senseDistance, speed));
        }
      } else {
        if (Math.random() < 0.5) {
          this.organisms.push(new Predator(new Vector2D(radius, randomY), radius,energy, senseDistance, speed));
        } else {
          this.organisms.push(new Predator(new Vector2D(canvas.width - radius, randomY), radius, energy, senseDistance, speed));
        }
      }
    }
    this.generation = 0;
  }

  update(preyPopulation) {
    this.allDead = true;
    for (let i = 0; i < this.size; i++) {
      let minDist = this.organisms[i].dist(preyPopulation.organisms[0]);
      let minDistPrey = preyPopulation.organisms[0];
      let temp = 0;
      for (let j = 1; j < preyPopulation.size; j++) {
        temp = this.organisms[i].dist(preyPopulation.organisms[j]);
        if (temp < minDist) {
          minDist = temp;
          minDistPrey = preyPopulation.organisms[j];
        }
      }
      this.organisms[i].update(minDistPrey);
      this.organisms[i].draw();
      if (!this.organisms[i].isDead) {
        this.allDead = false;
      }
    }
  }

  naturalSelection() {
    let newPopulationSize = 0;
    let newPopulation = [];
    for (let i = 0; i < this.size; i++) {
      if (this.organisms[i].isSurvivor) {
        if (this.organisms[i].preyEaten === 1) {
          newPopulation.push(this.organisms[i].clone()); // organism survives to next day
          newPopulationSize++;
        } else if (this.organisms[i].preyEaten > 1) {
          newPopulation.push(this.organisms[i].clone());
          let newOffspring = this.organisms[i].clone();
          newOffspring.mutate(0.1);
          newPopulation.push(newOffspring);
          newPopulationSize += 2;
        }
      }
    }

    this.size = newPopulationSize;
    this.organisms = newPopulation;

    this.generation++;
  }
}


class PreyPopulation extends Population<Prey> {
  constructor(size) {
    super(size);
    let radius = 5;
    for (let i = 0; i < size; i++)
      this.organisms.push(new Prey(new Vector2D(Math.floor(Math.random() * (canvas.width - radius) + radius),  Math.floor(Math.random() * (canvas.height - radius) + radius)), radius));
  }

  update() {
    this.allDead = true;
    for (let i = 0; i < this.size; i++) {
      this.organisms[i].draw();
      if (!this.organisms[i].isDead) {
        this.allDead = false;
      }
    }
  }
}

const predatorPopulationSize = 5; // number of Predators in population
const preyPopulationSize = 30; // number of Prey in population

let predatorPopulation = new PredatorPopulation(predatorPopulationSize);
let preyPopulation = new PreyPopulation(preyPopulationSize);

const main = () => {
  // $('#day').text(this.predatorPopulation.generation.toString());
  // $('#population-size').text(this.predatorPopulation.size.toString());
  context.clearRect(0, 0, canvas.height, canvas.width); // clears the canvas
  predatorPopulation.update(preyPopulation);  // updates and draws predators
  preyPopulation.update(); // draws prey
  if (predatorPopulation.allDead || preyPopulation.allDead) {
    predatorPopulation.naturalSelection();
    preyPopulation = new PreyPopulation(preyPopulation.size);
  }

  setTimeout(() => {
    window.requestAnimationFrame(main);
  }, 1000);
}

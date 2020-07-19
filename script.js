const canvas = $('canvas.creatures');
let context = canvas[0].getContext('2d');
const canvasWidth = canvas.width();
const canvasHeight = canvas.height();
canvas.attr({height: canvasHeight, width: canvasWidth});


function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


class Vector {
  /**
   * Constructor for 2-dimensional Vector
   * @param x {number} x-coordinate
   * @param y {number} y-coordinate
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns new Vector created from the angle theta.
   * @param theta {number} angle in radians
   * @returns {Vector}
   */
  static fromAngle(theta) {
    return new Vector(Math.cos(theta), Math.sin(theta));
  }

  /**
   * Adds the x,y values of other Vector to this Vector and returns it.
   * @param other {Vector}
   * @returns {Vector}
   */
  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  /**
   * Multiplies Vector by a constant number n and returns it.
   * @param n {number}
   * @returns {Vector}
   */
  multiply(n) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /**
   * Returns the magnitude of the Vector.
   * @returns {number}
   */
  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  /**
   * Normalizes the vector and returns it.
   * @returns {Vector}
   */
  normalize() {
    let magnitude = this.magnitude();
    this.x /= magnitude;
    this.y /= magnitude;
    return this;
  }
}


class Organism {
  /**
   * Constructor for Organism.
   * @param x {number} x-coordinate that the Organism will be drawn at on the canvas.
   * @param y {number} y-coordinate that the Organism will be drawn at on the canvas.
   * @param radius {number} radius of organism (circle) on canvas.
   * @param fillStyle {string} color of organism (circle) on canvas in rgb or hex.
   */
  constructor(x, y, radius, fillStyle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.fillStyle = fillStyle;
  }

  /**
   * Draw organism as a colour filled circle on the canvas at the organisms x,y coordinates.
   */
  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    context.fillStyle = this.fillStyle;
    context.fill();
  }

  /**
   * Return the euclidean distance between this Organism and another organism
   * @param other {Organism}
   * @returns {number}
   */
  dist(other) {
    return Math.sqrt(Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2));
  }

}


class Predator extends Organism {
  /**
   * Constructor for Predator.
   * @param x {number} x-coordinate on canvas that the Predator will be drawn at.
   * @param y {number} y-coordinate on canvas that the Predator will be drawn at.
   * @param radius {number} radius of the Predator
   * @param energy {number} the amount of random directions / accelerations that the Predator can have.
   * @param senseDistance {number} the distance from itself that it can detect objects in the environment
   * @param speed {number} the speed that the predator can move in environment
   * @param fillStyle {string} color of Predator
   */
  constructor(x, y, radius, energy, senseDistance, speed, fillStyle='#000000') {
    super(x, y, radius, fillStyle); // '#3498EB'

    this.velocity = new Vector(0, 0);
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
  move(direction) {
    this.acceleration = direction;
    this.velocity
        .add(direction)
        .normalize() // make velocity vector a unit vector to preserve direction given by acceleration
        .multiply(this.speed); // direction of velocity is different but speed is constant

    this.x += this.velocity.x;
    if (this.x < this.radius) {
      this.x = this.radius;
    } else if (this.x > canvasWidth - this.radius) {
      this.x = canvasWidth - this.radius;
    }

    this.y += this.velocity.y;
    if (this.y < this.radius) {
      this.y = this.radius;
    } else if (this.y > canvasHeight - this.radius) {
      this.y = canvasHeight - this.radius;
    }
  }

  update(prey) {
    if (!this.isDead) {
      if (this.energy > 1) {
        if (this.dist(prey) <= this.radius) { // if on prey, move prey outside of canvas
          prey.x = -canvasWidth;
          prey.y = -canvasHeight;
          prey.isDead = true;
          this.preyEaten++;
        }

        if (this.dist(prey) <= this.senseDistance && this.preyEaten < 2) { // move to prey even if we sense an edge (prey are always on canvas)
          this.move(new Vector(prey.x - this.x, prey.y - this.y));
        } else if (this.distToEdge(this.radius, null) <= this.senseDistance) { // left edge
          if (0 < this.preyEaten) {
            if (this.distToEdge(this.radius, null) <= this.radius) {
              this.isSurvivor = true;
            } else {
              this.move(new Vector(-1 ,0));
            }
          } else {
            this.move(new Vector(Math.random(), (Math.random() * 2) - 1));
          }
        } else if (this.distToEdge(canvasWidth, null) <= this.senseDistance) { // right edge
          if (0 < this.preyEaten) {
            if (this.distToEdge(canvasWidth, null) <= this.radius) {
              this.isSurvivor = true;
            } else {
              this.move(new Vector(1 ,0));
            }
          } else {
            this.move(new Vector(-Math.random(), (Math.random() * 2) - 1));
          }
        } else if (this.distToEdge(null, this.radius) <= this.senseDistance) { // top edge
          if (0 < this.preyEaten) {
            if (this.distToEdge(null, this.radius) <= this.radius) {
              this.isSurvivor = true;
            } else {
              this.move(new Vector(0 ,-1));
            }
          } else {
            this.move(new Vector((Math.random() * 2) - 1, Math.random()));
          }
        } else if (this.distToEdge(null, canvasHeight) <= this.senseDistance) { // bottom edge
          if (0 < this.preyEaten) {
            if (this.distToEdge(null, canvasHeight) <= this.radius) {
              this.isSurvivor = true;
            } else {
              this.move(new Vector(0,1));
            }
          } else {
            this.move(new Vector((Math.random() * 2) - 1, -Math.random()));
          }
        } else {
          this.move(Vector.fromAngle(Math.random() * 2 * Math.PI));
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
    context.arc(this.x, this.y, this.senseDistance, 0, 2 * Math.PI, false);
    context.stroke();
  }

  drawDirection() {
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(this.x + ((this.radius / 2) * this.velocity.x), this.y + ((this.radius / 2) * this.velocity.y));
    context.stroke();
  }

  clone() {
    return new Predator(this.x, this.y, this.radius, this.maxEnergy, this.senseDistance, this.speed, this.fillStyle);
  }

  /**
   * Mutates the organism by changing its sensory distance or speed, the chance of a mutation is given by mutationRate.
   * @param mutationRate {number} percentage chance that a mutation will occur
   */
  mutate(mutationRate) {
    let r = Math.random();
    if (r < mutationRate) {
      let rgb = hexToRgb(this.fillStyle);
      r = Math.random();
      if (r < 0.5) { // mutate the sensory distance
        this.senseDistance = this.senseDistance * 1.25;
        if (rgb.b <= 223) rgb.b += 32;
      } else { // mutate the speed
        this.speed = this.speed * 1.25;
        if (rgb.r <= 223) rgb.r += 32;
      }
      this.fillStyle = rgbToHex(rgb.r, rgb.g, rgb.b);
    }
  }

  /**
   * updates the energy values based on the properties of the organism.
   */
  updateEnergy() {
    let senseCost = 0.25*this.radius + 0.25;
    let speedCost = 0.05*(this.speed - 3)*(this.speed - 3) + 1;
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
    return Math.abs(a*this.x + b*this.y + c) / Math.sqrt((a * a) + (b * b));
  }
}


class Prey extends Organism {
  /**
   * Constructor for Prey.
   * @param x {number} x-coordinate on canvas that Prey will be drawn at
   * @param y {number} y-coordinate on canvas that Prey will be drawn at
   * @param radius {number} radius of the Prey
   */
  constructor(x, y, radius) {
    super(x, y, radius, '#23BA4C');
  }
}


class Population {
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


class PredatorPopulation extends Population {
  constructor(size) {
    super(size);
    let radius = 5;
    let randomX = Math.floor(Math.random() * (canvasWidth - radius) + radius);
    let randomY = Math.floor(Math.random() * (canvasHeight - radius) + radius);
    let energy = 1000;
    let senseDistance = radius*4;
    let speed = 3;
    for (let i = 0; i < size; i++) {
      if (Math.random() < 0.5) {
        if (Math.random() < 0.5) {
          this.organisms.push(new Predator(randomX, radius, radius, energy, senseDistance, speed));
        } else {
          this.organisms.push(new Predator(randomX, canvasHeight - radius, radius, energy, senseDistance, speed));
        }
      } else {
        if (Math.random() < 0.5) {
          this.organisms.push(new Predator(radius, randomY, radius,energy, senseDistance, speed));
        } else {
          this.organisms.push(new Predator(canvasWidth - radius, randomY, radius, energy, senseDistance, speed));
        }
      }
    }
    this.generation = 1;
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
    $('#day').text(this.generation.toString()); // show the updated generation
    $('#population-size').text(this.size.toString()); // show updated population size
  }
}


class PreyPopulation extends Population {
  constructor(size) {
    super(size);
    let radius = 5;
    for (let i = 0; i < size; i++)
      this.organisms.push(new Prey(Math.floor(Math.random() * (canvasWidth - radius) + radius),  Math.floor(Math.random() * (canvasHeight - radius) + radius), radius));
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


class EcoSystem {
  constructor(predatorPopulation, preyPopulation) {
    this.predatorPopulation = predatorPopulation;
    this.preyPopulation = preyPopulation;
    $('#day').text(this.predatorPopulation.generation.toString()); // show the initial generation
    $('#population-size').text(this.predatorPopulation.size.toString()); // show initial population size
  }

  update() {
    context.clearRect(0, 0, canvasWidth, canvasHeight); // clears the canvas
    this.predatorPopulation.update(this.preyPopulation);  // updates and draws predators
    this.preyPopulation.update(); // draws prey
    if (this.predatorPopulation.allDead || this.preyPopulation.allDead) {
      this.predatorPopulation.naturalSelection();
      this.preyPopulation = new PreyPopulation(this.preyPopulation.size);
    }
    window.requestAnimationFrame(() => this.update())
  }
}


const predatorPopulationSize = 5; // number of Predators in population
const preyPopulationSize = 30; // number of Prey in population

let predatorPopulation = new PredatorPopulation(predatorPopulationSize);
let preyPopulation = new PreyPopulation(preyPopulationSize);
let ecoSystem = new EcoSystem(predatorPopulation, preyPopulation);

setTimeout(function(){
  window.requestAnimationFrame(() => ecoSystem.update());
}, 1000);

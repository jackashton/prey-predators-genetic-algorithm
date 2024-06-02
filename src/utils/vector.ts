export class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds another vector to this vector and returns a new resulting vector
   */
  add(other: Vector2D) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtracts another vector from this vector and returns a new resulting vector
   */
  subtract(other: Vector2D) {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * Multiply this vector by a scalar and return new result vector
   */
  multiply(scalar: number) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  /**
   * Divide this vector by a scalar and return new result vector
   */
  divide(scalar: number) {
    if (scalar === 0) {
      throw new Error('Division by zero');
    }
    return new Vector2D(this.x / scalar, this.y / scalar);
  }

  /**
   * Calculate the dot product of this vector and another vector
   */
  dot(other: Vector2D) {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Calculate the magnitude (length) of this vector
   */
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Normalize this vector (make it have a magnitude of 1)
   */
  normalize(): Vector2D {
    const mag = this.magnitude();
    if (mag === 0) {
      throw new Error('Cannot normalize a zero vector');
    }
    return this.divide(mag);
  }

  /**
   * Calculate the distance between this vector and another vector
   */
  distance(other: Vector2D): number {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }

  /**
   * Returns new Vector created from the angle theta.
   * @param theta - angle in radians
   */
  static fromAngle(theta: number) {
    return new Vector2D(Math.cos(theta), Math.sin(theta));
  }

  /**
   * Check if this vector is equal to another vector
   */
  equals(other: Vector2D) {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Create a copy of this vector
   */
  clone() {
    return new Vector2D(this.x, this.y);
  }

  /**
   * Convert this vector to a string representation
   */
  toString() {
    return `(${this.x}, ${this.y})`;
  }

  /**
   * Create a vector from an array
   */
  static fromArray([x, y]: [number, number]) {
    return new Vector2D(x, y);
  }

  /**
   * Convert this vector to an array
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }
}

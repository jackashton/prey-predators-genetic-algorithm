import { describe, it, expect } from 'vitest';
import { Vector2D } from './vector';

describe('Vector2D', () => {
  it('should create a vector with default values', () => {
    const vector = new Vector2D();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
  });

  it('should create a vector with specified values', () => {
    const vector = new Vector2D(3, 4);
    expect(vector.x).toBe(3);
    expect(vector.y).toBe(4);
  });

  it('should add two vectors', () => {
    const v1 = new Vector2D(1, 2);
    const v2 = new Vector2D(3, 4);
    const result = v1.add(v2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('should subtract two vectors', () => {
    const v1 = new Vector2D(5, 6);
    const v2 = new Vector2D(3, 4);
    const result = v1.subtract(v2);
    expect(result.x).toBe(2);
    expect(result.y).toBe(2);
  });

  it('should multiply a vector by a scalar', () => {
    const vector = new Vector2D(2, 3);
    const result = vector.multiply(2);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it('should divide a vector by a scalar', () => {
    const vector = new Vector2D(4, 6);
    const result = vector.divide(2);
    expect(result.x).toBe(2);
    expect(result.y).toBe(3);
  });

  it('should throw an error when dividing by zero', () => {
    const vector = new Vector2D(4, 6);
    expect(() => vector.divide(0)).toThrow('Division by zero');
  });

  it('should calculate the dot product of two vectors', () => {
    const v1 = new Vector2D(1, 2);
    const v2 = new Vector2D(3, 4);
    const result = v1.dot(v2);
    expect(result).toBe(11);
  });

  it('should calculate the magnitude of a vector', () => {
    const vector = new Vector2D(3, 4);
    const result = vector.magnitude();
    expect(result).toBe(5);
  });

  it('should normalize a vector', () => {
    const vector = new Vector2D(3, 4);
    const result = vector.normalize();
    const magnitude = result.magnitude();
    expect(magnitude).toBeCloseTo(1, 5);
    expect(result.x).toBeCloseTo(0.6, 5);
    expect(result.y).toBeCloseTo(0.8, 5);
  });

  it('should throw an error when normalizing a zero vector', () => {
    const vector = new Vector2D(0, 0);
    expect(() => vector.normalize()).toThrow('Cannot normalize a zero vector');
  });

  it('should calculate the distance between two vectors', () => {
    const v1 = new Vector2D(1, 2);
    const v2 = new Vector2D(4, 6);
    const result = v1.distance(v2);
    expect(result).toBe(5);
  });

  it('should create a vector from an angle', () => {
    const theta = Math.PI / 4; // 45 degrees
    const result = Vector2D.fromAngle(theta);
    expect(result.x).toBeCloseTo(Math.sqrt(2) / 2, 5);
    expect(result.y).toBeCloseTo(Math.sqrt(2) / 2, 5);
  });

  it('should check if two vectors are equal', () => {
    const v1 = new Vector2D(3, 4);
    const v2 = new Vector2D(3, 4);
    const v3 = new Vector2D(4, 5);
    expect(v1.equals(v2)).toBe(true);
    expect(v1.equals(v3)).toBe(false);
  });

  it('should clone a vector', () => {
    const vector = new Vector2D(3, 4);
    const clone = vector.clone();
    expect(clone.equals(vector)).toBe(true);
  });

  it('should convert a vector to a string', () => {
    const vector = new Vector2D(3, 4);
    expect(vector.toString()).toBe('(3, 4)');
  });

  it('should create a vector from an array', () => {
    const arr: [number, number] = [3, 4];
    const result = Vector2D.fromArray(arr);
    expect(result.x).toBe(3);
    expect(result.y).toBe(4);
  });

  it('should convert a vector to an array', () => {
    const vector = new Vector2D(3, 4);
    const result = vector.toArray();
    expect(result).toEqual([3, 4]);
  });
});

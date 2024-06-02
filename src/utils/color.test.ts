import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex } from './color';

describe('hexToRgb', () => {
  it('should convert hex #FFFFFF to rgb (255, 255, 255)', () => {
    const result = hexToRgb('#FFFFFF');
    expect(result).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('should convert hex #000000 to rgb (0, 0, 0)', () => {
    const result = hexToRgb('#000000');
    expect(result).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('should convert hex #FF5733 to rgb (255, 87, 51)', () => {
    const result = hexToRgb('#FF5733');
    expect(result).toEqual({ r: 255, g: 87, b: 51 });
  });

  it('should return null for invalid hex color', () => {
    const result = hexToRgb('#ZZZZZZ');
    expect(result).toBeNull();
  });

  it('should return null for hex color without hash', () => {
    const result = hexToRgb('FFFFFF');
    expect(result).toEqual({ r: 255, g: 255, b: 255 });
  });
});

describe('rgbToHex', () => {
  it('should convert rgb (255, 255, 255) to hex #FFFFFF', () => {
    const result = rgbToHex(255, 255, 255);
    expect(result).toBe('#FFFFFF');
  });

  it('should convert rgb (0, 0, 0) to hex #000000', () => {
    const result = rgbToHex(0, 0, 0);
    expect(result).toBe('#000000');
  });

  it('should convert rgb (255, 87, 51) to hex #FF5733', () => {
    const result = rgbToHex(255, 87, 51);
    expect(result).toBe('#FF5733');
  });

  it('should handle single digit rgb values', () => {
    const result = rgbToHex(1, 2, 3);
    expect(result).toBe('#010203');
  });

  it('should convert rgb (173, 216, 230) to hex #ADD8E6', () => {
    const result = rgbToHex(173, 216, 230);
    expect(result).toBe('#ADD8E6');
  });
});

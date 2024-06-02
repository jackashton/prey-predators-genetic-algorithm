/**
 * Converts a hexadecimal number to an rgb value where each color is in the range [0, 255]
 * @param hex - color in hexidecimal format i.e. #FF01A2
 */
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Converts a rgb color as numbers in the range [0, 255] to a hexadecimal string
 * @param r - red channel
 * @param g - green channel
 * @param b - blue channel
 */
export const rgbToHex = (r: number, g: number, b: number) =>
  '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

export function toBoolean(input: unknown) {
  if (typeof input === "boolean") return input;

  if (typeof input === "string") {
    if (["true", "yes", "1", "si"].includes(input.toLowerCase())) return true;
    return false;
  }

  return !!input;
}

type RGB = {
  r?: number | string;
  red?: number | string;
  g?: number | string;
  green?: number | string;
  b?: number | string;
  blue?: number | string;
};

export function toFigmaRgb(input: unknown) {
  if (typeof input === "boolean") {
    return {
      r: input ? 0 : 1,
      g: input ? 0 : 1,
      b: input ? 0 : 1,
    };
  }

  if (typeof input === "string") {
    if (input.startsWith("#")) {
      const hex = input.slice(1);
      return rgbToFigmaRgb(hextToRgb(hex));
    } else if (input.length === 3 || input.length === 6) {
      return rgbToFigmaRgb(hextToRgb(input));
    }

    try {
      return rgbToFigmaRgb(JSON.parse(input) as RGB);
    } catch (error) {
      return { r: 0, g: 0, b: 0 };
    }
  }

  return { r: 0, g: 0, b: 0 };
}

function rgbToFigmaRgb(rgb?: RGB) {
  if (!rgb) return { r: 0, g: 0, b: 0 };

  const [red, green, blue] = [
    rgb.r ?? rgb.red,
    rgb.g ?? rgb.green,
    rgb.b ?? rgb.blue,
  ];

  return {
    r: red ? bitToFigmaRgb(Number(red)) : 0,
    g: green ? bitToFigmaRgb(Number(green)) : 0,
    b: blue ? bitToFigmaRgb(Number(blue)) : 0,
  };
}

function bitToFigmaRgb(bit: number) {
  if (bit > 1) return mapBitValueToFigmaRgb(bit);

  return bit;
}

function mapBitValueToFigmaRgb(
  num: number,
  inMin = 0,
  inMax = 255,
  outMin = 0,
  outMax = 1,
) {
  return ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function hextToRgb(hex: string) {
  const rgb = { r: 0, g: 0, b: 0 };

  if (hex.length === 3) {
    const [r, g, b] = hex;
    if (r) rgb.r = stringToHex(r + r);
    if (g) rgb.g = stringToHex(g + g);
    if (b) rgb.b = stringToHex(b + b);
  } else if (hex.length === 6) {
    rgb.r = stringToHex(hex.slice(0, 2));
    rgb.g = stringToHex(hex.slice(2, 4));
    rgb.b = stringToHex(hex.slice(4, 6));
  }

  return rgb;
}

function stringToHex(input: string) {
  return parseInt(input, 16);
}

function unknownToBooleanOrNull(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    return ["true", "yes", "1", 1, "si", "on"].includes(value.toLowerCase());
  }

  return null;
}

function unknownToFloatOrNull(value: unknown): number | null {
  const valueAsString = unknownToStringOrNull(value);
  const formattedString = String(value).replace(',', ".");
  const float = parseFloat(formattedString);

  if (valueAsString === null && isNaN(float)) return null
  if (isNaN(float)) {
    const booleanValue = unknownToBooleanOrNull(formattedString);
    if (booleanValue !== null) {
      return Number(booleanValue);
    }
    return null;
  }

  const number = parseInt(formattedString);
  if (isNaN(number)) return null;

  return float > number ? Number(float.toFixed(2)) : number;
}

function unknownToStringOrNull(value: unknown): string | null {
  if (typeof value === "string") return value;

  return null;
}
function unknownToRgbaOrNull(value: unknown): RGB | RGBA | null {
  const floatValue = unknownToFloatOrNull(value);
  if (typeof value === "string" && (floatValue === null || floatValue === 0)) {
    const rgbaOrNull = hexToRgba(value);
    if (rgbaOrNull) {
      return rgbaToFigmaRgba(rgbaOrNull);
    }

    try {
      const rgba = rgbaToFigmaRgba(JSON.parse(value) as RGBA);
      if (rgba) return rgba;
    } catch (_) {
      // we tried buy all hope is lost for this one...
    }
  }

  // Lets try to see if we can do some magic with numbers
  const booleanValue = unknownToBooleanOrNull(value);
  if (booleanValue !== null && floatValue === null) {
    return {
      r: Number(booleanValue),
      g: Number(booleanValue),
      b: Number(booleanValue),
    };
  }

  if (floatValue !== null) {
    return {
      r: numberToFigmaRgbFloat(floatValue),
      g: numberToFigmaRgbFloat(floatValue),
      b: numberToFigmaRgbFloat(floatValue),
    };
  }

  const isAlreadyFigmaRgba = isFigmaRgba(value);

  if (isAlreadyFigmaRgba) {
    return isAlreadyFigmaRgba
  }

  return null;
}

function isFigmaRgba(value: unknown) {
  const check = value as RGB | RGBA;

  if (check.r === undefined || check.r === null) return null
  if (check.r > 1) return null
  if (check.g === undefined || check.b === null) return null
  if (check.g > 1) return null
  if (check.b === undefined || check.b === null) return null
  if (check.b > 1) return null

  if ('a' in check && check.a > 1) return null

  if ('a' in check) {
    return {
      r: Number(check.r.toFixed(2)),
      g: Number(check.g.toFixed(2)),
      b: Number(check.b.toFixed(2)),
      a: Number(check.a.toFixed(2))
    }
  }

  return {
    r: Number(check.r.toFixed(2)),
    g: Number(check.g.toFixed(2)),
    b: Number(check.b.toFixed(2)),
    a: 1
  }
}

function hexToRgba(input: string): RGB | RGBA | null {
  const hex = input.replace("#", "").trim();
  const length = hex.replace("#", "").length;
  switch (length) {
    case 8: {
      // #RRGGBBAA
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: Number(hex.slice(6, 8)) + 0.00000001,
      };
    }
    case 6: {
      // #RRGGBB
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 100,
      };
    }
    case 3: {
      // #RGB
      const [r, g, b] = hex;
      if (r === undefined || g === undefined || b === undefined) return null;
      return {
        r: parseInt(r + r, 16),
        g: parseInt(g + g, 16),
        b: parseInt(b + b, 16),
        a: 100,
      };
    }
    case 2: {
      // #AA
      return {
        r: parseInt(hex, 16),
        g: parseInt(hex, 16),
        b: parseInt(hex, 16),
        a: 100,
      }
    }
  }

  return null;
}

type MyRGBA = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

function rgbaToFigmaRgba(
  rgba?: Partial<RGBA> & Partial<MyRGBA>,
): RGB | RGBA | null {
  if (!rgba) return null;

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const red = rgba.red || rgba.r;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const green = rgba.green || rgba.g;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const blue = rgba.blue || rgba.b;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const alpha = rgba.alpha || rgba.a;

  if (red === undefined || green === undefined || blue === undefined) {
    return null;
  }

  return {
    r: numberToFigmaRgbFloat(red),
    g: numberToFigmaRgbFloat(green),
    b: numberToFigmaRgbFloat(blue),
    a: alpha !== undefined ? numberToFigmaRgbFloat(alpha, true) : 1
  };
}

function numberToFigmaRgbFloat(float: number, isAlpha = false) {
  if (float === 1 || float === 0) return float;

  const decimal = float % 1; // We can receive 'real' rgb values or figma rgb values
  if (decimal > 0) return decimal;

  if (!isAlpha) return mapValue(float, 0, 255, 0, 1);

  return mapValue(float, 0, 100, 0, 1);
}

function mapValue(
  input: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  return ((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function mapValueToFigmaValue(
  type: VariableResolvedDataType,
  value: unknown,
): VariableValue | null {
  switch (type) {
    case "BOOLEAN":
      return unknownToBooleanOrNull(value);
    case "COLOR":
      return unknownToRgbaOrNull(value);
    case "FLOAT":
      return unknownToFloatOrNull(value);
    case "STRING":
      return unknownToStringOrNull(value);
  }
}

import { FIGMA_PLUGIN_NAME } from "../constants";
import { CreateVariable, DeleteVariable, GetLocalVariables, type MESSAGE_TYPE } from "../types";

export async function deleteVariable(id: string) {
  const variable = await figma.variables.getVariableByIdAsync(id);

  if (variable) {
    variable.remove();
  }

  figma.ui.postMessage(DeleteVariable(id));
}

export async function createVariable(
  name: string,
  resolvedType: VariableResolvedDataType,
) {
  const collection = await getCollection();

  figma.variables.createVariable(name, collection, resolvedType);
  figma.ui.postMessage(CreateVariable({ name, resolvedType }));
}

export async function getLocalVariables(type: MESSAGE_TYPE.GET_LOCAL_VARIABLES | MESSAGE_TYPE.MQTT_GET_LOCAL_VARIABLES) {
  const collection = await getCollection();

  const promises = collection.variableIds.map((id) =>
    figma.variables.getVariableByIdAsync(id),
  );
  const variables = (await Promise.all(promises)).filter(Boolean);
  const variablesToSend = variables.map((variable) => {
    return {
      id: variable.id,
      name: variable.name,
      description: variable.description,
      resolvedType: variable.resolvedType,
      valuesByMode: variable.valuesByMode,
    };
  });
  figma.ui.postMessage(GetLocalVariables(variablesToSend, type));
}

export async function setLocalvariable(id: string, value: unknown) {
  const variable = await figma.variables.getVariableByIdAsync(id);
  const collection = await getCollection();

  if (!variable) return;

  const newValue = valueToFigmaValue(variable.resolvedType, value);

  if (newValue === null) {
    figma.notify(
      `Received invalid value (${value as string}) for variable (${variable.name})`,
      { error: true },
    );
    return;
  }

  variable.setValueForMode(collection.defaultModeId, newValue);
}

function unknownToBooleanOrNull(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    return ["true", "yes", "1", "si", "on"].includes(value.toLowerCase());
  }

  return null;
}

function unknownToFloatOrNull(value: unknown): number | null {
  const valueAsString = unknownToStringOrNull(value);

  if (valueAsString === null) return null
  const formattedString = valueAsString.replace(',', ".");
  const float = parseFloat(formattedString);
  if (isNaN(float)) {
    const booleanValue = unknownToBooleanOrNull(formattedString);
    if (booleanValue !== null) {
      return Number(booleanValue);
    }
    return null;
  }

  const number = parseInt(formattedString);
  if (isNaN(number)) return null;

  return float > number ? float : number;
}

function unknownToStringOrNull(value: unknown): string | null {
  if (typeof value === "string") return value;

  return null;
}

function unknownToRgbaOrNull(value: unknown): RGB | RGBA | null {
  const floatValue = unknownToFloatOrNull(value);
  if (typeof value === "string" && floatValue === null) {
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

  return null;
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
        a: Number(hex.slice(6, 8)),
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
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    a: mapRgbValueToFigmaRgbValue(alpha || 100, 0, 100, 0, 1),
  };
}

function numberToFigmaRgbFloat(float: number) {
  const decimal = float % 1; // We can receive 'real' rgb values or figma rgb values
  if (decimal > 0) return decimal;

  return mapRgbValueToFigmaRgbValue(float);
}

function mapRgbValueToFigmaRgbValue(
  input: number,
  inMin = 0,
  inMax = 255,
  outMin = 0,
  outMax = 1,
) {
  return ((input - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function valueToFigmaValue(
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

async function getCollection() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const collection = collections.find(
    ({ name }) => name === FIGMA_PLUGIN_NAME,
  );
  if (!collection) {
    return figma.variables.createVariableCollection(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      FIGMA_PLUGIN_NAME,
    );
  }
  return collection;
}

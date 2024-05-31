export * from "./Message";

export const VARIABLE_RESOLVED_DATA_TYPES = [
  "STRING",
  "FLOAT",
  "BOOLEAN",
  "COLOR",
] as const satisfies VariableResolvedDataType[];

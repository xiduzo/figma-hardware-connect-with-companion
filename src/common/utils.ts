export function figmaVariableTypeToString(type: VariableResolvedDataType) {
  switch (type) {
    case "FLOAT":
      return "number";
    case "BOOLEAN":
    case "STRING":
    case "COLOR":
    default:
      return type.toLowerCase();
  }
}

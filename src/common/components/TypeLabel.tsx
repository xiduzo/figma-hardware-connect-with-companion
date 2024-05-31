import React from "react";
import { Text } from "./Text";

export function TypeLabel({ resolvedType }: Pick<Variable, "resolvedType">) {
  switch (resolvedType) {
    case "FLOAT":
      return <Text>number</Text>;
    case "COLOR":
    case "BOOLEAN":
    case "STRING":
    default:
      return <Text>{resolvedType.toLowerCase()}</Text>;
  }
}

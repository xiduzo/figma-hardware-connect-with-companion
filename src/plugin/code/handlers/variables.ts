import { GetLocalVariables } from "../types";

export async function getLocalVariables() {
  const variables = await figma.variables.getLocalVariablesAsync();
  const variablesToSend = variables.map((variable) => {
    return {
      id: variable.id,
      name: variable.name,
      description: variable.description,
      resolvedType: variable.resolvedType,
    };
  });
  figma.ui.postMessage(GetLocalVariables(variablesToSend));
}

export async function setLocalvariable(id: string, value: VariableValue) {
  const variable = await figma.variables.getVariableByIdAsync(id);
  const [collection] = await figma.variables.getLocalVariableCollectionsAsync();

  if (variable) {
    variable.setValueForMode(collection.defaultModeId, value);
  }
}

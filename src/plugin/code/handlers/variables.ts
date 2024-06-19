import { mapValueToFigmaValue } from '../../../common/utils/mapValueToFigmaValue';
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

  const newValue = mapValueToFigmaValue(variable.resolvedType, value);

  if (newValue === null) {
    figma.notify(
      `Received invalid value (${value as string}) for variable (${variable.name})`,
      { error: true },
    );
    return;
  }

  variable.setValueForMode(collection.defaultModeId, newValue);
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

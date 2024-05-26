export enum MESSAGE_TYPE {
  GET_LOCAL_STATE_VALUE = "GET_LOCAL_STATE_VALUE",
  SET_LOCAL_STATE_VALUE = "SET_LOCAL_STATE_VALUE",
  SET_UI_OPTIONS = "SET_UI_OPTIONS",
  GET_LOCAL_VARIABLES = "GET_LOCAL_VARIABLES",
  SET_LOCAL_VARIABLE = "SET_LOCAL_VARIABLE",
}

export enum LOCAL_STORAGE_KEYS {
  MQTT_LINKS = "MQTT_LINKS",
  MQTT_CONNECTION = "MQTT_CONNECTION",
  AUTH_TOKENS = "AUTH_TOKENS",
}

type SetUiOptionsMessage = {
  type: MESSAGE_TYPE.SET_UI_OPTIONS;
  payload: Partial<ShowUIOptions>;
};
export function SetUiOptions(payload: {
  width?: number;
  height?: number;
}): SetUiOptionsMessage {
  return {
    type: MESSAGE_TYPE.SET_UI_OPTIONS,
    payload: payload,
  };
}

type GetSetLocalStateValueMessage<T> = {
  type: MESSAGE_TYPE.SET_LOCAL_STATE_VALUE | MESSAGE_TYPE.GET_LOCAL_STATE_VALUE;
  payload: {
    key: LOCAL_STORAGE_KEYS;
    value?: T;
  };
};

function GetSetLocalStateValue<T>(
  type: MESSAGE_TYPE.SET_LOCAL_STATE_VALUE | MESSAGE_TYPE.GET_LOCAL_STATE_VALUE,
  key: LOCAL_STORAGE_KEYS,
  value?: T,
): GetSetLocalStateValueMessage<T> {
  return {
    type,
    payload: { key, value },
  };
}
export function SetLocalStateValue<T>(key: LOCAL_STORAGE_KEYS, value: T) {
  return GetSetLocalStateValue(MESSAGE_TYPE.SET_LOCAL_STATE_VALUE, key, value);
}
export function GetLocalStateValue<T>(key: LOCAL_STORAGE_KEYS, value: T) {
  return GetSetLocalStateValue(MESSAGE_TYPE.GET_LOCAL_STATE_VALUE, key, value);
}

type PickedVariable = Pick<Variable, "id" | "name" | "resolvedType">;
type GetLocalVariablesMessage = {
  type: MESSAGE_TYPE.GET_LOCAL_VARIABLES;
  payload?: PickedVariable[] | undefined;
};
export function GetLocalVariables(
  payload?: PickedVariable[] | undefined,
): GetLocalVariablesMessage {
  return {
    type: MESSAGE_TYPE.GET_LOCAL_VARIABLES,
    payload,
  };
}

type SetLocalVariableMessage<T> = {
  type: MESSAGE_TYPE.SET_LOCAL_VARIABLE;
  payload: {
    id: string;
    value: T;
  };
};
export function SetLocalValiable<T extends VariableValue>(
  id: string,
  value: T,
): SetLocalVariableMessage<T> {
  return {
    type: MESSAGE_TYPE.SET_LOCAL_VARIABLE,
    payload: { id, value },
  };
}

export type Message<T> =
  | GetSetLocalStateValueMessage<T>
  | SetUiOptionsMessage
  | GetLocalVariablesMessage
  | SetLocalVariableMessage<T>;

export type PluginMessage<T> = {
  pluginMessage: { type: MESSAGE_TYPE; payload?: T };
};

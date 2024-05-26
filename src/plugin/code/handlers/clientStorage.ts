import {
  GetLocalStateValue,
  SetLocalStateValue,
  type LOCAL_STORAGE_KEYS,
} from "../types.js";

export async function setLocalValue<T>(key: LOCAL_STORAGE_KEYS, value: T) {
  await figma.clientStorage.setAsync(key, value);
  figma.ui.postMessage(SetLocalStateValue(key, value));
}

export async function getLocalValue<T>(key: LOCAL_STORAGE_KEYS, value: T) {
  const localState = (await figma.clientStorage.getAsync(key)) as T;
  if (localState === undefined || localState === null) {
    await figma.clientStorage.setAsync(key, value);
    figma.ui.postMessage(GetLocalStateValue(key, value));
    return;
  }
  figma.ui.postMessage(GetLocalStateValue(key, localState));
}

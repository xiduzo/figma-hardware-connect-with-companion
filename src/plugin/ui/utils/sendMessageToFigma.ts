import { type Message } from "../types";

export function sendMessageToFigma<T>(
  message: Message<T>,
  targetOrigin = "*",
  transfer?: Transferable[],
) {
  parent.postMessage({ pluginMessage: message }, targetOrigin, transfer);
}

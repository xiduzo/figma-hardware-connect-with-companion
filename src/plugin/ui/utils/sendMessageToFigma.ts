export function sendMessageToFigma(
  message: unknown,
  targetOrigin = "*",
  transfer?: Transferable[],
) {
  parent.postMessage({ pluginMessage: message }, targetOrigin, transfer);
}

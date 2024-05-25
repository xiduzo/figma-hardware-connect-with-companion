import { useEffect } from "react";
import { type MESSAGE_TYPE, type PluginMessage } from "../types";
import { sendMessageToFigma } from "../utils/sendMessageToFigma";

export function useMessageListener<T>(
  type: MESSAGE_TYPE,
  callback: (payload: T | undefined) => void,
) {
  useEffect(() => {
    const handler = (event: MessageEvent<PluginMessage<T>>) => {
      if (event.data.pluginMessage.type !== type) return;

      callback(event.data.pluginMessage.payload);
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [type, callback]);

  function sendMessage(payload: T) {
    sendMessageToFigma({
      type,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      payload: payload as any,
    });
  }

  return sendMessage;
}

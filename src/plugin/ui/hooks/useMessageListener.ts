import { useCallback, useEffect } from "react";
import { useInterval } from "usehooks-ts";
import { type MESSAGE_TYPE, type PluginMessage } from "../types";
import { sendMessageToFigma } from "../utils/sendMessageToFigma";

export function useMessageListener<T>(
  type: MESSAGE_TYPE,
  callback: (payload: T | undefined) => void | Promise<void>,
  options?: { intervalInMs?: number; shouldSendInitialMessage?: boolean },
) {
  const sendMessage = useCallback(
    (payload: T) => {
      sendMessageToFigma({
        type,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        payload: payload as any,
      });
    },
    [type],
  );

  useInterval(() => {
    sendMessage(undefined as T);
  }, options?.intervalInMs ?? null);

  useEffect(() => {
    if (!options?.shouldSendInitialMessage) return;

    sendMessage(undefined as T);
  }, [options?.shouldSendInitialMessage, sendMessage]);

  useEffect(() => {
    const handler = (event: MessageEvent<PluginMessage<T>>) => {
      if (event.data.pluginMessage.type !== type) return;

      void callback(event.data.pluginMessage.payload);
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener("message", handler);
    };
  }, [type, callback]);

  return sendMessage;
}

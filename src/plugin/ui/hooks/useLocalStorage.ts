import { useCallback, useEffect, useState } from "react";
import {
  GetLocalStateValue,
  MESSAGE_TYPE,
  SetLocalStateValue,
  type LOCAL_STORAGE_KEYS,
} from "../types";
import { sendMessageToFigma } from "../utils/sendMessageToFigma";
import { useMessageListener } from "./useMessageListener";

type Update<T> = T | ((prev?: T) => T | undefined);

export function useLocalStorage<T>(
  key: LOCAL_STORAGE_KEYS,
  options?: { initialValue?: T; updateInterval?: number },
) {
  const [state, setState] = useState(options?.initialValue);

  const setLocalState = useCallback(
    (update?: Update<T>) => {
      sendMessageToFigma(
        SetLocalStateValue(
          key,
          update instanceof Function ? update(state) : update,
        ),
      );
    },
    [key, state],
  );

  useEffect(() => {
    sendMessageToFigma(GetLocalStateValue(key, options?.initialValue));
  }, [key, options?.initialValue]);

  useMessageListener<{ key: LOCAL_STORAGE_KEYS; value?: T }>(
    MESSAGE_TYPE.GET_LOCAL_STATE_VALUE,
    (payload) => {
      if (payload?.key !== key) return;

      setState(payload.value);
    },
    { intervalInMs: options?.updateInterval },
  );

  useMessageListener<{ key: LOCAL_STORAGE_KEYS; value?: T }>(
    MESSAGE_TYPE.SET_LOCAL_STATE_VALUE,
    (payload) => {
      if (payload?.key !== key) return;

      setState(payload?.value);
    },
  );

  return [state, setLocalState] as const;
}

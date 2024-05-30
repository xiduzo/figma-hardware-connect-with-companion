import { getLocalValue, setLocalValue } from "./handlers/clientStorage.js";
import { setUiOptions } from "./handlers/ui.js";
import { getLocalVariables, setLocalvariable } from "./handlers/variables.js";
import { MESSAGE_TYPE, type Message } from "./types.js";

figma.showUI(__html__, {
  themeColors: true,
});

figma.ui.onmessage = <T>(message: Message<T>) => {
  // console.info("received message", { message });
  const { type, payload } = message;

  switch (type) {
    case MESSAGE_TYPE.SHOW_TOAST: {
      figma.notify(payload.message, payload.options);
      break;
    }
    case MESSAGE_TYPE.SET_LOCAL_STATE_VALUE: {
      void setLocalValue(payload.key, payload.value);
      break;
    }
    case MESSAGE_TYPE.GET_LOCAL_STATE_VALUE: {
      void getLocalValue(payload.key, payload.value);
      break;
    }
    case MESSAGE_TYPE.GET_LOCAL_VARIABLES: {
      void getLocalVariables();
      break;
    }
    case MESSAGE_TYPE.SET_LOCAL_VARIABLE: {
      void setLocalvariable(payload.id, payload.value as VariableValue);
      break;
    }
    case MESSAGE_TYPE.SET_UI_OPTIONS: {
      setUiOptions(payload);
      break;
    }
    default: {
      console.info("Unknown message type", { message });
    }
  }
};

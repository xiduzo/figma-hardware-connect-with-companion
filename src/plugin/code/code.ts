import {
  MESSAGE_TYPE,
  SetLocalStateValue,
  type Message,
} from "../../common/types/Message.js";

figma.showUI(__html__, {
  width: 300,
  height: 500,
  themeColors: true,
});

figma.ui.onmessage = <T>(message: Message<T>) => {
  console.log("received message", { message });
  const { type, payload } = message;

  switch (type) {
    case MESSAGE_TYPE.SET_LOCAL_STATE_VALUE: {
      void figma.clientStorage.setAsync(payload.key, payload.value);
      figma.ui.postMessage(SetLocalStateValue(payload.key, payload.value));
      break;
    }
    case MESSAGE_TYPE.GET_LOCAL_STATE_VALUE: {
      figma.clientStorage
        .getAsync(payload.key)
        .then((localState) => {
          figma.ui.postMessage(SetLocalStateValue(payload.key, localState));
        })
        .catch(console.error);
      break;
    }
    default: {
      console.log("Unknown message type", { message });
    }
  }
};

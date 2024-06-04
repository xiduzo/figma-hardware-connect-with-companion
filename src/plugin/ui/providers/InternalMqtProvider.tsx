import { type Packet } from "mqtt";
import React, {
  createContext,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import { TOPIC_PREFIX } from "../constants";
import { useMqttClient } from "../hooks";
import { SetLocalValiable } from "../types";
import { sendMessageToFigma } from "../utils";
import { useAuth } from "./AuthProvider";

const InternalMqttContext = createContext({
  isConnected: false,
  publish: (topic: string, payload: string): Promise<Packet | undefined> => {
    throw new Error("MqttProvider not found", {
      cause: JSON.stringify({ topic, payload }),
    });
  },
});

export function InternalMqttProvider({ children }: PropsWithChildren) {
  const { connect, isConnected, subscribe, publish } = useMqttClient();
  const { user } = useAuth();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!user) return;

    return subscribe(
      `${TOPIC_PREFIX}/${user.id}/+/set`,
      (topic: string, message: Buffer) => {
        const match = topic.match(/VariableID:\d+:\d+/);
        if (!match) return;

        const [variable] = match;
        sendMessageToFigma(SetLocalValiable(variable, message.toString()));
      },
    );
  }, [user, subscribe]);
  return (
    <InternalMqttContext.Provider value={{ isConnected, publish }}>
      {children}
    </InternalMqttContext.Provider>
  );
}

export function useInternalMqtt() {
  return useContext(InternalMqttContext);
}

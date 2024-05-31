/** eslint-disable @typescript-eslint/no-unsafe-call */
import React, {
  createContext,
  useContext,
  useEffect,
  type PropsWithChildren,
} from "react";
import { useMqttClient } from "../hooks";
import { SetLocalValiable } from "../types";
import { sendMessageToFigma } from "../utils";
import { useAuth } from "./AuthProvider";

const InternalMqttContext = createContext({
  isConnected: false,
});

export function InternalMqttProvider({ children }: PropsWithChildren) {
  const { connect, isConnected, subscribe } = useMqttClient();
  const { user } = useAuth();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!isConnected) return;
    if (!user) return;

    return subscribe(`fhc/${user.id}/#`, (topic: string, message: Buffer) => {
      const topicParts = topic.split("/");
      const variable = topicParts.at(-1);
      console.log("Received message", {
        variable,
        message: message.toString(),
      });
      if (variable && variable.toLowerCase().startsWith("variableid")) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        sendMessageToFigma(SetLocalValiable(variable, message.toString()));
      }
    });
  }, [isConnected, user, subscribe]);
  return (
    <InternalMqttContext.Provider value={{ isConnected }}>
      {children}
    </InternalMqttContext.Provider>
  );
}

export function useInternalMqtt() {
  return useContext(InternalMqttContext);
}

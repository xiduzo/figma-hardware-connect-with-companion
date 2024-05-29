import React, { createContext, useEffect, type PropsWithChildren } from "react";
import { useMqttClient } from "../hooks";
import { SetLocalValiable } from "../types";
import { sendMessageToFigma } from "../utils/sendMessageToFigma";
import { useAuth } from "./AuthProvider";

const InternalMqttContext = createContext({});

export function InternalMqttProvider({ children }: PropsWithChildren) {
  const handleMqttMessage = (topic: string, message: Buffer) => {
    const topicParts = topic.split("/");
    const variable = topicParts.at(-1);
    console.log("Received message", { variable, message: message.toString() });
    if (variable && variable.toLowerCase().startsWith("variableid")) {
      sendMessageToFigma(SetLocalValiable(variable, message.toString()));
    }
  };

  const { connect, isConnected, subscribe } = useMqttClient(handleMqttMessage);
  const { user } = useAuth();

  useEffect(() => {
    connect();
  }, [connect]);

  useEffect(() => {
    if (!isConnected) return;
    if (!user) return;

    console.log("Connected to mosquitto broker", { user });
    console.log(`fhc/${user.id}/#`);
    return subscribe(`fhc/${user.id}/#`);
  }, [isConnected, user, subscribe]);
  return (
    <InternalMqttContext.Provider value={{}}>
      {children}
    </InternalMqttContext.Provider>
  );
}

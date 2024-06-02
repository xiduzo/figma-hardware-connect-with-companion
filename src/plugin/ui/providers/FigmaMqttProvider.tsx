import React, { useEffect } from "react";

import { type Packet } from "mqtt";
import { createContext, useContext, type PropsWithChildren } from "react";
import { z } from "zod";
import { useMqttClient, useUid } from "../hooks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useMessageListener } from "../hooks/useMessageListener";
import { LOCAL_STORAGE_KEYS, MESSAGE_TYPE, SetLocalValiable } from "../types";
import { sendMessageToFigma } from "../utils";

export const mqttConnection = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  username: z.string().optional(),
  password: z.string().optional(),
  autoConnect: z.boolean().default(false).optional(),
});

export type MqttConnection = z.infer<typeof mqttConnection>;

const FigmaMqttContext = createContext({
  isConnected: false,
  connect: (options: MqttConnection): Promise<void> => {
    throw new Error("MqttProvider not found", {
      cause: JSON.stringify(options),
    });
  },
  disconnect: (): void => {
    throw new Error("MqttProvider not found");
  },
  publish: (topic: string, payload: string): Promise<Packet | undefined> => {
    throw new Error("MqttProvider not found", {
      cause: JSON.stringify({ topic, payload }),
    });
  },
});

export function FigmaMqttProvider({ children }: PropsWithChildren) {
  const { createTopic } = useUid();

  const [mqttConnection, setMqttConnection] = useLocalStorage<MqttConnection>(
    LOCAL_STORAGE_KEYS.MQTT_CONNECTION,
  );

  const {
    connect,
    isConnected,
    disconnect,
    subscribe,
    unsubscribe,
    subscriptions,
    publish,
  } = useMqttClient();

  function handleDisconnect() {
    void setMqttConnection(
      (prev) => prev && { ...prev, autoConnect: false },
    ).then(disconnect);
  }

  async function handleConnect(options: MqttConnection) {
    await setMqttConnection(options);
    connect(options);
  }

  async function updateSubscriptions(variables: Variable[] | undefined) {
    const topics = variables?.map(({ id }) => createTopic(id)) ?? [];

    // Clear subscriptions that are no longer needed
    for (const [subscribedTopic] of subscriptions.current) {
      if (!topics.includes(subscribedTopic)) {
        await unsubscribe(subscribedTopic);
      }
    }

    // Add new subscriptions
    for (const variable of variables ?? []) {
      const topic = createTopic(variable.id);
      if (!topic) return;
      subscribe(topic, (_: string, payload: Buffer) => {
        sendMessageToFigma(SetLocalValiable(variable.id, payload.toString()));
      });
    }
  }

  const getLocalVariables = useMessageListener<Variable[] | undefined>(
    MESSAGE_TYPE.GET_LOCAL_VARIABLES,
    updateSubscriptions,
    {
      intervalInMs: 5000,
    },
  );

  useEffect(() => {
    if (!isConnected) return;

    void getLocalVariables(undefined);
  }, [isConnected, getLocalVariables]);

  useEffect(() => {
    if (!mqttConnection?.autoConnect) return;

    void connect(mqttConnection);
  }, [mqttConnection, connect]);

  return (
    <FigmaMqttContext.Provider
      value={{
        connect: handleConnect,
        disconnect: handleDisconnect,
        isConnected,
        publish,
      }}
    >
      {children}
    </FigmaMqttContext.Provider>
  );
}

export function useMqtt() {
  return useContext(FigmaMqttContext);
}

import React, { useEffect } from "react";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type PropsWithChildren,
} from "react";
import { z } from "zod";
import { useMqttClient, useVariableId } from "../hooks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useMessageListener } from "../hooks/useMessageListener";
import { LOCAL_STORAGE_KEYS, MESSAGE_TYPE, SetLocalValiable } from "../types";
import { sendMessageToFigma } from "../utils/sendMessageToFigma";

type Callback<T> = (message: T) => void;

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
    console.log("MqttProvider not found", { options });
    throw new Error("MqttProvider not found");
  },
  disconnect: (): void => {
    console.log("MqttProvider not found");
    throw new Error("MqttProvider not found");
  },
});

export function FigmaMqttProvider({ children }: PropsWithChildren) {
  const { createTopic } = useVariableId();

  const [mqttConnection, setMqttConnection] = useLocalStorage<MqttConnection>(
    LOCAL_STORAGE_KEYS.MQTT_CONNECTION,
  );

  const mqttCallback = (topic: string, message: Buffer) => {
    const callback = subscriptions.current.get(topic);
    console.log("recieved message", { topic, message, callback });
    if (!callback) return;

    try {
      callback(message);
    } catch (error) {
      console.error("Nothing we can do", error);
    }
  };

  const { connect, isConnected, disconnect, subscribe, unsubscribe } =
    useMqttClient(mqttCallback);

  const subscriptions = useRef<Map<string, Callback<Buffer>>>(new Map());

  const handleDisconnect = useCallback(() => {
    disconnect();
    void setMqttConnection((prev) => prev && { ...prev, autoConnect: false });
  }, [setMqttConnection, disconnect]);

  function handleMessage(variable: Variable) {
    function handleValue(value: Buffer) {
      sendMessageToFigma(SetLocalValiable(variable.id, value.toString()));
    }

    return handleValue;
  }

  async function handleConnect(options: MqttConnection) {
    await setMqttConnection(options);
    connect(options);
  }

  async function updateSubscriptions(variables: Variable[] | undefined) {
    const subscribedTopics = subscriptions.current.keys();
    const topics = variables?.map(({ id }) => createTopic(id)) ?? [];

    // Clear subscriptions that are no longer needed
    for (const subscribedTopic of subscribedTopics) {
      if (!topics.includes(subscribedTopic)) {
        await unsubscribe(subscribedTopic);
        subscriptions.current.delete(subscribedTopic);
      }
    }

    // Add new subscriptions
    for (const variable of variables ?? []) {
      const topic = createTopic(variable.id);
      if (!subscriptions.current.has(topic)) {
        subscribe(topic);
        subscriptions.current.set(topic, handleMessage(variable));
      }
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
      }}
    >
      {children}
    </FigmaMqttContext.Provider>
  );
}

export function useMqtt() {
  return useContext(FigmaMqttContext);
}

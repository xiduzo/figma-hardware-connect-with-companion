import React from "react";

import mqtt from "mqtt";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { z } from "zod";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useMessageListener } from "../hooks/useMessageListener";
import { LOCAL_STORAGE_KEYS, MESSAGE_TYPE, SetLocalValiable } from "../types";
import { cuid } from "../utils/cuid";
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

const MqttContext = createContext({
  isConnected: false,
  uid: "",
  connect: async (options: mqtt.IClientOptions): Promise<void> => {
    console.log("MqttProvider not found", { options });
    throw new Error("MqttProvider not found");
  },
  disconnect: (callback?: (error?: Error) => void): void => {
    console.log("MqttProvider not found", { callback });
    throw new Error("MqttProvider not found");
  },
});

export function createTopic(variable: string, id?: string) {
  return `figma-mqtt/${id ?? cuid()}/${variable}`;
}

export function MqttProvider({ children }: PropsWithChildren) {
  const client = useRef<mqtt.MqttClient>();
  const [isConnected, setIsConnected] = useState(false);
  const [uid] = useLocalStorage(LOCAL_STORAGE_KEYS.TOPIC_UID, {
    initialValue: cuid(),
  });

  const [mqttConnection, setMqttConnection] = useLocalStorage<MqttConnection>(
    LOCAL_STORAGE_KEYS.MQTT_CONNECTION,
  );

  const subscriptions = useRef<Map<string, Callback<Buffer>>>(new Map());

  const sendMessage = useMessageListener<Variable[] | undefined>(
    MESSAGE_TYPE.GET_LOCAL_VARIABLES,
    updateSubscriptions,
    {
      intervalInMs: 5000,
      shouldSendInitialMessage: true,
    },
  );

  const clearConnection = useCallback(() => {
    client.current = undefined;
    setIsConnected(false);
    subscriptions.current.clear();
  }, []);

  const connect = useCallback(
    async (options: mqtt.IClientOptions) => {
      const newClient = await mqtt.connectAsync({
        ...options,
        protocol: "wss",
      });

      newClient.on("disconnect", clearConnection);

      newClient.on("message", (topic, message) => {
        const callback = subscriptions.current.get(topic);
        console.log("recieved message", { topic, message, callback });
        if (!callback) return;

        try {
          callback(message);
        } catch (error) {
          console.error("Nothing we can do", error);
        }
      });

      client.current = newClient;
      setIsConnected(true);
      sendMessage(undefined);
    },
    [sendMessage, clearConnection],
  );

  const disconnect = useCallback(
    (callback?: (error?: Error) => void) => {
      client.current?.end((error) => {
        clearConnection();
        callback?.(error);
      });
      setMqttConnection((prev) => prev && { ...prev, autoConnect: false });
    },
    [setMqttConnection, clearConnection],
  );

  function handleMessage(variable: Variable) {
    function handleValue(value: Buffer) {
      sendMessageToFigma(SetLocalValiable(variable.id, value.toString()));
    }

    return handleValue;
  }

  async function updateSubscriptions(variables: Variable[] | undefined) {
    if (!client.current) return;

    const subscribedTopics = subscriptions.current.keys();
    const topics = variables?.map(({ id }) => createTopic(id, uid)) ?? [];

    // Clear subscriptions that are no longer needed
    for (const subscribedTopic of subscribedTopics) {
      if (!topics.includes(subscribedTopic)) {
        console.log("unsubscribing from", { subscribedTopic });
        await client.current?.unsubscribeAsync(subscribedTopic);
        subscriptions.current.delete(subscribedTopic);
      }
    }

    // Add new subscriptions
    for (const variable of variables ?? []) {
      const topic = createTopic(variable.id, uid);
      if (!subscriptions.current.has(topic)) {
        console.log("subscribing to", { topic, variable });
        await client.current?.subscribeAsync(topic);
        subscriptions.current.set(topic, handleMessage(variable));
      }
    }
  }

  useEffect(() => {
    if (!mqttConnection?.autoConnect) return;
    connect(mqttConnection).catch(console.error);
  }, [mqttConnection, connect]);

  return (
    <MqttContext.Provider
      value={{ connect, disconnect, isConnected, uid: uid ?? cuid() }}
    >
      {children}
    </MqttContext.Provider>
  );
}

export function useMqtt() {
  return useContext(MqttContext);
}

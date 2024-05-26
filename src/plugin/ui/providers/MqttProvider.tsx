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
import { sendMessageToFigma } from "../utils/sendMessageToFigma";
import { toBoolean, toFigmaRgb } from "../utils/typeValidators";

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
  connect: async (options: mqtt.IClientOptions): Promise<void> => {
    console.log("MqttProvider not found", { options });
    throw new Error("MqttProvider not found");
  },
  disconnect: (callback?: (error?: Error) => void): void => {
    console.log("MqttProvider not found", { callback });
    throw new Error("MqttProvider not found");
  },
});

export function createTopic(uid: string, variable: string) {
  return `figma-mqtt/${uid}/${variable}`;
}

export function MqttProvider({ children }: PropsWithChildren) {
  const client = useRef<mqtt.MqttClient>();
  const [isConnected, setIsConnected] = useState(false);

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

  const connect = useCallback(
    async (options: mqtt.IClientOptions) => {
      const newClient = await mqtt.connectAsync({
        ...options,
        protocol: "wss",
      });

      newClient.on("disconnect", () => {
        client.current = undefined;
        subscriptions.current.clear();
        setIsConnected(false);
      });

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
    [sendMessage],
  );

  const disconnect = useCallback(
    (callback?: (error?: Error) => void) => {
      client.current?.end((error) => {
        client.current = undefined;
        setIsConnected(false);
        callback?.(error);
      });
      setMqttConnection((prev) => prev && { ...prev, autoConnect: false });
    },
    [setMqttConnection],
  );

  function handleMessage(variable: Variable) {
    function handleValue(value: Buffer) {
      switch (variable.resolvedType) {
        case "BOOLEAN":
          sendMessageToFigma(
            SetLocalValiable(variable.id, toBoolean(value.toString())),
          );
          break;
        case "FLOAT":
          sendMessageToFigma(
            SetLocalValiable(variable.id, Number(value.toString())),
          );
          break;
        case "COLOR":
          sendMessageToFigma(
            SetLocalValiable(variable.id, toFigmaRgb(value.toString())),
          );
          break;
        case "STRING":
        default:
          sendMessageToFigma(SetLocalValiable(variable.id, value.toString()));
          break;
      }
    }

    return handleValue;
  }

  async function updateSubscriptions(variables: Variable[] | undefined) {
    if (!client.current) return;

    const subscribedTopics = subscriptions.current.keys();
    const topics = variables?.map(({ id }) => createTopic(id, id)) ?? [];

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
      const topic = createTopic(variable.id, variable.id);
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
    <MqttContext.Provider value={{ connect, disconnect, isConnected }}>
      {children}
    </MqttContext.Provider>
  );
}

export function useMqtt() {
  return useContext(MqttContext);
}

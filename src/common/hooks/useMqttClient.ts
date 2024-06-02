import mqtt from "mqtt";
import { useRef, useState } from "react";

export function useMqttClient() {
  const client = useRef<mqtt.MqttClient>();

  const [isConnected, setIsConnected] = useState(false);
  const subscriptions = useRef(new Map<string, mqtt.OnMessageCallback>());

  function disconnect() {
    setIsConnected(false);
    client.current?.end();
    client.current = undefined;
  }

  function subscribe(topic: string, callback: mqtt.OnMessageCallback) {
    if (subscriptions.current.get(topic)) return;

    console.log("Subscribing to", topic);
    subscriptions.current.set(topic, callback);
    client.current?.subscribeAsync(topic).catch(console.error);

    return () => {
      unsubscribe(topic).catch(console.error);
    };
  }

  async function unsubscribe(topic: string) {
    console.log("Unsubscribing from", topic);
    subscriptions.current.delete(topic);
    return client.current?.unsubscribeAsync(topic);
  }

  async function publish(topic: string, payload: string) {
    console.log("Publishing to", topic, payload);
    return client.current?.publishAsync(topic, payload);
  }

  function connect(
    options: mqtt.IClientOptions = {
      host: "test.mosquitto.org",
      port: 8081,
    },
  ) {
    if (client.current) return;

    client.current = mqtt.connect({
      ...options,
      protocol: "wss",
    });

    client.current
      .on("connect", () => {
        console.log("Connected to", options.host);
        setIsConnected(true);
      })
      .on("error", disconnect)
      .on("disconnect", disconnect)
      .on("close", () => {
        setIsConnected(false);
      })
      .on("reconnect", () => {
        for (const [topic, callback] of subscriptions.current) {
          unsubscribe(topic)
            .then(() => subscribe(topic, callback))
            .catch(console.error);
        }
        setIsConnected(true);
      })
      .on("message", (topic, message, packet) => {
        subscriptions.current.get(topic)?.(topic, message, packet);
      });

    return () => disconnect();
  }

  return {
    isConnected,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
    subscriptions,
  };
}

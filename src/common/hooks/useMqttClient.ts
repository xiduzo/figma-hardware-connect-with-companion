import mqtt from "mqtt";
import { useCallback, useRef, useState } from "react";

export function useMqttClient() {
  const client = useRef<mqtt.MqttClient>();

  const [isConnected, setIsConnected] = useState(false);
  const subscriptions = useRef(new Map<string, mqtt.OnMessageCallback>());

  const disconnect = useCallback(() => {
    setIsConnected(false);
    client.current?.end();
    client.current = undefined;
  }, [])

  const unsubscribe = useCallback((topic: string) => {
    subscriptions.current.delete(topic);
    return client.current?.unsubscribeAsync(topic);
  }, [])

  const subscribe = useCallback((topic: string, callback: mqtt.OnMessageCallback) => {
    if (subscriptions.current.get(topic)) return;
    subscriptions.current.set(topic, callback);
    client.current?.subscribeAsync(topic).catch(console.error);

    return () => {
      unsubscribe?.(topic)?.catch(console.error);
    };
  }, [unsubscribe])

  const publish = useCallback(async (topic: string, payload: string) => {
    return client.current?.publishAsync(topic, payload);
  }, [])

  const resubscribe = useCallback(() => {
    for (const [topic, callback] of subscriptions.current) {
      unsubscribe?.(topic)?.then(() => subscribe(topic, callback))
        .catch(console.error);
    }
    setIsConnected(true);
  }, [unsubscribe, subscribe])

  const connect = useCallback((
    options: mqtt.IClientOptions = {
      host: "test.mosquitto.org",
      port: 8081,
    },
  ) => {
    if (client.current) return;

    client.current = mqtt.connect({
      ...options,
      protocol: "wss",
    });

    client.current
      .on("connect", resubscribe)
      .on("error", disconnect)
      .on("disconnect", disconnect)
      .on("close", () => {
        setIsConnected(false);
      })
      .on("reconnect", resubscribe)
      .on("message", (topic, message, packet) => {
        const topics = subscriptions.current.keys()
        for (const subscription of topics) {
          const regexp = new RegExp(subscription.replace(/\//g, "\\/").replace(/\+/g, "\\S+").replace(/#/, "\\S+"))
          if (topic.match(regexp)) {
            subscriptions.current.get(subscription)?.(topic, message, packet);
          }
        }
      });

    return () => disconnect();
  }, [resubscribe, disconnect])

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

import mqtt from "mqtt";
import { useRef, useState } from "react";

export function useMqttClient(callback: mqtt.OnMessageCallback) {
  const client = useRef<mqtt.MqttClient>();

  const [isConnected, setIsConnected] = useState(false);

  function disconnect() {
    setIsConnected(false);
    client.current?.end();
    client.current = undefined;
  }

  function subscribe(topic: string) {
    client.current?.subscribeAsync(topic).catch(console.error);

    return () => {
      client.current?.unsubscribeAsync(topic).catch(console.error);
    };
  }

  async function unsubscribe(topic: string) {
    return client.current?.unsubscribeAsync(topic);
  }

  async function publish(topic: string, payload: string) {
    return client.current?.publishAsync(topic, payload);
  }

  function connect(
    options: mqtt.IClientOptions = { host: "test.mosquitto.org", port: 8081 },
  ) {
    mqtt
      .connectAsync({
        ...options,
        protocol: "wss",
      })
      .then((newClient) => {
        newClient.on("disconnect", disconnect).on("message", callback);
        client.current = newClient;
        setIsConnected(true);
      })
      .catch(console.error);

    return () => disconnect();
  }

  return { isConnected, connect, disconnect, subscribe, unsubscribe, publish };
}

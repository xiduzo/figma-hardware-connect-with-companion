import React from "react";

import { useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  ConnectionIndicator,
  IconButton,
  Text,
  Title,
} from "../components";
import { useSetWindowSize } from "../hooks/useSetWindowSize";
import { useMqtt } from "../providers/MqttProvider";

export default function Page() {
  useSetWindowSize({ width: 300, height: 160 });

  return (
    <section className="flex h-full flex-col items-stretch justify-center space-y-5">
      <section className="text-center">
        <Title>Figma MQTT</Title>
        <Text dimmed>made with ♥️ by xiduzo</Text>
      </section>
      <MqttSection />
    </section>
  );
}

function MqttSection() {
  const navigate = useNavigate();
  const { isConnected, disconnect } = useMqtt();

  return (
    <section className="space-y-1.5">
      <section className="flex items-center justify-between">
        <ConnectionIndicator isConnected={isConnected}>
          <Title as="h2">Mqtt</Title>
        </ConnectionIndicator>
        <ButtonGroup>
          {isConnected && (
            <IconButton icon="SignalSlashIcon" onClick={() => disconnect()} />
          )}
          <IconButton
            icon="CogIcon"
            onClick={() => navigate("/mqtt/settings")}
          />
        </ButtonGroup>
      </section>
      <section>
        <Button onClick={() => navigate("/mqtt/connections")}>
          Show connections
        </Button>
      </section>
    </section>
  );
}

import React from "react";

import { useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  ConnectionIndicator,
  Header,
  IconButton,
  Text,
  Title,
} from "../components";
import { useSetWindowSize } from "../hooks/useSetWindowSize";
import { AuthButton, useAuth, useMqtt } from "../providers";

export default function Page() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useSetWindowSize({ width: 280, height: 295 });

  return (
    <>
      <Header title="">
        <div className="flex grow items-center space-x-2">
          <IconButton
            icon="UserCircleIcon"
            onClick={() => navigate("/account")}
          />
          <Text dimmed>{user?.name ?? "anonymous"}</Text>
        </div>
      </Header>
      <main className="flex grow flex-col items-stretch justify-center space-y-5">
        <MqttSection />
        <SerialSection />
        <Text dimmed className="py-4 text-center">
          made with ♥️ by xiduzo
        </Text>
      </main>
    </>
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

function SerialSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="space-y-1.5">
      <section className="flex items-center justify-between">
        <ConnectionIndicator isConnected={!!user}>
          <Title as="h2">Serial</Title>
        </ConnectionIndicator>
        <ButtonGroup>
          <IconButton
            icon="QuestionMarkCircleIcon"
            onClick={() => navigate("/serial/info")}
          />
        </ButtonGroup>
      </section>
      <section>
        {!user && <AuthButton signInText="Sign in to enable" />}
        {user && (
          <Button onClick={() => navigate("/serial/connections")}>
            Show connections
          </Button>
        )}
      </section>
    </section>
  );
}

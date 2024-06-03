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
import { VERCEL_URL } from "../constants";
import { useSetWindowSize } from "../hooks/useSetWindowSize";
import { useAuth, useInternalMqtt, useMqtt } from "../providers";

export default function Page() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useSetWindowSize({ width: 250, height: 250 });

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
      <main className="flex grow flex-col items-stretch justify-center space-y-3">
        <Button onClick={() => navigate("/variables")}>
          Manage Figma variables
        </Button>
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
  const { isConnected } = useMqtt();

  return (
    <section className="flex items-center justify-between">
      <ConnectionIndicator isConnected={isConnected}>
        <Title as="h2">Mqtt</Title>
      </ConnectionIndicator>
      <ButtonGroup>
        <IconButton icon="CogIcon" onClick={() => navigate("/mqtt/settings")} />
      </ButtonGroup>
    </section>
  );
}

function SerialSection() {
  const { user } = useAuth();
  const { isConnected } = useInternalMqtt();
  const navigate = useNavigate();

  function gotoCompanionApp() {
    window.open(VERCEL_URL, "_blank");
  }

  return (
    <section>
      <section className="flex items-center justify-between">
        <ConnectionIndicator isConnected={!!user && isConnected}>
          <Title as="h2">Serial</Title>
        </ConnectionIndicator>
        <ButtonGroup>
          <IconButton
            icon="ArrowTopRightOnSquareIcon"
            onClick={gotoCompanionApp}
          />
          <IconButton icon="CogIcon" onClick={() => navigate("/serial/info")} />
        </ButtonGroup>
      </section>
    </section>
  );
}

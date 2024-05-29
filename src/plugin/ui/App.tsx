import React from "react";

import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { TRPCReactProvider, api, type RouterOutputs } from "../../trpc/react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./index.css";
import {
  AuthProvider,
  FigmaMqttProvider,
  InternalMqttProvider,
  useAuth,
} from "./providers";
import { LOCAL_STORAGE_KEYS, MESSAGE_TYPE } from "./types";

type Tokens = RouterOutputs["auth"]["getAccessToken"];

import { useMessageListener } from "./hooks";
import Home from "./routes";
import Account from "./routes/account";
import MqttConnections from "./routes/mqtt/connections";
import MqttSettings from "./routes/mqtt/settings";
import SerialConnections from "./routes/serial/connections";
import SerialInfo from "./routes/serial/info";

const router = createMemoryRouter([
  { path: "/", Component: Home },
  { path: "/account", Component: Account },
  { path: "/mqtt/settings", Component: MqttSettings },
  { path: "/mqtt/connections", Component: MqttConnections },
  { path: "/serial/connections", Component: SerialConnections },
  { path: "/serial/info", Component: SerialInfo },
]);

export default function App() {
  const [localTokens] = useLocalStorage<Tokens>(LOCAL_STORAGE_KEYS.AUTH_TOKENS);

  return (
    <TRPCReactProvider source="figma-ui" accessToken={localTokens?.accessToken}>
      <AuthProvider>
        <AuthenticatedBackgroundStuff />
        <InternalMqttProvider />
        <FigmaMqttProvider>
          <RouterProvider router={router} />
        </FigmaMqttProvider>
      </AuthProvider>
    </TRPCReactProvider>
  );
}

function AuthenticatedBackgroundStuff() {
  const { user } = useAuth();

  if (!user) return null;
  return (
    <>
      <UpdateFigmaVariablesInDatabase />
    </>
  );
}

function UpdateFigmaVariablesInDatabase() {
  const { mutateAsync } = api.figma.sync.useMutation();

  async function onMessage(variables: Variable[] | undefined) {
    if (!variables) return;

    await mutateAsync(variables);
  }

  useMessageListener<Variable[] | undefined>(
    MESSAGE_TYPE.GET_LOCAL_VARIABLES,
    onMessage,
    { intervalInMs: 10000, shouldSendInitialMessage: true },
  );
  return null;
}

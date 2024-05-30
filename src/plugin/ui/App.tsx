import React, { useCallback } from "react";

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
import MqttSettings from "./routes/mqtt/settings";
import SerialInfo from "./routes/serial/info";
import FigmaVariables from "./routes/variables";

const router = createMemoryRouter([
  { path: "/", Component: Home },
  { path: "/account", Component: Account },
  { path: "/mqtt/settings", Component: MqttSettings },
  { path: "/variables", Component: FigmaVariables },
  { path: "/serial/info", Component: SerialInfo },
]);

export default function App() {
  const [localTokens] = useLocalStorage<Tokens>(LOCAL_STORAGE_KEYS.AUTH_TOKENS);

  return (
    <TRPCReactProvider source="figma-ui" accessToken={localTokens?.accessToken}>
      <AuthProvider>
        <AuthenticatedBackgroundStuff />
        <InternalMqttProvider>
          <FigmaMqttProvider>
            <RouterProvider router={router} />
          </FigmaMqttProvider>
        </InternalMqttProvider>
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

  const handler = useCallback(
    async (variables: Variable[] | undefined) => {
      if (!variables) return;

      await mutateAsync(variables);
    },
    [mutateAsync],
  );

  useMessageListener<Variable[] | undefined>(
    MESSAGE_TYPE.GET_LOCAL_VARIABLES,
    handler,
    { intervalInMs: 10000, shouldSendInitialMessage: true },
  );
  return null;
}

import React, { useCallback, useRef } from "react";

import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { TRPCReactProvider, api, type RouterOutputs } from "../../trpc/react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./index.css";
import {
  AuthProvider,
  FigmaMqttProvider,
  InternalMqttProvider,
  useAuth,
  useInternalMqtt,
  useMqtt,
} from "./providers";
import { LOCAL_STORAGE_KEYS, MESSAGE_TYPE } from "./types";

type Tokens = RouterOutputs["auth"]["getAccessToken"];

import { mapValueToFigmaValue } from "../../common/utils/mapValueToFigmaValue";
import { useMessageListener, useUid } from "./hooks";
import Home from "./routes";
import Account from "./routes/account";
import MqttSettings from "./routes/mqtt/settings";
import SerialInfo from "./routes/serial/info";
import FigmaVariables from "./routes/variables";
import NewFigmaVariable from "./routes/variables/new";
import FigmaVariablesSettings from "./routes/variables/settings";

const router = createMemoryRouter([
  { path: "/", Component: Home },
  { path: "/account", Component: Account },
  { path: "/mqtt/settings", Component: MqttSettings },
  { path: "/variables", Component: FigmaVariables },
  { path: "/variables/settings", Component: FigmaVariablesSettings },
  { path: "/variables/new", Component: NewFigmaVariable },
  { path: "/serial/info", Component: SerialInfo },
]);

export default function App() {
  const [localTokens] = useLocalStorage<Tokens>(LOCAL_STORAGE_KEYS.AUTH_TOKENS);

  return (
    <TRPCReactProvider source="figma-ui" accessToken={localTokens?.accessToken}>
      <AuthProvider>
        <InternalMqttProvider>
          <FigmaMqttProvider>
            <BackgroundStuff />
            <RouterProvider router={router} />
          </FigmaMqttProvider>
        </InternalMqttProvider>
      </AuthProvider>
    </TRPCReactProvider>
  );
}

function BackgroundStuff() {
  const { user } = useAuth();
  useInternalVariableState();

  return <>{user && <AuthenticatedBackgroundStuff />}</>;
}

function useInternalVariableState() {
  const internalVariableState = useRef(
    new Map<string, VariableValue | undefined>(),
  );
  const { publish: publishWithMqtt } = useMqtt();
  const { publish: publishWithInternalMqtt } = useInternalMqtt();
  const { createTopic } = useUid();

  const handler = useCallback(
    async (variables: Variable[] | undefined) => {
      variables?.forEach((variable) => {
        const newValue = Object.values(variable.valuesByMode)[0];
        const valueAsFigmaValue = mapValueToFigmaValue(
          variable.resolvedType,
          newValue,
        );
        const topic = createTopic(variable.id, "get") ?? variable.id;

        const currentValue = internalVariableState.current.get(topic);
        const newValueAsJSON =
          typeof valueAsFigmaValue === "string"
            ? valueAsFigmaValue
            : JSON.stringify(valueAsFigmaValue);
        internalVariableState.current.set(topic, newValueAsJSON);

        if (newValueAsJSON !== currentValue) {
          void publishWithMqtt(topic, newValueAsJSON);
          void publishWithInternalMqtt(topic, newValueAsJSON);
        }
      });
    },
    [createTopic, publishWithInternalMqtt, publishWithMqtt],
  );

  useMessageListener<Variable[] | undefined>(
    MESSAGE_TYPE.MQTT_GET_LOCAL_VARIABLES,
    handler,
    { intervalInMs: 100 },
  );

  return null;
}

function AuthenticatedBackgroundStuff() {
  useSyncVariablesWithDatabase();
  return null;
}

function useSyncVariablesWithDatabase() {
  const { mutateAsync } = api.figma.sync.useMutation();
  const { uid } = useUid();

  const handler = useCallback(
    async (variables: Variable[] | undefined) => {
      if (!variables) return;
      if (!uid) return;

      await mutateAsync(variables.map((variable) => ({ ...variable, uid })));
    },
    [mutateAsync, uid],
  );

  useMessageListener<Variable[] | undefined>(
    MESSAGE_TYPE.GET_LOCAL_VARIABLES,
    handler,
    { intervalInMs: 10000, shouldSendInitialMessage: true },
  );

  return null;
}

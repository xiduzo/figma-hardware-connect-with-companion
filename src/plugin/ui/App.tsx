import React from "react";

import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { TRPCReactProvider, type RouterOutputs } from "../../trpc/react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider";
import { MqttProvider } from "./providers/MqttProvider";
import { LOCAL_STORAGE_KEYS } from "./types";

type Tokens = RouterOutputs["auth"]["getAccessToken"];

import Home from "./routes/index";
import MqttConnections from "./routes/mqtt/connections";
import MqttSettings from "./routes/mqtt/settings";

const router = createMemoryRouter([
  { path: "/", Component: Home },
  { path: "/mqtt/settings", Component: MqttSettings },
  { path: "/mqtt/connections", Component: MqttConnections },
]);

export default function App() {
  const [localTokens] = useLocalStorage<Tokens>(LOCAL_STORAGE_KEYS.AUTH_TOKENS);

  return (
    <TRPCReactProvider source="figma-ui" accessToken={localTokens?.accessToken}>
      <AuthProvider>
        <MqttProvider>
          <RouterProvider router={router} />
        </MqttProvider>
      </AuthProvider>
    </TRPCReactProvider>
  );
}

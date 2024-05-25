import React, { useState } from "react";

import { TRPCReactProvider, type RouterOutputs } from "../../trpc/react";
import { Button, Text } from "./components";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./index.css";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { trpc } from "./trpc";
import { LOCAL_STORAGE_KEYS } from "./types";

type Tokens = RouterOutputs["auth"]["getAccessToken"];

export function App() {
  const [localTokens] = useLocalStorage<Tokens>(LOCAL_STORAGE_KEYS.AUTH_TOKENS);
  return (
    <TRPCReactProvider
      source="figma-ui"
      accessToken={localTokens?.accessToken ?? undefined}
    >
      <AuthProvider>
        <Text>hi</Text>
        <Button>hi asdas</Button>
        <Test />
        <Auth />
      </AuthProvider>
    </TRPCReactProvider>
  );
}

function Test() {
  const [state, setState] = useState(false);
  const response = trpc.post.hello.useQuery({ text: "xiduzoooo" });

  return (
    <div onClick={() => setState(!state)}>
      {response.data?.greeting ?? "loading"}
    </div>
  );
}

function Auth() {
  const { auth } = useAuth();

  return <Button onClick={auth}>auth</Button>;
}

export default App;

import React, { useState } from "react";

import { TRPCReactProvider } from "../../trpc/react";
import { Button, Text } from "./components";
import "./index.css";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { trpc } from "./trpc";

export function App() {
  return (
    <TRPCReactProvider source="figma-ui">
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

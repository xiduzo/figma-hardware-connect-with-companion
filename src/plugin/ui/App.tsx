import React, { useState } from "react";

import { TRPCReactProvider } from "../../trpc/react";
import { AuthProvider } from "./providers/AuthProvider";
import { trpc } from "./trpc";

export function App() {
  return (
    <AuthProvider>
      <TRPCReactProvider source="figma-ui">
        Hello worldsss
        <Test />
        {/* <Auth /> */}
      </TRPCReactProvider>
    </AuthProvider>
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
  const { data } = trpc.auth.getReadWriteKeys.useQuery();

  const { data: tokens } = trpc.auth.getAccessToken.useQuery(data?.read ?? "", {
    enabled: !!data?.read,
    refetchInterval: 1000,
  });

  console.log(data, tokens);
  function handleAuth() {
    if (!data) return;
    window.open(
      `http://localhost:3000/api/auth/signin?figma-write-key=${data.write}`,
      "_blank",
    );
  }
  return <button onClick={handleAuth}>auth</button>;
}

export default App;

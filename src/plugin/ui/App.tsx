import React, { useState } from "react";

import { TRPCReactProvider } from "../../trpc/react";
import { trpc } from "./trpc";

export function App() {
  return (
    <TRPCReactProvider source="figma-ui">
      Hello worldsss
      <Test />
    </TRPCReactProvider>
  );
}

const Test = () => {
  const [state, setState] = useState(false);
  const response = trpc.post.hello.useQuery({ text: "xiduzoooo" });

  console.log({ ...response });

  return (
    <div onClick={() => setState(!state)}>
      {response.data?.greeting ?? "loading"}
    </div>
  );
};

export default App;

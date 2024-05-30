/** eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Header, Text } from "../../components";
import { useSetWindowSize } from "../../hooks";
import { AuthButton, useAuth } from "../../providers";

export default function Page() {
  useSetWindowSize({ width: 300, height: 100 });

  const { user } = useAuth();

  return (
    <>
      <Header title="My Account">
        <Text dimmed>{user?.name ?? "anonymous user"}</Text>
      </Header>
      <main>
        <AuthButton />
      </main>
    </>
  );
}

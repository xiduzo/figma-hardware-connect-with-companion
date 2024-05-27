import React from "react";
import { Header, Text } from "../../components";
import { AuthButton, useAuth } from "../../providers";

export default function Page() {
  const { user } = useAuth();
  return (
    <>
      <Header title="My Account"></Header>
      <main>
        <Text>{user?.name}</Text>
        <AuthButton />
      </main>
    </>
  );
}

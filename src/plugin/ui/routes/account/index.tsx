import React from "react";
import { Header, Text } from "../../components";
import { useAuth } from "../../providers";

export default function Page() {
  const { userId } = useAuth();

  return (
    <>
      <Header title="My Account"></Header>
      <main>
        <Text>{userId}</Text>
      </main>
    </>
  );
}

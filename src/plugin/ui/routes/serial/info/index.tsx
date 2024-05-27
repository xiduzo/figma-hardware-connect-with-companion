import React from "react";
import { Header, Text } from "../../../components";
import { AuthButton } from "../../../providers";

export default function Page() {
  function gotoCompanionApp() {
    window.open("http://localhost:3000", "_blank");
  }
  return (
    <>
      <Header title="Serial"></Header>
      <main className="space-y-2">
        <Text>
          Figma, unfortuantly, limits the use the serial port access. We can not
          directly read out serial data from your connected devices.
        </Text>
        <Text className="pb-3">
          Fortuantly, using our{" "}
          <span onClick={gotoCompanionApp} className="cursor-pointer underline">
            companion app
          </span>
          , we can send serial data to this plugin!
        </Text>
        <AuthButton signInText="Sign in to enable" />
      </main>
    </>
  );
}

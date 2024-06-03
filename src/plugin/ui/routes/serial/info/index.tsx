import React from "react";
import { Header, Text } from "../../../components";
import { VERCEL_URL } from "../../../constants";
import { useSetWindowSize } from "../../../hooks";
import { AuthButton } from "../../../providers";

export default function Page() {
  useSetWindowSize({ width: 250, height: 320 });

  function gotoCompanionApp() {
    window.open(VERCEL_URL, "_blank");
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
        <AuthButton signInText="Sign in to enable serial" />
      </main>
    </>
  );
}

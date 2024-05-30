import React, { useState } from "react";
import {
  ButtonGroup,
  Code,
  CopyIconButton,
  Header,
  Icon,
  Text,
  Title,
  TypeIcon,
} from "../../../components";

import { FIGMA_MQTT_COLLECTION_NAME } from "../../../constants";
import { useMessageListener, useSetWindowSize } from "../../../hooks";
import { MESSAGE_TYPE } from "../../../types";

export default function Page() {
  const [variables, setVariables] = useState<Variable[] | undefined>([]);
  useSetWindowSize({ width: 600, height: 450 });

  useMessageListener<Variable[] | undefined>(
    MESSAGE_TYPE.GET_LOCAL_VARIABLES,
    setVariables,
    {
      intervalInMs: 5000,
      shouldSendInitialMessage: true,
    },
  );

  return (
    <>
      <Header title="Serial connections"></Header>
      <main className="max-h-80 divide-y divide-zinc-300 dark:divide-zinc-700">
        {!variables?.length && (
          <section className="flex h-96 flex-col items-center justify-center text-center">
            <Icon
              dimmed
              icon="CubeTransparentIcon"
              className="mb-8 h-28 w-28"
            />
            <Title as="h2">No variables found</Title>
            <Text dimmed className="mt-4 max-w-sm">
              All variables created in the{" "}
              <Code>{FIGMA_MQTT_COLLECTION_NAME}</Code> collection will
              automatically make a MQTT connection.
            </Text>
          </section>
        )}
        {variables?.map((variable) => {
          return (
            <section key={variable.id} className="flex justify-between py-2">
              <section className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <TypeIcon resolvedType={variable.resolvedType} />
                  <Text>{variable.name}</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <Text dimmed>{variable.id}</Text>
                  <CopyIconButton text={variable.id} />
                </div>
              </section>
              <ButtonGroup></ButtonGroup>
            </section>
          );
        })}
      </main>
    </>
  );
}
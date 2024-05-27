import React, { useState } from "react";
import {
  ButtonGroup,
  Code,
  Header,
  Icon,
  IconButton,
  Text,
  Title,
} from "../../../components";

import { FIGMA_MQTT_COLLECTION_NAME } from "../../../constants";
import {
  useCopyToClipboard,
  useMessageListener,
  useSetWindowSize,
} from "../../../hooks";
import { createTopic, useMqtt } from "../../../providers";
import { MESSAGE_TYPE } from "../../../types";

export default function Page() {
  const { uid } = useMqtt();
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
      <Header title="Mqtt connections"></Header>
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
          const topic = createTopic(variable.id, uid);
          return (
            <section key={variable.id} className="flex justify-between py-2">
              <section className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <TypeIcon resolvedType={variable.resolvedType} />
                  <Text>{variable.name}</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <Text dimmed> {topic}</Text>
                  <CopyTopicButton topic={topic} />
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

function CopyTopicButton({ topic }: { topic: string }) {
  const [copiedValue, copy] = useCopyToClipboard();

  async function handleClicked() {
    await copy(topic);
  }

  return (
    <IconButton
      icon={
        copiedValue ? "ClipboardDocumentCheckIcon" : "ClipboardDocumentIcon"
      }
      intent={copiedValue ? "success" : "none"}
      className={`opacity-60 transition-opacity duration-75 hover:opacity-100 ${copiedValue ? "" : "cursor-copy"}`}
      onClick={handleClicked}
    />
  );
}

function TypeIcon({ resolvedType }: Pick<Variable, "resolvedType">) {
  switch (resolvedType) {
    case "COLOR":
      return <Icon icon="SwatchIcon" />;
    case "BOOLEAN":
      return <Icon icon="StopCircleIcon" />;
    case "FLOAT":
      return <Icon icon="HashtagIcon" />;
    case "STRING":
      return <Icon icon="LanguageIcon" />;
    default:
      return <Icon icon="QuestionMarkCircleIcon" />;
  }
}

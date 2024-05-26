import React, { useState } from "react";
import {
  ButtonGroup,
  Header,
  Icon,
  IconButton,
  Text,
} from "../../../components";

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
  useSetWindowSize({ width: 600, height: 400 });

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
      <section className="max-h-80 divide-y divide-zinc-300 dark:divide-zinc-700">
        {variables?.map((variable) => {
          const topic = createTopic(variable.id, uid);
          return (
            <section key={variable.id} className="flex justify-between py-2">
              <section className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <TypeIcon resolvedType={variable.resolvedType} />
                  <Text>{variable.name}</Text>
                </div>
                <Text dimmed>{topic}</Text>
              </section>
              <ButtonGroup>
                <CopyTopicButton topic={topic} />
              </ButtonGroup>
            </section>
          );
        })}
      </section>
    </>
  );
}

function CopyTopicButton({ topic }: { topic: string }) {
  const [copiedValue, copy] = useCopyToClipboard();

  async function handleClicked() {
    copy(topic);
  }

  return (
    <IconButton
      icon={
        copiedValue ? "ClipboardDocumentCheckIcon" : "ClipboardDocumentIcon"
      }
      className={copiedValue ? "text-green-500 dark:text-green-400" : undefined}
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

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
import { createTopic } from "../../../providers";
import { MESSAGE_TYPE } from "../../../types";

export default function Page() {
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
        {variables?.map((variable) => (
          <section key={variable.id} className="flex justify-between py-2">
            <section className="flex flex-col">
              <div className="flex items-center space-x-2">
                <TypeIcon resolvedType={variable.resolvedType} />
                <Text>{variable.name}</Text>
              </div>
              <Text dimmed>{createTopic(variable.id, variable.id)}</Text>
            </section>
            <ButtonGroup>
              <CopyTopicButton />
            </ButtonGroup>
          </section>
        ))}
      </section>
    </>
  );
}

function CopyTopicButton() {
  const [copiedValue, copy] = useCopyToClipboard();
  async function handleClicked() {
    copy(createTopic("id", "id"));
  }

  return (
    <IconButton
      icon={
        copiedValue ? "ClipboardDocumentCheckIcon" : "ClipboardDocumentIcon"
      }
      className={copiedValue ? "text-green-500 dark:text-green-500" : undefined}
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

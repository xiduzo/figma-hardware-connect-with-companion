import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Code,
  CopyIconButton,
  Header,
  Icon,
  IconButton,
  Text,
  Title,
  TypeIcon,
} from "../../components";

import { useNavigate } from "react-router-dom";
import { FIGMA_HARDWARE_CONNECT_COLLECTION_NAME } from "../../constants";
import { useMessageListener, useSetWindowSize, useUid } from "../../hooks";
import { DeleteVariable, GetLocalVariables, MESSAGE_TYPE } from "../../types";
import { sendMessageToFigma } from "../../utils";

export default function Page() {
  const { createTopic } = useUid();
  const navigate = useNavigate();
  const [variables, setVariables] = useState<Variable[] | undefined>([]);
  useSetWindowSize({ width: 500, height: 450 });

  useMessageListener<Variable[] | undefined>(
    MESSAGE_TYPE.GET_LOCAL_VARIABLES,
    setVariables,
    {
      intervalInMs: 5000,
      shouldSendInitialMessage: true,
    },
  );

  function deleteVariable(id: string) {
    sendMessageToFigma(DeleteVariable(id));
    sendMessageToFigma(GetLocalVariables());
  }

  return (
    <>
      <Header title="Figma variables">
        <ButtonGroup>
          <IconButton
            icon="CogIcon"
            onClick={() => navigate("/variables/settings")}
          />
          <IconButton
            icon="PlusIcon"
            onClick={() => navigate("/variables/new")}
          />
        </ButtonGroup>
      </Header>
      <main className="max-h-80 divide-y divide-zinc-300 dark:divide-zinc-700">
        {!variables?.length && (
          <section className="flex h-96 flex-col items-center justify-center text-center">
            <Icon
              dimmed
              icon="CubeTransparentIcon"
              className="mb-8 h-24 w-24"
            />
            <Title as="h2">No variables found</Title>
            <Text dimmed className="mt-4 max-w-sm">
              All variables in the{" "}
              <Code>{FIGMA_HARDWARE_CONNECT_COLLECTION_NAME}</Code> collection
              will automatically synchronize with this plugin.
            </Text>
            <Button
              icon="PlusIcon"
              className="mt-10"
              onClick={() => navigate("/variables/new")}
            >
              Create variable
            </Button>
          </section>
        )}
        {variables?.map((variable) => {
          const setTopic = createTopic(variable.id);
          const getTopic = createTopic(variable.id, "get");
          if (!setTopic || !getTopic) return null;
          return (
            <section
              key={variable.id}
              className="group flex justify-between py-2"
            >
              <section className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <TypeIcon resolvedType={variable.resolvedType} />
                  <Title as="h2" className="text-lg">
                    {variable.name}
                  </Title>
                </div>
                <ButtonGroup>
                  <CopyIconButton
                    textToCopy={setTopic}
                    text="copy set variable topic"
                  />
                  <CopyIconButton
                    textToCopy={getTopic}
                    text="copy get variable topic"
                  />
                </ButtonGroup>
              </section>
              <ButtonGroup>
                <IconButton
                  className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:duration-150"
                  icon="TrashIcon"
                  intent="danger"
                  onClick={() => deleteVariable(variable.id)}
                />
              </ButtonGroup>
            </section>
          );
        })}
      </main>
    </>
  );
}

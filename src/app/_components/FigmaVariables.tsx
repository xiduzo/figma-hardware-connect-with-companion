"use client";

import { ButtonGroup, IconButton, Title, TypeIcon } from "~/common/components";
import { TOPIC_PREFIX } from "~/common/constants";
import { api } from "~/trpc/react";
import { CopyIconButton } from "./CopyIconButton";

export function FigmaVariables() {
  const { data, refetch } = api.figma.get.useQuery(undefined, {
    refetchInterval: 10000,
  });

  return (
    <>
      <section className="flex justify-between">
        <Title>Figma Variables</Title>
        <IconButton icon="ArrowPathIcon" onClick={() => refetch()} />
      </section>
      <section className="divide-y divide-zinc-300 dark:divide-zinc-700">
        {data?.map((variable) => {
          const setTopic = `${TOPIC_PREFIX}/${variable.uid}/${variable.id}/set`;
          const getTopic = `${TOPIC_PREFIX}/${variable.uid}/${variable.id}/get`;
          return (
            <section
              key={variable.id}
              className="flex flex-col justify-between space-y-1 py-2"
            >
              <div className="flex items-center space-x-2">
                <TypeIcon resolvedType={variable.resolvedType} />
                <Title as="h2" className="text-lg">
                  {variable.name}
                </Title>
              </div>
              <ButtonGroup layout="col">
                <CopyIconButton
                  textToCopy={setTopic}
                  text="Copy set variable topic"
                />
                <CopyIconButton
                  textToCopy={getTopic}
                  text="Copy get variable topic"
                />
              </ButtonGroup>
            </section>
          );
        })}
      </section>
    </>
  );
}

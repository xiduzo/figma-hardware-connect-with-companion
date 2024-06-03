"use client";

import { ButtonGroup, Text, TypeIcon } from "~/common/components";
import { TOPIC_PREFIX } from "~/common/constants";
import { api } from "~/trpc/react";
import { CopyIconButton } from "./CopyIconButton";

export function ShowConections() {
  const { data } = api.figma.get.useQuery(undefined, {
    refetchInterval: 5000,
  });

  return (
    <section>
      {data?.map((variable) => {
        const setTopic = `${TOPIC_PREFIX}/${variable.uid}/${variable.id}/set`;
        const getTopic = `${TOPIC_PREFIX}/${variable.uid}/${variable.id}/get`;
        return (
          <section key={variable.id} className="flex justify-between py-2">
            <section className="flex flex-col">
              <div className="flex items-center space-x-2">
                <TypeIcon resolvedType={variable.resolvedType} />
                <Text>{variable.name}</Text>
              </div>
              <div className="flex items-center space-x-2">
                <Text dimmed>{setTopic}</Text>
                <CopyIconButton textToCopy={setTopic} />
              </div>
              <div className="flex items-center space-x-2">
                <Text dimmed>{getTopic}</Text>
                <CopyIconButton textToCopy={getTopic} />
              </div>
            </section>
            <ButtonGroup></ButtonGroup>
          </section>
        );
      })}
    </section>
  );
}

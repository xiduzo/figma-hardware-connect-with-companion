"use client";

import { ButtonGroup, Text, TypeIcon } from "~/common/components";
import { api } from "~/trpc/react";
import { CopyIconButton } from "./CopyIconButton";

export function ShowConections() {
  const { data } = api.figma.get.useQuery(undefined, {
    refetchInterval: 5000,
  });

  return (
    <section>
      {data?.map((variable) => {
        const topic = `fhc/${variable.uid}/${variable.id}`;
        return (
          <section key={variable.id} className="flex justify-between py-2">
            <section className="flex flex-col">
              <div className="flex items-center space-x-2">
                <TypeIcon resolvedType={variable.resolvedType} />
                <Text>{variable.name}</Text>
              </div>
              <div className="flex items-center space-x-2">
                <Text dimmed>{topic}</Text>
                <CopyIconButton text={topic} />
              </div>
            </section>
            <ButtonGroup></ButtonGroup>
          </section>
        );
      })}
    </section>
  );
}

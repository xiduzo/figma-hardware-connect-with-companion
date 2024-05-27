import React, { type PropsWithChildren } from "react";

export function Code({ children }: Props) {
  return (
    <code className="rounded-md border px-1.5 py-1 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
      {children}
    </code>
  );
}

type Props = PropsWithChildren;

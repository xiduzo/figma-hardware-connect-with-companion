import React from "react";

import { type PropsWithChildren } from "react";
import { Title } from ".";
import { IconBackButton } from "./IconBackButton";

export function Header({ title, children }: Props) {
  return (
    <header className="sticky top-0 z-50 -m-2 mb-3 items-center justify-between bg-stone-100 p-2 dark:bg-stone-800">
      <section className="flex items-center space-x-1.5">
        <IconBackButton />
        <Title>{title}</Title>
      </section>
      {children}
    </header>
  );
}

type Props = PropsWithChildren & {
  title: string;
};

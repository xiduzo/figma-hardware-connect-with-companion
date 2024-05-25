import React from "react";

import { cva } from "class-variance-authority";
import { type PropsWithChildren } from "react";

export function Badge({ children, className, ...spanProps }: Props) {
  return (
    <span className={badge({ className })} {...spanProps}>
      {children}
    </span>
  );
}

type Props = React.HTMLProps<HTMLSpanElement> & PropsWithChildren;

const badge = cva(
  "bg-zinc-50 border border-zinc-100 border-opacity-15 dark:bg-zinc-700 bg-opacity-5 text-zinc-800 dark:text-zinc-100 px-1 py-0.5 rounded-sm text-xs font-medium inline-block",
);

export type { Props as BadgeProps };

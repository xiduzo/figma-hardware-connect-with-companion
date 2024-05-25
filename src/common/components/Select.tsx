import React from "react";

import { cva } from "class-variance-authority";

export function Select({ children, className, ...props }: Props) {
  return (
    <select className={select({ className })} {...props}>
      {children}
    </select>
  );
}

const select = cva(
  "py-1.5 px-1 bg-stone-100 dark:bg-stone-800 text-zinc-800 dark:text-zinc-100 border border-zinc-100 hover:border-zinc-300 dark:border-stone-800 dark:hover:border-stone-700 focus:outline-blue-400",
);

type Props = React.InputHTMLAttributes<HTMLSelectElement>;

export type { Props as SelectProps };

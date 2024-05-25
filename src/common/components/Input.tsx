import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

export function Input({ className, ...props }: Props) {
  return <input className={input({ className })} {...props} />;
}

const input = cva(
  "py-1.5 px-1 disabled:opacity-50 bg-stone-100 dark:bg-stone-800 transition duration-150 placeholder:opacity-50 placeholder:font-light text-zinc-800 dark:text-zinc-100 border ring-0 focuse:outline",
  {
    variants: {
      hasError: {
        true: "border-red-700 outline-red-300",
        false:
          "border-zinc-100 border-b-zinc-300 hover:border-zinc-300 dark:border-stone-800 dark:border-b-stone-700 dark:hover:border-stone-700 focus:outline-blue-400",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  },
);

type Props = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof input>;

export type { Props as InputProps };

<input className="border-b-stone-400 font-extralight transition duration-200" />;

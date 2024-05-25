import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

export function Button({ children, className, intent, ...props }: Props) {
  return (
    <button className={button({ className, intent })} {...props}>
      {children}
    </button>
  );
}

const button = cva(
  "w-full px-2 py-1 transition-all duration-200 border border-transparent rounded-md disabled:opacity-50",
  {
    variants: {
      intent: {
        success: "text-white bg-green-500",
        info: "text-white bg-blue-500",
        warning: "text-white bg-yellow-500",
        danger: "text-white bg-red-500",
        plain:
          "text-zinc-800 border-zinc-800 dark:text-zinc-100 dark:border-zinc-100 dark:active:bg-zinc-50 active:bg-zinc-600 active:bg-opacity-5",
      },
    },
    defaultVariants: {
      intent: "plain",
    },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export type { Props as ButtonProps };

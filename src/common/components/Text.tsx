import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

export function Text({
  children,
  className,
  dimmed,
  as,
  intent,
  ...props
}: Props) {
  const Component = as ?? "p";
  return (
    <Component className={text({ className, dimmed, intent })} {...props}>
      {children}
    </Component>
  );
}

const text = cva("", {
  variants: {
    dimmed: {
      true: "opacity-60",
    },
    intent: {
      success: "text-emerald-600 dark:text-emerald-400",
      danger: "text-rose-600 dark:text-rose-400",
      warning: "text-amber-600 dark:text-amber-400",
      info: "text-sky-600 dark:text-sky-400",
      none: "text-zinc-800 dark:text-zinc-100",
    },
  },
  defaultVariants: {
    intent: "none",
  },
});

type Props = React.HtmlHTMLAttributes<HTMLElement> &
  VariantProps<typeof text> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p" | "div";
  };

export type { Props as TextProps };

import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

export function Text({
  children,
  className,
  dimmed,
  isError,
  as,
  ...props
}: Props) {
  const Component = as ?? "p";
  return (
    <Component className={text({ className, dimmed, isError })} {...props}>
      {children}
    </Component>
  );
}

const text = cva("", {
  variants: {
    dimmed: {
      true: "opacity-60",
    },
    isError: {
      true: "text-red-500",
      false: "text-zinc-900 dark:text-zinc-100",
    },
  },
  defaultVariants: {
    isError: false,
  },
});

type Props = React.HtmlHTMLAttributes<HTMLElement> &
  VariantProps<typeof text> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p" | "div";
  };

export type { Props as TextProps };

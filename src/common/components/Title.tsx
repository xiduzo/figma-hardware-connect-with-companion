import React from "react";

import { cva } from "class-variance-authority";
import { Text, type TextProps } from "./Text";

// Wrapper for semantics
export function Title({ as, ...props }: Props) {
  return (
    <Text
      {...props}
      as={as ?? "h1"}
      className={text({ className: props.className, intent: as ?? "h1" })}
    />
  );
}

type Props = TextProps & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

const text = cva("", {
  variants: {
    intent: {
      h1: "text-2xl",
      h2: "text-xl",
      h3: "text-lg",
      h4: "text-base",
      h5: "font-bold",
      h6: "font-bold",
    },
  },
});

export type { Props as TitleProps };

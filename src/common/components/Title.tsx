import React from "react";

import { Text, type TextProps } from "./Text";

// Wrapper for semantics
export function Title({ as, ...props }: Props) {
  return <Text {...props} as={as ?? "h1"} />;
}

type Props = TextProps & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export type { Props as TitleProps };

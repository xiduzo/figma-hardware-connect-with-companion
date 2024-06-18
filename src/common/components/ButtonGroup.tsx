import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { type PropsWithChildren } from "react";

export function ButtonGroup({ children, className, layout }: Props) {
  return (
    <section className={buttonGroup({ className, layout })}>{children}</section>
  );
}

const buttonGroup = cva("flex", {
  variants: {
    layout: {
      row: "flex-row items-center space-x-1.5",
      col: "flex-col items-start space-y-1.5",
    },
  },
  defaultVariants: {
    layout: "row",
  },
});

type Props = PropsWithChildren & { className?: string } & VariantProps<
    typeof buttonGroup
  >;

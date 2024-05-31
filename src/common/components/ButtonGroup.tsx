import { cva } from "class-variance-authority";
import React from "react";

import { type PropsWithChildren } from "react";

export function ButtonGroup({ children, className }: Props) {
  return <section className={buttonGroup({ className })}>{children}</section>;
}

const buttonGroup = cva("flex items-center space-x-1.5");

type Props = PropsWithChildren & { className?: string };

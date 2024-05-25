import React from "react";

import { type PropsWithChildren } from "react";

export function ButtonGroup({ children }: PropsWithChildren) {
  return (
    <section className="flex items-center space-x-1.5">{children}</section>
  );
}

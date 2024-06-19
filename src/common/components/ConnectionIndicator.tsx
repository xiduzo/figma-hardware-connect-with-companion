import React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { type PropsWithChildren } from "react";

export function ConnectionIndicator({
  children,
  isConnected,
  className,
}: Props) {
  return (
    <div className={container({ className })}>
      {children}
      <span className={connetionIndicator({ isConnected })}></span>
    </div>
  );
}

type Props = PropsWithChildren &
  VariantProps<typeof connetionIndicator> & { className?: string };

const container = cva("flex items-center space-x-1");

const connetionIndicator = cva("w-2 h-2 rounded-full", {
  variants: {
    isConnected: {
      true: "bg-green-400",
      false: "bg-red-400",
    },
  },
});

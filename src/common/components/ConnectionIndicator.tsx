import React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { type PropsWithChildren } from "react";

export function ConnectionIndicator({ children, isConnected }: Props) {
  return (
    <div className="flex items-center space-x-1">
      {children}
      <span className={connetionIndicator({ isConnected })}></span>
    </div>
  );
}

type Props = PropsWithChildren & VariantProps<typeof connetionIndicator>;

const connetionIndicator = cva("w-2 h-2 rounded-full", {
  variants: {
    isConnected: {
      true: "bg-green-400",
      false: "bg-red-400",
    },
  },
});

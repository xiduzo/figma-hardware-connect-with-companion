import React from "react";

import * as Icons from "@heroicons/react/24/outline";
import { cva } from "class-variance-authority";

export function Icon({ icon, className }: Props) {
  const Component = Icons[icon];

  return <Component className={iconStyle({ className })} />;
}

type Props = {
  icon: keyof typeof Icons;
  className?: string;
};

const iconStyle = cva("w-4 h-4 text-zinc-800 dark:text-zinc-100");

export type { Props as IconProps };

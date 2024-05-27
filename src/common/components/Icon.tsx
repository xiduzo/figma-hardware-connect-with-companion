import React from "react";

import * as Icons from "@heroicons/react/24/outline";
import { cva, type VariantProps } from "class-variance-authority";

export function Icon({ icon, intent, dimmed, className }: Props) {
  const Component = Icons[icon];

  return <Component className={iconStyle({ className, intent, dimmed })} />;
}

type Props = {
  icon: keyof typeof Icons;
  className?: string;
} & VariantProps<typeof iconStyle>;

const iconStyle = cva("w-4 h-4", {
  variants: {
    intent: {
      success: "text-emerald-600 dark:text-emerald-400",
      danger: "text-rose-600 dark:text-rose-400",
      warning: "text-amber-600 dark:text-amber-400",
      info: "text-sky-600 dark:text-sky-400",
      none: "text-zinc-800 dark:text-zinc-100",
    },
    dimmed: {
      true: "opacity-60",
    },
  },
  defaultVariants: {
    intent: "none",
  },
});

export type { Props as IconProps };

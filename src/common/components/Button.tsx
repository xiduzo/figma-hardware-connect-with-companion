import React from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { Icon, type IconProps } from "./Icon";

export function Button({ children, className, intent, icon, ...props }: Props) {
  return (
    <button
      className={button({ className, intent, hasIcon: !!icon })}
      {...props}
    >
      {icon && <Icon className="mr-2" icon={icon} />}
      {children}
    </button>
  );
}

const button = cva(
  "w-full px-2 py-1 transition-all duration-200 border border-transparent rounded-md disabled:opacity-50",
  {
    variants: {
      intent: {
        success: "text-white bg-green-500",
        info: "text-white bg-blue-500",
        warning: "text-white bg-yellow-500",
        danger: "text-white bg-red-500",
        plain:
          "text-zinc-800 border-zinc-800 dark:text-zinc-100 dark:border-zinc-100 dark:active:bg-zinc-50 active:bg-zinc-600 active:bg-opacity-5 dark:active:bg-opacity-5",
      },
      hasIcon: {
        true: "flex items-center justify-center",
      },
    },
    defaultVariants: {
      intent: "plain",
    },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> &
  Partial<Pick<IconProps, "icon">>;

export type { Props as ButtonProps };

import React from "react";

import { cva } from "class-variance-authority";
import { Icon, type IconProps } from "./Icon";

export function IconButton({ icon, className, ...buttonProps }: Props) {
  return (
    <button {...buttonProps} className={iconButton({ className })}>
      <Icon icon={icon} className={className} />
    </button>
  );
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & IconProps;

const iconButton = cva(
  "flex items-center justify-center p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700",
);

export type { Props as IconButtonProps };

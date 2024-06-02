import React from "react";

import { cva } from "class-variance-authority";
import { Icon, type IconProps } from "./Icon";
import { Text } from "./Text";

export function IconButton({
  icon,
  className,
  intent,
  text,
  ...buttonProps
}: Props) {
  return (
    <button {...buttonProps} className={iconButton({ className })}>
      <Icon icon={icon} intent={intent} />
      {text && <Text intent={intent}>{text}</Text>}
    </button>
  );
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  IconProps & {
    text?: string;
  };

const iconButton = cva(
  "flex items-center justify-center p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 space-x-2",
);

export type { Props as IconButtonProps };

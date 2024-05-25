import React from "react";

import { Icon, type IconProps } from "./Icon";

export function IconButton({ icon, ...buttonProps }: Props) {
  return (
    <button
      {...buttonProps}
      className="flex items-center justify-center p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
    >
      <Icon icon={icon} />
    </button>
  );
}

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & IconProps;

export type { Props as IconButtonProps };

import React from "react";

import { cva } from "class-variance-authority";

export function CheckBox({ className, ...props }: Props) {
  return (
    <input className={checkbox({ className })} {...props} type="checkbox" />
  );
}

const checkbox = cva("p-2 rounded-sm");

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export type { Props as CheckBoxProps };

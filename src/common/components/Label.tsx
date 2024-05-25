import React from "react";

import { cva } from "class-variance-authority";

export function Label({ children, className, ...props }: Props) {
  return (
    <label className={label({ className })} {...props}>
      {children}
    </label>
  );
}

const label = cva("");

type Props = React.HtmlHTMLAttributes<HTMLLabelElement>;

export type { Props as LabelProps };

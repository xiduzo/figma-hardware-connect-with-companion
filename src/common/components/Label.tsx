import React from "react";

import { cva, type VariantProps } from "class-variance-authority";

export function Label({ children, className, layout, ...props }: Props) {
  return (
    <label className={label({ className, layout })} {...props}>
      {children}
    </label>
  );
}

const label = cva("flex", {
  variants: {
    layout: {
      row: "flex-row items-center space-x-2",
      col: "flex-col space-y-0.5",
    },
  },
  defaultVariants: {
    layout: "col",
  },
});

type Props = React.HtmlHTMLAttributes<HTMLLabelElement> &
  VariantProps<typeof label>;

export type { Props as LabelProps };

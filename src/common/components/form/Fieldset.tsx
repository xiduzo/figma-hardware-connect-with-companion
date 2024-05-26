import React from "react";

import { cva } from "class-variance-authority";
import { type FieldsetHTMLAttributes, type PropsWithChildren } from "react";

export function Fieldset({ children, className, ...fieldsetProps }: Props) {
  return (
    <fieldset className={fieldSet({ className })} {...fieldsetProps}>
      {children}
    </fieldset>
  );
}

const fieldSet = cva("space-y-1");

type Props = React.DetailedHTMLProps<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  HTMLFieldSetElement
> &
  PropsWithChildren;

export type { Props as FieldsetProps };

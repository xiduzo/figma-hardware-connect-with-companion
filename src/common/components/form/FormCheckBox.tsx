import React from "react";

import { Controller, useFormContext } from "react-hook-form";
import { CheckBox, type CheckBoxProps } from "../CheckBox";
import { Label } from "../Label";
import { Text } from "../Text";
import { useFormFieldError } from "./hooks/useFormFieldError";

export function FormCheckBox({ name, label, ...checkBoxProps }: Props) {
  const { control } = useFormContext();
  const error = useFormFieldError(name);

  return (
    <Label layout="row">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CheckBox
            {...checkBoxProps}
            {...field}
            checked={Boolean(field.value)}
            className="mt-1.5"
          />
        )}
      />

      <div>
        <Text>{label ?? name}</Text>
        {error && (
          <Text className="text-red-500 dark:text-red-500">{error}</Text>
        )}
      </div>
    </Label>
  );
}

type Props = {
  name: string;
  label?: string;
} & CheckBoxProps;

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../Label";
import { Select, type SelectProps } from "../Select";
import { Text } from "../Text";
import { useFormFieldError } from "./hooks/useFormFieldError";

export function FormSelect({ name, label, ...inputProps }: Props) {
  const { control } = useFormContext();
  const error = useFormFieldError(name);

  return (
    <Label className="flex flex-col space-y-0.5">
      <Text dimmed>{label ?? name}</Text>
      {error && <Text intent={error ? "danger" : "none"}>{error}</Text>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => <Select {...inputProps} {...field} />}
      />
    </Label>
  );
}

type Props = {
  name: string;
  label?: string;
} & SelectProps;

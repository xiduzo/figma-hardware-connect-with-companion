import React from "react";

import { Controller, useFormContext } from "react-hook-form";
import { Input, type InputProps } from "../Input";
import { Label } from "../Label";
import { Text } from "../Text";
import { useFormFieldError } from "./hooks/useFormFieldError";

export function FormInput({ name, label, ...inputProps }: Props) {
  const { control } = useFormContext();
  const error = useFormFieldError(name);

  return (
    <Label className="flex flex-col">
      <Text dimmed>{label ?? name}</Text>
      {error && <Text intent={error ? "danger" : "none"}>{error}</Text>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...inputProps}
            {...field}
            onChange={(event) =>
              field.onChange(
                inputProps.type === "number"
                  ? +event.target.value
                  : event.target.value,
              )
            }
            hasError={!!error}
          />
        )}
      />
    </Label>
  );
}

type Props = {
  name: string;
  label?: string;
} & InputProps;

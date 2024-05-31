import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type PropsWithChildren } from "react";
import {
    FormProvider,
    useForm,
    type FieldValues,
    type SubmitErrorHandler,
    type UseFormProps,
} from "react-hook-form";
import type { Schema, z } from "zod";

export function ZodFormProvider<
  S extends z.Schema,
  F extends FieldValues = FieldValues,
>({ schema, onValid, onInvalid, children, ...useFormProps }: Props<S, F>) {
  const formMethods = useForm({
    ...useFormProps,
    resolver: zodResolver<S>(schema),
  });

  useEffect(() => {
    if (!useFormProps.defaultValues) return;

    formMethods.reset(useFormProps.defaultValues);
  }, [formMethods, useFormProps.defaultValues]);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onValid, onInvalid)}
        className="space-y-4"
      >
        {children}
      </form>
    </FormProvider>
  );
}

type Props<S extends Schema, Values extends FieldValues> = PropsWithChildren & {
  schema: S;
  onValid: (data: z.output<S>) => void | Promise<void>;
  onInvalid: SubmitErrorHandler<Values>;
} & Omit<UseFormProps<z.infer<S>>, "resolver">;

export type { Props as ZodFormProviderProps };


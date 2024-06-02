import React from "react";
import { z } from "zod";
import {
  Button,
  Fieldset,
  FormInput,
  FormSelect,
  TypeLabel,
} from "../../../components";
import { ZodFormProvider, type ZodFormProviderProps } from "../../../providers";
import { VARIABLE_RESOLVED_DATA_TYPES } from "../../../types";

const schema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  resolvedType: z.enum(VARIABLE_RESOLVED_DATA_TYPES),
});

type FormData = z.infer<typeof schema>;

export type { FormData as VariableFormData };

export function VariableForm({ defaultValues, ...props }: Props) {
  return (
    <ZodFormProvider
      schema={schema}
      defaultValues={{ resolvedType: "STRING", ...defaultValues }}
      {...props}
    >
      <Fieldset>
        <FormInput name="name" />
        <FormSelect name="resolvedType" label="type">
          {VARIABLE_RESOLVED_DATA_TYPES.map((type) => (
            <option key={type} value={type}>
              <TypeLabel resolvedType={type} />
            </option>
          ))}
        </FormSelect>
      </Fieldset>
      <Fieldset>
        <Button>{defaultValues?.id ? "Update" : "Create"} variable</Button>
      </Fieldset>
    </ZodFormProvider>
  );
}

type Props = {
  defaultValues?: Partial<FormData>;
} & Pick<
  ZodFormProviderProps<typeof schema, FormData>,
  "onValid" | "onInvalid"
>;

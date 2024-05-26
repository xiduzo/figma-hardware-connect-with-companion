import { useFormContext } from "react-hook-form";

export function useFormFieldError(name: string) {
  const { formState } = useFormContext();

  return formState.errors?.[name]?.message?.toString();
}

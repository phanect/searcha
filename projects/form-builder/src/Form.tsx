import _isEmpty from "lodash-es/isEmpty";
import { useForm } from "react-hook-form";

import AutoSave from "./AutoSave";
import FormFields from "./FormFields";
import SubmitButton from "./SubmitButton";
import SubmitError from "./SubmitError";
import useFormSettings from "./useFormSettings";
import type { BaseSyntheticEvent, ReactNode } from "react";
import type { FieldValues, UseFormProps } from "react-hook-form";
import type { ISubmitButtonProps } from "./SubmitButton";
import type { ISubmitErrorProps } from "./SubmitError";

import type { CustomComponents, Fields } from "./types";

export type IFormProps = {
  fields: Fields;
  values?: FieldValues;
  onSubmit: (
    values: FieldValues,
    event?: BaseSyntheticEvent<object, any, any>
  ) => void;
  customComponents?: CustomComponents;
  UseFormProps?: UseFormProps;

  autoSave?: boolean;
  hideSubmit?: boolean;
  SubmitButtonProps?: Partial<ISubmitButtonProps>;
  hideSubmitError?: boolean;
  SubmitErrorProps?: Partial<ISubmitErrorProps>;

  formHeader?: ReactNode;
  formFooter?: ReactNode;
};

export default function Form({
  fields,
  values,
  onSubmit,
  customComponents,
  UseFormProps = {},

  autoSave = false,
  hideSubmit = autoSave,
  SubmitButtonProps = {},
  hideSubmitError = false,
  SubmitErrorProps = {},

  formHeader,
  formFooter,
}: IFormProps) {
  const { defaultValues, resolver, setOmittedFields } = useFormSettings({
    fields,
    values,
    customComponents,
  });

  const methods = useForm({
    mode: autoSave ? "all" : "onBlur",
    defaultValues,
    resolver,
    shouldUnregister: true,
    ...UseFormProps,
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const hasErrors = errors
    ? (Object.values(errors).reduce(
      (a, c) => !!(a || !_isEmpty(c)),
      false
    ) as boolean)
    : false;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {autoSave && (
        <AutoSave
          control={control}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        />
      )}

      {formHeader}

      <FormFields
        fields={fields}
        control={control}
        customComponents={customComponents}
        useFormMethods={methods}
        setOmittedFields={setOmittedFields}
      />

      {formFooter}

      {!hideSubmit && (
        <SubmitButton disabled={hasErrors} {...SubmitButtonProps} />
      )}

      {!hideSubmitError && hasErrors && <SubmitError {...SubmitErrorProps} />}
    </form>
  );
}

import MultiSelect, { type MultiSelectProps } from "@phanect/searcha-multiselect";
import FieldAssistiveText from "../../FieldAssistiveText";
import type { IFieldComponentProps } from "../../types";

import type { ReactNode } from "react";

export type IMultiSelectComponentProps = {
  options: (string | { value: string; label: ReactNode; })[];
} & IFieldComponentProps & Omit<MultiSelectProps<string>, "value" | "onChange" | "options" | "label">;

export default function MultiSelectComponent({
  field: { onChange, onBlur, value, ref },
  fieldState,
  formState,

  name,
  useFormMethods,

  errorMessage,
  assistiveText,

  options = [],
  ...props
}: IMultiSelectComponentProps) {
  return (
    <MultiSelect
      {...(props as any)}
      multiple={true}
      options={options}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      onBlur={onBlur}
      TextFieldProps={{
        ...props.TextFieldProps,
        error: !!errorMessage,
        InputLabelProps: {
          required: props.required,
          ...props.TextFieldProps?.InputLabelProps,
        },
        FormHelperTextProps: {
          component: "div",
          ...props.TextFieldProps?.FormHelperTextProps,
        },
        helperText: (errorMessage || assistiveText) && (
          <>
            {errorMessage}

            <FieldAssistiveText
              style={{ margin: 0 }}
              disabled={!!props.disabled}
            >
              {assistiveText}
            </FieldAssistiveText>
          </>
        ),
        onBlur,
        "data-type": "multi-select",
        "data-label": props.label ?? "",
        inputRef: ref,
      }}
    />
  );
}

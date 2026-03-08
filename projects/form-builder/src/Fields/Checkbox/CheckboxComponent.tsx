import { Checkbox, FormControlLabel } from "@mui/material";

import FieldAssistiveText from "../../FieldAssistiveText";
import FieldErrorMessage from "../../FieldErrorMessage";
import type { CheckboxProps } from "@mui/material";
import type { IFieldComponentProps } from "../../types";

export type ICheckboxComponentProps = {} & IFieldComponentProps & Omit<
  CheckboxProps,
      "name" | "onChange" | "checked" | "ref" | "value" | "onBlur"
>;

export default function CheckboxComponent({
  field: { onChange, onBlur, value, ref },
  fieldState,
  formState,

  name,
  useFormMethods,

  label,
  errorMessage,
  assistiveText,

  required,

  ...props
}: ICheckboxComponentProps) {
  return (
    <FormControlLabel
      control={(
        <Checkbox
          {...props}
          checked={value}
          onChange={(e) => {
            onChange(e.target.checked);
            onBlur();
          }}
          inputProps={
            {
              "data-type": "checkbox",
              "data-label": label ?? "",
            } as any
          }
          sx={[
            {
              ".MuiFormControlLabel-root:not(.Mui-disabled):hover &": {
                bgcolor: "action.hover",
              },
            },
            ...(Array.isArray(props.sx)
              ? props.sx
              : props.sx
                ? [ props.sx ]
                : []),
          ]}
          inputRef={ref}
        />
      )}
      onBlur={onBlur}
      label={(
        <>
          {label}
          {required && <>&nbsp;*</>}

          <FieldErrorMessage>{errorMessage}</FieldErrorMessage>
          <FieldAssistiveText disabled={!!props.disabled}>
            {assistiveText}
          </FieldAssistiveText>
        </>
      )}
      sx={{ mr: 0, display: "flex" }}
    />
  );
}

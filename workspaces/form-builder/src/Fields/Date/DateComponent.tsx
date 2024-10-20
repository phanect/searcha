import { IFieldComponentProps } from '../../types';

import {
  LocalizationProvider,
  DatePicker,
  DatePickerProps,
} from '@mui/x-date-pickers';
import { TextFieldProps } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import FieldAssistiveText from '../../FieldAssistiveText';

export interface IDateComponentProps
  extends IFieldComponentProps,
    Omit<
      DatePickerProps<Date, true>,
      'label' | 'name' | 'onChange' | 'value' | 'ref'
    > {
  TextFieldProps: TextFieldProps;
}

export default function DateComponent({
  field: { onChange, onBlur, value, ref },
  fieldState,
  formState,

  name,
  useFormMethods,

  errorMessage,
  assistiveText,

  TextFieldProps,
  ...props
}: IDateComponentProps) {
  let transformedValue: any = null;
  if (value && 'toDate' in value) transformedValue = value.toDate();
  else if (value !== undefined) transformedValue = value;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        format="yyyy-MM-dd"
        {...props}
        value={transformedValue}
        onChange={onChange}
        onClose={onBlur}
        inputRef={ref}
        slotProps={{
          // https://github.com/mui-org/material-ui/issues/10341#issuecomment-770784016
          popper: {
            disablePortal: true
          },
          textField: {
            ...TextFieldProps,
            fullWidth: true,
            onBlur,
            error: TextFieldProps.error || !!errorMessage,
            FormHelperTextProps: { component: 'div' } as any,
            helperText: (errorMessage || assistiveText) && (
              <>
                {errorMessage}

                <FieldAssistiveText
                  style={{ margin: 0 }}
                  disabled={!!TextFieldProps.disabled}
                >
                  {assistiveText}
                </FieldAssistiveText>
              </>
            ),
            inputProps: {
              ...TextFieldProps.inputProps,
              required: false,
            },
            sx: {
              '& .MuiInputBase-input': { fontVariantNumeric: 'tabular-nums' },
              ...TextFieldProps?.sx,
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}

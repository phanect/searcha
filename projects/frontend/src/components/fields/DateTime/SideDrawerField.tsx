import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { setSeconds } from "date-fns";

import { DateTimePicker } from "@mui/x-date-pickers";
import { ChevronDown } from "@src/assets/icons";

import {
  transformValue,
  sanitizeValue,
} from "@src/components/fields/Date/utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { getFieldId } from "@src/components/SideDrawer/utils";

export interface IDateProps extends ISideDrawerFieldProps {}

export default function DateTime({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: IDateProps) {
  const format = column.config?.format ?? DATE_TIME_FORMAT;

  const transformedValue = transformValue(value);

  const handleChange = (date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (sanitized === undefined) return;
    onChange(sanitized);
  };

  return (
    <DateTimePicker
      slotProps={{
        textField: {
          fullWidth: true,
          label: "",
          hiddenLabel: true,
          "aria-label": column.name,
          sx: {
            "& .MuiInputBase-input": { fontVariantNumeric: "tabular-nums" },
            "& .MuiInputAdornment-root": { m: 0 },
          },
          // Touch mode: make the whole field clickable
          onClick: props.inputProps?.onClick,
          onBlur: onSubmit,
          id: getFieldId(column.key),
        },
        openPickerButton: {
          size: "small",
          sx: { width: 32, height: 32 },
        },
        tabs: {
          hidden: false,
        },
      }}
      label={column.name}
      value={transformedValue}
      onChange={(date: any) => handleChange(date ? setSeconds(date, 0) : null)}
      onAccept={onSubmit}
      format={format}
      mask={format.replace(/[A-Za-z]/g, "_")}
      slots={{ openPickerIcon: ChevronDown }}
      disableOpenPicker={false}
      disabled={disabled}
    />
  );
}

import { DatePicker } from "@mui/x-date-pickers";
import { ChevronDown } from "@src/assets/icons";

import { getFieldId } from "@src/components/SideDrawer/utils";
import { DATE_FORMAT } from "@src/constants/dates";
import { transformValue, sanitizeValue } from "./utils";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export type IDateProps = {} & ISideDrawerFieldProps;

export default function Date_({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: IDateProps) {
  const format = column.config?.format ?? DATE_FORMAT;

  const transformedValue = transformValue(value);

  const handleChange = (date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (sanitized === undefined) {
      return;
    }
    onChange(sanitized);
  };

  return (
    <DatePicker
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
          onBlur: onSubmit,
          id: getFieldId(column.key),
        },
        openPickerButton: {
          size: "small",
          sx: { width: 32, height: 32 },
        },
      }}
      label={column.name}
      value={transformedValue}
      onChange={handleChange}
      onAccept={onSubmit}
      format={format}
      slots={{ openPickerIcon: ChevronDown }}
      disableOpenPicker={false}
      disabled={disabled}
    />
  );
}

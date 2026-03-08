import { Box, Stack } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { ChevronDown } from "@src/assets/icons";

import {
  sanitizeValue,
  transformValue,
} from "@src/components/fields/Date/utils";
import { fieldSx, getFieldId } from "@src/components/SideDrawer/utils";
import { DATE_TIME_FORMAT } from "@src/constants/dates";
import { getDurationString } from "./utils";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function Duration({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const format = column.config?.format ?? DATE_TIME_FORMAT;

  const startValue = transformValue(value?.start);
  const endValue = transformValue(value?.end);

  const handleChange = (pos: "start" | "end") => (date: Date | null) => {
    const sanitized = sanitizeValue(date);
    if (sanitized === undefined) {
      return;
    }
    onChange({ start: startValue, end: endValue, [pos]: sanitized });
  };

  return (
    <>
      <Box
        sx={[ fieldSx, (!startValue || !endValue) && { color: "text.disabled" } ]}
        id={getFieldId(column.key)}
      >
        {startValue && endValue
          ? getDurationString(startValue, endValue)
          : "00h 00m 00s"}
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
        <DateTimePicker
          slotProps={{
            textField: {
              label: "Start",
              fullWidth: true,
              hiddenLabel: true,
              "aria-label": column.name,
              sx: {
                "& .MuiInputBase-input": { fontVariantNumeric: "tabular-nums" },
                "& .MuiInputAdornment-root": { m: 0 },
              },
              onBlur: onSubmit,
            },
            openPickerButton: {
              size: "small",
            },
            tabs: {
              hidden: false,
            },
          }}
          label={column.name + ": Start"}
          value={startValue}
          onChange={handleChange("start")}
          onAccept={onSubmit}
          format={format}
          slots={{ openPickerIcon: ChevronDown }}
          disableOpenPicker={false}
          disabled={disabled}
        />

        <DateTimePicker
          slotProps={{
            textField: {
              fullWidth: true,
              label: "End",
              hiddenLabel: true,
              "aria-label": column.name,
              sx: {
                "& .MuiInputBase-input": { fontVariantNumeric: "tabular-nums" },
                "& .MuiInputAdornment-root": { m: 0 },
              },
              onBlur: onSubmit,
            },
            openPickerButton: {
              size: "small",
            },
            tabs: {
              hidden: false,
            },
          }}
          label={column.name + ": End"}
          value={endValue}
          onChange={handleChange("end")}
          onAccept={onSubmit}
          format={format}
          slots={{ openPickerIcon: ChevronDown }}
          disableOpenPicker={false}
          disabled={disabled}
        />
      </Stack>
    </>
  );
}

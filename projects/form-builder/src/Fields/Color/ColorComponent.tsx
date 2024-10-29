import { useRef, useState } from "react";
import type { IFieldComponentProps } from "../../types";
import { ColorPicker, ColorService } from "react-color-palette";
import "react-color-palette/css";

import {
  TextField,
  InputAdornment,
  Box,
  IconButton,
  Popover,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";

import FieldAssistiveText from "../../FieldAssistiveText";
import type {
  TextFieldProps } from "@mui/material";

export type IColorComponentProps = {
  enableAlpha?: boolean;
  TextFieldProps?: Partial<TextFieldProps>;
} & IFieldComponentProps;

export default function ColorComponent({
  field: { onChange, onBlur, value, ref },

  label,
  errorMessage,
  assistiveText,

  required,
  disabled,

  enableAlpha,
  TextFieldProps,
}: IColorComponentProps) {
  const anchorEl = useRef<HTMLDivElement>(null);
  const [ open, setOpen ] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <TextField
        fullWidth
        InputProps={{
          startAdornment: value?.hex && (
            <InputAdornment position="start">
              <Box
                sx={{
                  width: 20,
                  height: 20,

                  boxShadow: (theme) =>
                    `0 0 0 1px ${ theme.palette.action.disabled } inset`,
                  borderRadius: "50%",

                  backgroundColor: value.hex,
                }}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleOpen}
                aria-label="Open color picker"
                edge="end"
                disabled={disabled}
              >
                <PaletteIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onClick={handleOpen}
        {...TextFieldProps}
        value={value?.hex}
        label={label}
        inputProps={{ readOnly: true, required: false }}
        error={!!errorMessage}
        helperText={
          (errorMessage || assistiveText) && (
            <>
              {errorMessage}

              <FieldAssistiveText style={{ margin: 0 }} disabled={!!disabled}>
                {assistiveText}
              </FieldAssistiveText>
            </>
          )
        }
        required={required}
        disabled={disabled}
        ref={anchorEl}
        inputRef={ref}
      />
      {!disabled && anchorEl.current && (
        <Popover
          open={open}
          anchorEl={anchorEl.current}
          onClose={() => {
            setOpen(false);
            onBlur();
          }}
          PaperProps={{ "data-type": "color-picker" } as any}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <ColorPicker
            height={180}
            color={value?.hex ? value : ColorService.convert("hex", "#fff")}
            onChange={onChange}
            hideAlpha={!enableAlpha}
          />
        </Popover>
      )}
    </>
  );
}

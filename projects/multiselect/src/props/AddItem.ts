import type { ButtonProps } from "@mui/material";
import type { PopupContentsProps } from "./PopupContents";

export type AddItemProps = {
  multiple: boolean;
  value: PopupContentsProps<string>["value"];
  onChange: PopupContentsProps<string>["onChange"];
  disabled?: boolean;
  AddButtonProps?: Partial<ButtonProps> & {
    singleIcon?: React.ReactNode;
    multipleIcon?: React.ReactNode;
  };
  AddDialogProps?: {
    title?: React.ReactNode;
    textFieldLabel?: React.ReactNode;
    cancelButtonLabel?: React.ReactNode;
    addButtonLabel?: React.ReactNode;
  };
};

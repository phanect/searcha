import type { ParamsDialogProps } from "./Dialog.tsx";

export interface IActionParams {
  dialogProps?: ParamsDialogProps;
  handleClose: () => void;
  open: boolean;
  requestParams: (props: ParamsDialogProps) => void;
}
export const CONFIRMATION_EMPTY_STATE = {
  dialogProps: undefined,
  open: false,
  handleClose: () => {},
  requestParams: () => {},
};

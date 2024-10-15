import { useState, type FC, type ReactNode } from "react";

import Dialog, { type ParamsDialogProps } from "./Dialog";
import ActionParamsContext from "./Context";
interface IActionParamsProviderProps {
  children: ReactNode;
}

const ActionParamsProvider: FC<IActionParamsProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<ParamsDialogProps>();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setState(undefined);
    setOpen(false);
  };
  const requestParams = (props: ParamsDialogProps) => {
    setState(props);
    setOpen(true);
  };
  return (
    <ActionParamsContext.Provider
      value={{
        dialogProps: state,
        open,
        handleClose,
        requestParams,
      }}
    >
      {children}

      {state && <Dialog {...state} open={open} handleClose={handleClose} />}
    </ActionParamsContext.Provider>
  );
};

export default ActionParamsProvider;

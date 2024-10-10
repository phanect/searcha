import { useContext, useEffect, useState } from "react";
import { useAtom, type createStore } from "jotai";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import MemoizedText from "@src/components/Modal/MemoizedText";

import { ProjectScopeContext, confirmDialogAtom } from "@src/atoms/projectScope";

export type IConfirmDialogProps = {
  store?: ReturnType<typeof createStore>;
};

/**
 * Display a confirm dialog using `confirmDialogAtom` in `globalState`
 * @see {@link confirmDialogAtom | Usage example}
 */
export default function ConfirmDialog({
  store = useContext(ProjectScopeContext),
}: IConfirmDialogProps) {
  const [
    {
      open,

      title = "Are you sure?",
      body,

      handleConfirm,
      confirm = "Confirm",
      confirmationCommand,
      confirmColor,

      handleCancel,
      cancel = "Cancel",
      hideCancel,

      maxWidth = "xs",
      buttonLayout = "horizontal",
    },
    setState,
  ] = useAtom(confirmDialogAtom, { store });

  const handleClose = () => {
    setState({ open: false });
    setDisableConfirm(false);
  };

  const [disableConfirm, setDisableConfirm] = useState(
    Boolean(confirmationCommand)
  );
  useEffect(() => {
    setDisableConfirm(Boolean(confirmationCommand));
  }, [confirmationCommand]);

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        else handleClose();
      }}
      maxWidth={maxWidth}
      sx={{ cursor: "default", zIndex: (theme) => theme.zIndex.modal + 50 }}
    >
      <>
        <MemoizedText>
          <DialogTitle>{title}</DialogTitle>
        </MemoizedText>

        <MemoizedText>
          <DialogContent>
            {typeof body === "string" ? (
              <DialogContentText>{body}</DialogContentText>
            ) : (
              body
            )}

            {confirmationCommand && (
              <TextField
                onChange={(e) =>
                  setDisableConfirm(e.target.value !== confirmationCommand)
                }
                label={`Type “${confirmationCommand}” below to continue:`}
                placeholder={confirmationCommand}
                fullWidth
                id="dryText"
                sx={{ mt: 3 }}
              />
            )}
          </DialogContent>
        </MemoizedText>

        <DialogActions
          sx={[
            buttonLayout === "vertical" && {
              flexDirection: "column",
              alignItems: "stretch",
              "& > :not(:first-of-type)": { ml: 0, mt: 1 },
            },
          ]}
        >
          <MemoizedText>
            {!hideCancel && (
              <Button
                onClick={() => {
                  if (handleCancel) handleCancel();
                  handleClose();
                }}
              >
                {cancel}
              </Button>
            )}
          </MemoizedText>

          <MemoizedText key={disableConfirm.toString()}>
            <Button
              onClick={() => {
                if (handleConfirm) handleConfirm();
                handleClose();
              }}
              color={confirmColor || "primary"}
              variant="contained"
              autoFocus
              disabled={disableConfirm}
            >
              {confirm}
            </Button>
          </MemoizedText>
        </DialogActions>
      </>
    </Dialog>
  );
}

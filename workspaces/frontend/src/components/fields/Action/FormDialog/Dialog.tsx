import { FormDialog } from "@phanect/datasheet-form-builder";

export type ParamsDialogProps = {
  column: any;
  row: any;
  handleRun: (actionParams: any) => void;
};

export default function ParamsDialog({
  column,
  handleRun,
  open,
  handleClose,
}: any) {
  if (!open) return null;
  return (
    <FormDialog
      onClose={handleClose}
      title={`${column.name as string}`}
      fields={column.config.params}
      values={{}}
      onSubmit={handleRun}
      SubmitButtonProps={{ children: "Run" }}
    />
  );
}

import { FormDialog, type IFormDialogProps } from "@phanect/datasheet-form-builder";
import type { ColumnConfig } from "@src/types/table.d.ts";

export type ParamsDialogProps = {
  column: ColumnConfig;
  row: any;
  handleRun: IFormDialogProps["onSubmit"];
  open?: boolean;
  handleClose?: IFormDialogProps["onClose"];
};

export default function ParamsDialog({
  column,
  handleRun,
  open,
  handleClose,
}: ParamsDialogProps) {
  if (!open) return null;
  return (
    <FormDialog
      onClose={handleClose}
      title={`${column.name as string}`}
      fields={column.config?.params}
      values={{}}
      onSubmit={handleRun}
      SubmitButtonProps={{ children: "Run" }}
    />
  );
}

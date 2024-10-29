import EditorCellTextField from "@src/components/Table/TableCell/EditorCellTextField";
import type { IEditorCellProps } from "@src/components/fields/types";

export default function LongText(props: IEditorCellProps<string>) {
  return <EditorCellTextField {...props} InputProps={{ multiline: true }} />;
}

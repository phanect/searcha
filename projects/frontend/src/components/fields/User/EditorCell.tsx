import UserSelect from "./UserSelect";
import type { IEditorCellProps } from "@src/components/fields/types";

export default function EditorCell({ ...props }: IEditorCellProps) {
  return <UserSelect {...props} />;
}

import RichTextEditor from "@src/components/RichTextEditor";
import { getFieldId } from "@src/components/SideDrawer/utils";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function RichText({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
  _rowy_ref,
}: ISideDrawerFieldProps) {
  return (
    <RichTextEditor
      disabled={disabled}
      value={value}
      onChange={onChange}
      onBlur={onSubmit}
      id={getFieldId(column.key)}
      _rowy_ref={_rowy_ref}
      column={column}
    />
  );
}

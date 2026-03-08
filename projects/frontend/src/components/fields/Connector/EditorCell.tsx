import Loading from "@src/components/Loading";
import { Suspense } from "react";

import PopupContents from "./Select/PopupContents";
import type { IEditorCellProps } from "@src/components/fields/types";

export default function Connector({
  value,
  onChange,
  column,
  disabled,
  _rowy_ref,
}: IEditorCellProps) {
  return (
    <Suspense fallback={<Loading />}>
      <PopupContents
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        column={column}
        disabled={disabled}
        _rowy_ref={_rowy_ref}
      />
    </Suspense>
  );
}

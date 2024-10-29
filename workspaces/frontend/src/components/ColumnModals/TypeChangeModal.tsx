import { useContext, useState } from "react";
import { useSetAtom } from "jotai";

import Modal from "@src/components/Modal";
import { Alert, AlertTitle, Typography } from "@mui/material";

import { TableScopeContext, updateColumnAtom } from "@src/atoms/tableScope";
import { getFieldProp } from "@src/components/fields";
import { analytics, logEvent } from "@src/analytics";
import FieldsDropdown from "./FieldsDropdown";
import type { FieldType } from "@src/constants/fields";
import type { IColumnModalProps } from ".";

export default function TypeChangeModal({
  onClose,
  column,
}: IColumnModalProps) {
  const tableScopeStore = useContext(TableScopeContext);
  const updateColumn = useSetAtom(updateColumnAtom, { store: tableScopeStore });
  const [ newType, setType ] = useState<FieldType>(column.type);

  return (
    <Modal
      onClose={onClose}
      title="Change column type"
      children={(
        <>
          <FieldsDropdown value={newType} onChange={setType} />

          {getFieldProp("dataType", column.type)
          !== getFieldProp("dataType", newType) && (
            <Alert severity="warning">
              <AlertTitle>Potential data loss</AlertTitle>
              <Typography>
                {getFieldProp("name", newType)} has an incompatible data type.
                Selecting this can result in data loss.
              </Typography>

              <dl
                style={{
                  marginBottom: 0,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, max-content)",
                  columnGap: 4,
                }}
              >
                <Typography component="dt">Previous:</Typography>
                <Typography component="dd">
                  <code>{getFieldProp("dataType", column.type)}</code>
                </Typography>

                <Typography component="dt">
                  {getFieldProp("name", newType)}:
                </Typography>
                <Typography component="dd">
                  <code>{getFieldProp("dataType", column.type)}</code>
                </Typography>
              </dl>
            </Alert>
          )}
        </>
      )}
      actions={{
        primary: {
          onClick: () => {
            const prevType = column.type;
            updateColumn({ key: column.key, config: { type: newType }});
            onClose();
            logEvent(analytics, "change_column_type", { newType, prevType });
          },
          children: "Update",
        },
      }}
      maxWidth="xs"
    />
  );
}

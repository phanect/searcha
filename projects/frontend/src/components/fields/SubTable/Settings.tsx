import MultiSelect from "@phanect/searcha-multiselect";
import { tableColumnsOrderedAtom, TableScopeContext } from "@src/atoms/tableScope";
import { FieldType } from "@src/constants/fields";

import { useAtom } from "jotai";
import { useContext } from "react";
import type { ISettingsProps } from "@src/components/fields/types";

const Settings = ({ config, onChange }: ISettingsProps) => {
  const tableScopeStore = useContext(TableScopeContext);
  const [ tableOrderedColumns ] = useAtom(tableColumnsOrderedAtom, { store: tableScopeStore });

  const columnOptions = tableOrderedColumns
    .filter((column) =>
      [
        FieldType.shortText,
        FieldType.singleSelect,
        FieldType.email,
        FieldType.phone,
      ].includes(column.type)
    )
    .map((c) => ({ label: c.name, value: c.key }));

  return (
    <MultiSelect
      label="Parent label"
      options={columnOptions}
      value={config.parentLabel ?? []}
      onChange={onChange("parentLabel")}
    />
  );
};
export default Settings;

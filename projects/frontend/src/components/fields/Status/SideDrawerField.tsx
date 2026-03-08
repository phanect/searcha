import MultiSelect from "@phanect/searcha-multiselect";

import { getFieldId } from "@src/components/SideDrawer/utils";
import getLabel from "./utils/getLabelHelper";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function Status({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const config = column.config ?? {};

  return (
    <MultiSelect
      value={getLabel(value, config?.conditions)}
      onChange={onChange}
      options={config?.conditions ?? []}
      multiple={false}
      freeText={config?.freeText}
      disabled={disabled}
      TextFieldProps={{
        label: "",
        hiddenLabel: true,
        onBlur: onSubmit,
        id: getFieldId(column.key),
      }}
      onClose={onSubmit}
    />
  );
}

import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

export const RadioSettings: IFieldConfig["settings"] = [
  {
    type: FieldType.list,
    name: "options",
    label: "Options",
    defaultValue: [],
  },
];

export default RadioSettings;

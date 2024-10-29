import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

export const ContentSubHeaderSettings: IFieldConfig["settings"] = [
  {
    name: "label",
    label: "Sub-Header",
    type: FieldType.shortText,
    required: true,
    defaultValue: "",
  },
];

export default ContentSubHeaderSettings;

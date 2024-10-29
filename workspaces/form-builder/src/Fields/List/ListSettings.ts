import { FieldType } from "../../constants/fields";
import type { IFieldConfig } from "../../types";

export const ListSettings: IFieldConfig["settings"] = [
  {
    type: FieldType.shortText,
    name: "placeholder",
    label: "Placeholder",
    defaultValue: "",
  },
  {
    type: FieldType.shortText,
    name: "itemLabel",
    label: "Item Label",
    defaultValue: "",
  },
];

export default ListSettings;

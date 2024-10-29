import { lazy } from "react";
import FormatHeader1 from "mdi-material-ui/FormatHeader1";
import { FieldType } from "../../constants/fields";

import Settings from "./ContentHeaderSettings";
import type { IFieldConfig } from "../../types";
const Component = lazy(
  () =>
    import(
      "./ContentHeaderComponent"
    )
);

export const ContentHeaderConfig: IFieldConfig = {
  type: FieldType.contentHeader,
  name: "Header",
  group: "content",
  icon: <FormatHeader1 />,
  dataType: "undefined",
  defaultValue: undefined,
  component: Component,
  settings: Settings,
};
export default ContentHeaderConfig;

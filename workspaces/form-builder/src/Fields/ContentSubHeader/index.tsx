import { lazy } from "react";
import FormatHeader2 from "mdi-material-ui/FormatHeader2";
import { FieldType } from "../../constants/fields";

import Settings from "./ContentSubHeaderSettings";
import type { IFieldConfig } from "../../types";
const Component = lazy(
  () =>
    import(
      "./ContentSubHeaderComponent"
    )
);

export const ContentSubHeaderConfig: IFieldConfig = {
  type: FieldType.contentSubHeader,
  name: "Sub-Header",
  group: "content",
  icon: <FormatHeader2 />,
  dataType: "undefined",
  defaultValue: undefined,
  component: Component,
  settings: Settings,
};
export default ContentSubHeaderConfig;

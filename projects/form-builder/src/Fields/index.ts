import { find } from "lodash-es";

import Checkbox from "./Checkbox";
import Color from "./Color";
import Hidden from "./Hidden";

import ContentHeader from "./ContentHeader";
import ContentSubHeader from "./ContentSubHeader";
import ContentParagraph from "./ContentParagraph";
import ContentImage from "./ContentImage";
import Date from "./Date";
import DateTime from "./DateTime";
import List from "./List";
import MultiSelect from "./MultiSelect";
import Paragraph from "./Paragraph";
import Radio from "./Radio";
import Score from "./Score";
import ShortText from "./ShortText";
import SingleSelect from "./SingleSelect";
import Slider from "./Slider";
import type { FieldType } from "../constants/fields.ts";
import type { IFieldConfig } from "../types";

export const FieldConfigs: IFieldConfig[] = [
  ShortText,
  Paragraph,
  Date,
  DateTime,
  Checkbox,
  Radio,
  SingleSelect,
  MultiSelect,
  Slider,
  List,
  Color,
  Score,
  Hidden,

  ContentHeader,
  ContentSubHeader,
  ContentParagraph,
  ContentImage,
];

/**
 * Returns specific property of field config
 * @param prop
 * @param fieldType
 */
export const getFieldProp = <Prop extends keyof IFieldConfig>(
  prop: Prop,
  fieldType: FieldType,
): IFieldConfig[Prop] | undefined => {
  const field = find(FieldConfigs, { type: fieldType });
  return field?.[prop];
};

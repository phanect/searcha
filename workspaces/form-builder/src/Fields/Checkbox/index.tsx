import { lazy } from 'react';
import { boolean } from "yup";
import type { IFieldConfig } from '../../types';
import { FieldType } from '../../constants/fields';

import CheckboxMarked from 'mdi-material-ui/CheckboxMarked';

const Component = lazy(
  () =>
    import('./CheckboxComponent')
);

export const CheckboxConfig: IFieldConfig = {
  type: FieldType.checkbox,
  name: 'Checkbox',
  group: 'input',
  icon: <CheckboxMarked />,
  dataType: 'boolean',
  defaultValue: false,
  component: Component,
  settings: [],
  validation: (config) => {
    let schema = boolean();

    if (config.required === true)
      schema = schema.oneOf([ true ], "Please tick the box");

    return schema;
  },
};
export default CheckboxConfig;

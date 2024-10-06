import { lazy } from 'react';
import type { IFieldConfig } from '../../types';
import { FieldType } from '../../constants/fields';
import { array, string } from 'yup';

import FormatListNumbered from 'mdi-material-ui/FormatListNumbered';

import Settings from './ListSettings';
const Component = lazy(
  () => import('./ListComponent')
);

export const ListConfig: IFieldConfig = {
  type: FieldType.list,
  name: 'List',
  group: 'input',
  icon: <FormatListNumbered />,
  dataType: 'string[]',
  defaultValue: [],
  component: Component,
  settings: Settings,
  validation: (config) => {
    let schema = array(string().trim())
      .ensure()
      .compact();

    if (config.required === true)
      schema = schema.min(1, `${config.label || config.name} is required`);

    return schema;
  },
};
export default ListConfig;

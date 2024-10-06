import { isEqual, pickBy, set } from "lodash-es";
import { getFieldProp } from './Fields';

import { FieldValues } from 'react-hook-form';
import {
  object,
  type Flags,
  type ObjectShape,
  type Schema,
} from "yup";
import type { Fields, CustomComponents } from './types';

/**
 * Creates a single object with all default values of the fields
 * @param fields Fields used in the form
 * @param customComponents Custom components used in the form
 */
export const getDefaultValues = (
  fields: Fields,
  customComponents?: CustomComponents,
  mergeValues?: FieldValues
): FieldValues => {
  const defaultValues: FieldValues = {};

  for (const field of fields) {
    if (!field || !field.name || !field.type) continue;

    let defaultValue: any;

    // Get default value if specified in field declaration
    if (field.defaultValue !== undefined) {
      defaultValue = field.defaultValue;
    }
    // Get default value from customComponents
    else if (!!customComponents && field.type in customComponents) {
      defaultValue = customComponents[field.type].defaultValue;
    }
    // Get default value from built-in components
    else {
      defaultValue = getFieldProp('defaultValue', field.type);
    }

    // If undefined, do not add to defaultValues
    // Prevents content fields returning a value
    if (defaultValue === undefined) continue;

    // Use lodash set to support nested fields, e.g. `cloudBuild.branch`
    set(defaultValues, field.name, defaultValue);
  }

  return { ...defaultValues, ...mergeValues };
};

/**
 * Creates a Yup object schema to validate the entire form
 * @param fields Fields used in the form
 * @param customComponents Custom components used in the form
 */
export const getValidationSchema = (
  fields: Fields,
  customComponents?: CustomComponents
) => {
  const objectShape: ObjectShape = {};

  for (const field of fields) {
    if (!field || !field.name) continue;

    let schema: Schema<unknown, unknown, unknown, Flags> | undefined;

    if (customComponents?.[field.type]) {
      // Get default validation from customComponents
      schema = customComponents[field.type].validation;
    } else {
      // Get default validation from built-in components
      const schemaFn = getFieldProp('validation', field.type);
      if (schemaFn) schema = schemaFn(field);
    }

    // If we intentionally don’t validate this field, e.g. content fields:
    if (!schema) continue;

    // Add the required validation message for all field types
    if (field.required === true)
      schema = schema.required(`${field.label || field.name} is required`);

    if (field.validation)
      schema = schema.concat(field.validation);

    // Use lodash set to support nested fields, e.g. `cloudBuild.branch`
    set(objectShape, field.name, schema);
  }

  return object().shape(objectShape);
};

/**
 * Gets the form values that have changed
 * @param current Current form values
 * @param changed Changed form values (a subset of form values)
 * @returns An object with only the form values that changed
 */
export const diffChanges = (
  current: { [key: string]: any },
  changed: { [key: string]: any }
): { [key: string]: any } => {
  return pickBy<{ [key: string]: any }>(changed, (val, key) => !isEqual(val, current[key]));
};

/**
 * Stubs Controller render props
 */
export const controllerRenderPropsStub: any = {
  field: {
    onChange: () => {},
    onBlur: () => {},
    ref: undefined as any,
  },
  fieldState: {},
  formState: {},
};

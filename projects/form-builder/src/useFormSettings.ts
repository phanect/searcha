import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useReducer } from "react";
import { getDefaultValues, getValidationSchema } from "./utils";
import type { FieldValues } from "react-hook-form";

import type { CustomComponents, Fields } from "./types";

const reducer = (
  state: string[],
  action: { name: string; type: "omit" | "unOmit"; }
) => {
  switch (action.type) {
    case "omit":
      if (!state.includes(action.name)) {
        const newState = [ ...state ];
        newState.push(action.name);
        return newState;
      }
      break;

    case "unOmit":
      if (state.includes(action.name)) {
        const newState = new Set(state);
        newState.delete(action.name);
        return Array.from(newState);
      }
      break;

    default:
      break;
  }

  return state;
};

export type IUseFormSettingsProps = {
  fields: Fields;
  values?: FieldValues;

  customComponents?: CustomComponents;
};

export function useFormSettings({
  fields,
  values,
  customComponents,
}: IUseFormSettingsProps) {
  const defaultValues = getDefaultValues(fields, customComponents, values);

  const [ omittedFields, setOmittedFields ] = useReducer(reducer, []);

  const fieldsWithOmissions = useMemo(
    () => fields.filter(({ name }) => !omittedFields.includes(name ?? "")),
    [ omittedFields, fields ]
  );

  const resolver = yupResolver(
    getValidationSchema(fieldsWithOmissions, customComponents)
  );

  return { defaultValues, resolver, setOmittedFields };
}

export default useFormSettings;

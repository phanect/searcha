import { useContext } from "react";
import MultiSelect from "@phanect/searcha-multiselect";
import { ListItemIcon, Typography } from "@mui/material";
import Fuse from 'fuse.js';

import { FIELDS, getFieldProp } from "@src/components/fields";

import { useSetAtom, useAtom } from "jotai";
import {
  ProjectScopeContext,
  projectSettingsAtom,
  rowyRunModalAtom,
} from "@src/atoms/projectScope";
import { TableScopeContext, tableSettingsAtom } from "@src/atoms/tableScope";
import type { FieldType } from "@src/constants/fields";

export type IFieldsDropdownProps = {
  value: FieldType | "";
  onChange: (value: FieldType) => void;
  hideLabel?: boolean;
  label?: string;
  options?: FieldType[];

  [key: string]: any;
};

export interface OptionsType {
  label: string;
  value: string;
  disabled: boolean;
  requireCloudFunctionSetup: boolean;
  requireCollectionTable: boolean;
  keywords: string[];
}

/**
 * Returns dropdown component of all available types
 * @param root0
 * @param root0.value
 * @param root0.onChange
 * @param root0.hideLabel
 * @param root0.label
 * @param root0.options
 */
export default function FieldsDropdown({
  value,
  onChange,
  hideLabel = false,
  label,
  options: optionsProp,
  ...props
}: IFieldsDropdownProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const tableScopeStore = useContext(TableScopeContext);
  const [ projectSettings ] = useAtom(projectSettingsAtom, { store: projectScopeStore });
  const openRowyRunModal = useSetAtom(rowyRunModalAtom, { store: projectScopeStore });
  const [ tableSettings ] = useAtom(tableSettingsAtom, { store: tableScopeStore });
  const fieldTypesToDisplay = optionsProp
    ? FIELDS.filter((fieldConfig) => optionsProp.includes(fieldConfig.type))
    : FIELDS;
  const options = fieldTypesToDisplay.map((fieldConfig) => {
    const requireCloudFunctionSetup
      = fieldConfig.requireCloudFunction && !projectSettings.rowyRunUrl;
    const requireCollectionTable
      = tableSettings.isCollection === false
      && fieldConfig.requireCollectionTable === true;
    return {
      label: fieldConfig.name,
      value: fieldConfig.type,
      disabled: requireCloudFunctionSetup || requireCollectionTable,
      requireCloudFunctionSetup,
      requireCollectionTable,
      keywords: fieldConfig.keywords || []
    };
  });

  const filterOptions = (options: OptionsType[], inputConfig: any) => {
    const fuse = new Fuse(options, {
      keys: [{name:'label', weight: 2}, 'keywords'],
      includeScore: true,
      threshold: 0.4,
    });

    const results = fuse.search(inputConfig?.inputValue);
    return results.length > 0 ? results.map((result) => result.item) : options;
  }

  return (
    <MultiSelect
      multiple={false}
      {...props}
      value={value ? value : ""}
      onChange={onChange}
      options={options}
      {...({
        AutocompleteProps: {
          groupBy: (option: typeof options[number]) =>
            getFieldProp("group", option.value),
          ListboxProps: {
            sx: {
              "& li.MuiAutocomplete-option[aria-disabled=\"true\"]": {
                opacity: 1,
              },
              "& li.MuiAutocomplete-option[aria-disabled=\"true\"] > *": {
                opacity: 0.4,
              },
              "& li.MuiAutocomplete-option[aria-disabled=\"true\"] > .require-cloud-function":
                {
                  opacity: 1,
                },
            },
          },
          filterOptions
        },
      } as any)}
      itemRenderer={(option) => (
        <>
          <ListItemIcon style={{ minWidth: 40 }}>
            {getFieldProp("icon", option.value as FieldType)}
          </ListItemIcon>
          <Typography>{option.label}</Typography>
          {option.requireCollectionTable ? (
            <Typography
              color="error"
              variant="inherit"
              component="span"
              marginLeft={1}
              className="require-cloud-function"
            >
              {" "}
              Unavailable
            </Typography>
          ) : option.requireCloudFunctionSetup ? (
            <Typography
              color="error"
              variant="inherit"
              component="span"
              marginLeft={1}
              className="require-cloud-function"
            >
              {" "}
              Requires
              <span
                style={{
                  marginLeft: "3px",
                  cursor: "pointer",
                  pointerEvents: "all",
                  textDecoration: "underline",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openRowyRunModal({ feature: option.label });
                }}
              >
                Cloud Function
              </span>
            </Typography>
          ) : null}
        </>
      )}
      label={label || "Field type"}
      labelPlural="field types"
      TextFieldProps={{
        hiddenLabel: hideLabel,
        helperText: value && getFieldProp("description", value),
        ...props.TextFieldProps,
        SelectProps: {
          displayEmpty: true,
          renderValue: () => (
            <>
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  verticalAlign: "text-bottom",
                  "& svg": { my: -0.5 },
                }}
              >
                {getFieldProp("icon", value as FieldType)}
              </ListItemIcon>
              {getFieldProp("name", value as FieldType)}
            </>
          ),
          ...props.TextFieldProps?.SelectProps,
        },
      }}
    />
  );
}

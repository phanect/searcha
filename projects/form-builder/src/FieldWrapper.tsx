import { createElement, Suspense } from "react";
import { Controller } from "react-hook-form";

import { Grid } from "@mui/material";
import FieldSkeleton from "./FieldSkeleton";

import { getFieldProp } from "./Fields";

import { controllerRenderPropsStub } from "./utils";
import type { IFormFieldsProps } from "./FormFields";
import type { Field, CustomComponent } from "./types";

export type IFieldWrapperProps = {
  index: number;
  disabledConditional?: boolean;
} & Field & Omit<IFormFieldsProps, "fields">;

/**
 * Finds the corresponding component for the field type and wraps it with
 * Controller.
 * @param root0
 * @param root0.control
 * @param root0.name
 * @param root0.label
 * @param root0.type
 * @param root0.customComponents
 * @param root0.gridCols
 * @param root0.disablePadding
 * @param root0.disablePaddingTop
 * @param root0.disabledConditional
 * @param root0.defaultValue
 * @param root0.setOmittedFields
 */
export default function FieldWrapper({
  control,
  name,
  label,
  type,
  customComponents,
  gridCols = 12,
  disablePadding,
  disablePaddingTop,
  disabledConditional,
  defaultValue: defaultValueProp,
  setOmittedFields,
  ...props
}: IFieldWrapperProps) {
  if (!type) {
    console.error(`Invalid field type: ${ type }`, props);
    return null;
  }

  let fieldComponent: CustomComponent | undefined;
  // Pass defaultValue into the Controller for conditionally displayed fields
  let defaultValue: any = defaultValueProp;

  // Try to get fieldComponent from customComponents list
  if (
    !!customComponents
    && Object.keys(customComponents).length > 0
    && type in customComponents
  ) {
    fieldComponent = customComponents[type].component;

    if (defaultValue === undefined) {
      defaultValue = customComponents[type].defaultValue;
    }
  }
  // If not found in customComponents, try to get it from the built-in components
  else {
    fieldComponent = getFieldProp("component", type);

    if (defaultValue === undefined) {
      defaultValue = getFieldProp("defaultValue", type);
    }

    // If not found in either, don’t display anything
    if (!fieldComponent) {
      console.error(`No matching field component for \`${ type }\``);
      return null;
    }
  }

  if (!name) {
    return null;
  }

  const gridProps
    = typeof gridCols === "number"
    || typeof gridCols === "string"
    || typeof gridCols === "boolean"
      ? { xs: gridCols }
      : gridCols;

  const styleOverrides = disablePadding
    ? { padding: 0 }
    : disablePaddingTop
      ? { paddingTop: 0 }
      : {};

  // If it’s a content field, don’t wrap with Controller
  if (getFieldProp("group", type) === "content") {
    return (
      <Grid
        key={name!}
        id={`fieldWrapper-${ name }`}
        {...gridProps}
        style={styleOverrides}
      >
        <Suspense fallback={<FieldSkeleton />}>
          {createElement(fieldComponent, {
            ...props,
            // Stub Controller render props
            ...controllerRenderPropsStub,
            disabled: true,
            name: name!, // Fix TypeScript error
            label: label!, // Fix TypeScript error
          })}
        </Suspense>
      </Grid>
    );
  }

  // If it’s a conditional field and the user hasn’t ticked, make sure the
  // Controller doesn’t register the field and there is no value for this field
  if (disabledConditional) {
    return (
      <Grid
        key={name!}
        id={`fieldWrapper-${ name }`}
        {...gridProps}
        style={styleOverrides}
      >
        <Suspense fallback={<FieldSkeleton />}>
          {createElement(fieldComponent, {
            ...props,
            // Stub Controller render props
            ...controllerRenderPropsStub,
            disabled: true,
            name: name!, // Fix TypeScript error
            label: label!, // Fix TypeScript error
          })}
        </Suspense>
      </Grid>
    );
  }

  return (
    <Grid
      key={name!}
      id={`fieldWrapper-${ name }`}
      {...gridProps}
      style={styleOverrides}
    >
      <Suspense fallback={<FieldSkeleton />}>
        <Controller
          control={control}
          name={name!}
          render={(renderProps) =>
            createElement(fieldComponent, {
              ...props,
              ...renderProps,
              name,
              label,
              errorMessage: renderProps.fieldState.error?.message,
            })}
          defaultValue={defaultValue}
        />
      </Suspense>
    </Grid>
  );
}

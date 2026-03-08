import { TextField } from "@mui/material";
import ErrorFallback from "@src/components/ErrorFallback";
import Loading from "@src/components/Loading";
import clsx from "clsx";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import PopupContents from "./PopupContents";
import useStyles from "./styles";
import type { TextFieldProps } from "@mui/material";
import type { DocumentReference } from "firebase/firestore";

export type ServiceValue = {
  value: string;
  [prop: string]: any;
};

export type IConnectServiceSelectProps = {
  value: ServiceValue[];
  onChange: (value: ServiceValue[]) => void;
  config: {
    displayKey: string;
    [key: string]: any;
  };
  editable?: boolean;
  /** Optional style overrides for root MUI `TextField` component */
  className?: string;
  /** Override any props of the root MUI `TextField` component */
  TextFieldProps?: Partial<TextFieldProps>;
  docRef: DocumentReference;
  disabled?: boolean;
};

export default function ConnectServiceSelect({
  value = [],
  className,
  TextFieldProps = {},
  disabled,
  ...props
}: IConnectServiceSelectProps) {
  const { classes } = useStyles();

  const sanitisedValue = Array.isArray(value) ? value : [];

  return (
    <TextField
      label=""
      hiddenLabel
      variant={"filled" as any}
      select
      value={sanitisedValue}
      className={clsx(classes.root, className)}
      {...TextFieldProps}
      SelectProps={{
        renderValue: (value) => `${ (value as any[]).length } selected`,
        displayEmpty: true,
        classes: { select: classes.selectRoot },
        ...TextFieldProps.SelectProps,
        // Must have this set to prevent MUI transforming `value`
        // prop for this component to a comma-separated string
        MenuProps: {
          classes: { paper: classes.paper, list: classes.menuChild },
          MenuListProps: { disablePadding: true },
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
          transformOrigin: { vertical: "top", horizontal: "center" },
          ...TextFieldProps.SelectProps?.MenuProps,
        },
      }}
      disabled={disabled}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <PopupContents value={sanitisedValue} {...props} />
        </Suspense>
      </ErrorBoundary>
    </TextField>
  );
}

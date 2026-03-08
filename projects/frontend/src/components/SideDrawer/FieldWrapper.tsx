import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";
import LockIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  IconButton,
  InputLabel,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { DocumentPath as DocumentPathIcon } from "@src/assets/icons";

import {
  altPressAtom,
  projectIdAtom,
  ProjectScopeContext,
} from "@src/atoms/projectScope";
import { InlineErrorFallback } from "@src/components/ErrorFallback";
import { getFieldProp } from "@src/components/fields";
import { copyToClipboard } from "@src/utils/ui";
import { useAtom } from "jotai";
import { useSnackbar } from "notistack";
import { Suspense, useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import FieldSkeleton from "./FieldSkeleton";
import { getFieldId, getLabelId } from "./utils";
import type { FieldType } from "@src/constants/fields";

export type IFieldWrapperProps = {
  children?: React.ReactNode;
  type: FieldType | "debug";
  fieldName?: string;
  label?: React.ReactNode;
  debugText?: React.ReactNode;
  debugValue?: React.ReactNode;
  disabled?: boolean;
  hidden?: boolean;
  index?: number;
};

export default function FieldWrapper({
  children,
  type,
  fieldName,
  label,
  debugText,
  debugValue,
  disabled,
  hidden,
  index,
}: IFieldWrapperProps) {
  const projectScopeStore = useContext(ProjectScopeContext);
  const [ projectId ] = useAtom(projectIdAtom, { store: projectScopeStore });
  const [ altPress ] = useAtom(altPressAtom, { store: projectScopeStore });
  const { enqueueSnackbar } = useSnackbar();
  return (
    <div>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          color: "text.primary",
          height: 24,
          scrollMarginTop: 24,
          "& svg": {
            display: "block",
            color: "action.active",
            fontSize: `${ 18 / 16 }rem`,
          },
        }}
      >
        {type === "debug" ? <DocumentPathIcon /> : getFieldProp("icon", type)}
        <InputLabel
          id={getLabelId(fieldName!)}
          htmlFor={getFieldId(fieldName!)}
          sx={{ flexGrow: 1, lineHeight: "18px" }}
        >
          {altPress ? <code>{fieldName}</code> : label}
        </InputLabel>

        {hidden && (
          <Tooltip title="Hidden in your table view">
            <VisibilityOffIcon />
          </Tooltip>
        )}
        {disabled && (
          <Tooltip title="Locked by ADMIN">
            <LockIcon />
          </Tooltip>
        )}

        {altPress && (
          <Typography variant="caption" color="text.disabled">
            {index}
          </Typography>
        )}
      </Stack>

      <ErrorBoundary FallbackComponent={InlineErrorFallback}>
        <Suspense fallback={<FieldSkeleton />}>
          {children
          ?? (!debugValue && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ paddingLeft: 18 / 8 + 0.75 }}
            >
              This field cannot be edited here.
            </Typography>
          ))}
        </Suspense>
      </ErrorBoundary>

      {debugValue && (
        <Stack direction="row" alignItems="center">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              paddingLeft: 18 / 8 + 1,

              fontFamily: "mono",
              whiteSpace: "normal",
              wordBreak: "break-all",
              userSelect: "all",
            }}
          >
            {debugText}
          </Typography>
          <IconButton
            onClick={() => {
              copyToClipboard(debugValue as string);
              enqueueSnackbar("Copied!");
            }}
          >
            <ContentCopyIcon />
          </IconButton>
          <IconButton
            href={`https://console.firebase.google.com/project/${ projectId }/firestore/data/~2F${ (
              debugValue as string
            ).replace(/\//g, "~2F") }`}
            target="_blank"
            rel="noopener"
            aria-label="Open in Firebase Console"
            size="small"
            edge="end"
            sx={{ ml: 1 }}
          >
            <LaunchIcon />
          </IconButton>
        </Stack>
      )}
    </div>
  );
}

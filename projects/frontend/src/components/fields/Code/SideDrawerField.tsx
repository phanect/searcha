import LockIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Tooltip, Typography } from "@mui/material";

import CodeEditor from "@src/components/CodeEditor";
import config from ".";
import type { ISideDrawerFieldProps } from "@src/components/fields/types";

export default function Code({
  column,
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <CodeEditor
      defaultLanguage={column.config?.language}
      disabled={disabled}
      value={value}
      onChange={onChange}
      onBlur={onSubmit}
      fullScreenTitle={(
        <>
          {config.icon}

          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {column.name}
          </Typography>

          {column.hidden && (
            <Tooltip title="Hidden in your table view">
              <VisibilityOffIcon color="action" />
            </Tooltip>
          )}
          {disabled && (
            <Tooltip title="Locked by ADMIN">
              <LockIcon color="action" />
            </Tooltip>
          )}
        </>
      )}
    />
  );
}

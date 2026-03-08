import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import {
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";

import { EMAIL_REQUEST } from "@src/constants/externalLinks";
import { useRef, useState } from "react";
import { extensionNames, extensionTypes } from "./utils";
import type {
  ButtonProps } from "@mui/material";
import type { ExtensionType } from "./utils";

export type IAddExtensionButtonProps = {
  handleAddExtension: (type: ExtensionType) => void;
} & Partial<ButtonProps>;

export default function AddExtensionButton({
  handleAddExtension,
  ...props
}: IAddExtensionButtonProps) {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [ open, setOpen ] = useState(false);

  const handleChooseAddType = (type: ExtensionType) => {
    setOpen(false);
    handleAddExtension(type);
  };

  return (
    <>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        ref={addButtonRef}
        sx={{
          alignSelf: { sm: "flex-end" },
          mt: {
            sm: "calc(var(--dialog-title-height) * -1 + (var(--dialog-title-height) - 32px) / 2)",
          },
          mx: { xs: "var(--dialog-spacing)", sm: undefined },
          mr: { sm: 8 },
          mb: { xs: 1.5, sm: 2 },
        }}
        {...props}
      >
        Add Extension…
      </Button>

      <Menu
        anchorEl={addButtonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {extensionTypes.map((type) => (
          <MenuItem onClick={() => handleChooseAddType(type)}>
            {extensionNames[type]}
          </MenuItem>
        ))}

        <Divider variant="middle" />

        <MenuItem
          component="a"
          href={EMAIL_REQUEST}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemIcon>
            <EmailIcon aria-label="Send email" sx={{ mr: 1.5 }} />
          </ListItemIcon>
          Request new Extension…
        </MenuItem>
      </Menu>
    </>
  );
}

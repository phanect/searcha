import {
  Divider,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { ChevronRight as ChevronRightIcon } from "@src/assets/icons";
import { useState } from "react";
import type {
  MenuItemProps } from "@mui/material";

export type IContextMenuItem = {
  onClick?: () => void;
  icon?: React.ReactNode;
  label: string;
  disabled?: boolean;
  hotkeyLabel?: string;
  divider?: boolean;
  subItems?: IContextMenuItem[];
} & Partial<MenuItemProps>;

export type IContextMenuItemProps = {
  subItems?: IContextMenuItem[];
} & IContextMenuItem;
export default function ContextMenuItem({
  onClick,
  icon,
  label,
  hotkeyLabel,
  subItems,
  ...props
}: IContextMenuItemProps) {
  const [ subMenu, setSubMenu ] = useState<HTMLElement | null>(null);

  if (subItems && subItems.length > 0) {
    return (
      <>
        <MenuItem onClick={(e) => setSubMenu(e.currentTarget)}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{label}</ListItemText>
          <ListItemSecondaryAction
            sx={{
              pointerEvents: "none",
              position: "static",
              transform: "none",
              ml: 1,
              mr: -1,
            }}
          >
            <ChevronRightIcon color="action" style={{ display: "block" }} />
          </ListItemSecondaryAction>
        </MenuItem>

        <Menu
          anchorEl={subMenu}
          id={`${ label }-sub-menu`}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          open={Boolean(subMenu)}
          onClose={() => setSubMenu(null)}
          sx={{ "& .MuiPaper-root": { mt: -0.5 }}}
          PaperProps={{ elevation: 16 }}
        >
          {subItems.map((itemProps) =>
            itemProps.divider ? (
              <Divider variant="middle" />
            ) : (
              <MenuItem key={itemProps.label} {...itemProps}>
                <ListItemIcon>{itemProps.icon}</ListItemIcon>
                <ListItemText>{itemProps.label}</ListItemText>
                {itemProps.hotkeyLabel && (
                  <Typography variant="body2" color="text.secondary">
                    {itemProps.hotkeyLabel}
                  </Typography>
                )}
              </MenuItem>
            )
          )}
        </Menu>
      </>
    );
  } else {
    if (props.divider) {
      return <Divider variant="middle" />;
    } else {
      return (
        <MenuItem {...props} onClick={onClick}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{label}</ListItemText>
          {hotkeyLabel && (
            <Typography variant="body2" color="text.secondary">
              {hotkeyLabel}
            </Typography>
          )}
        </MenuItem>
      );
    }
  }
}

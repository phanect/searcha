import { forwardRef, type ReactNode } from "react";

/**
 * Wrapper around `PopupContents`. Prevents the creation of an unnecessary
 * wrapping `div` with `role="option" tabIndex="0"`. Allows the user to tab out
 * to exit the popup.
 */
const FragmentWrapper = forwardRef<any, { children: ReactNode; }>(
  ({ children }, _) => <>{children}</>
);

export default FragmentWrapper;

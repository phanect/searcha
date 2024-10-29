import { memo } from "react";
import type { PropsWithChildren } from "react";

/**
 * Used for global Modals that can have customizable text
 * so that the default text doesn’t appear as the modal closes.
 */
const MemoizedText = memo(
  ({ children }: PropsWithChildren<{}>) => <>{children}</>,
  () => true
);

export default MemoizedText;

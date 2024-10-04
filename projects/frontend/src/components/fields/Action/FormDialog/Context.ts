import { createContext, useContext } from "react";
import { IActionParams, CONFIRMATION_EMPTY_STATE } from "./props";
const ActionParamsContext = createContext<IActionParams>(
  CONFIRMATION_EMPTY_STATE
);
export default ActionParamsContext;

export const useActionParams = () => useContext(ActionParamsContext);

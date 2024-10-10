import { createContext } from "react";
import type { createStore } from "jotai";

/** Scope for atoms stored at the table level */
export const TableScopeContext = createContext<ReturnType<typeof createStore> | undefined>(undefined);

export * from "./table";
export * from "./columnActions";
export * from "./rowActions";
export * from "./ui";

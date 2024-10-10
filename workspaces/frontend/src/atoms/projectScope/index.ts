import { createContext } from "react";
import type { createStore } from "jotai";

/** Scope for atoms stored at the root of the app */
export const ProjectScopeContext = createContext<ReturnType<typeof createStore> | undefined>(undefined);

export * from "./auth";
export * from "./project";
export * from "./user";
export * from "./ui";

export * from "./rowyRun";

import type { TableSettings } from "@root/src/types/table.d.ts";
import type { IWebhook } from "../utils.tsx";

export type AdditionalVariables = {
  key: "req";
  description: string;
}[];

export type WebHook = {
  name: string;
  type?: "webform";
  parser: {
    additionalVariables?: AdditionalVariables;
    extraLibs?: string[];
    template: (table: TableSettings) => string;
  };
  condition: {
    additionalVariables?: AdditionalVariables;
    extraLibs?: string[];
    template: () => string;
  };
  Auth: (webhookObject: IWebhook, setWebhookObject: (w: IWebhook) => void) => JSX.Element;
};

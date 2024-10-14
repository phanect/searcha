import { Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/WarningAmber";
import { TableSettings } from "@src/types/table";
import type { AdditionalVariables, WebHook } from "./type.ts";

const requestType = [
  "declare type WebHookRequest {",
  "    /**",
  "     * Webhook Request object",
  "     */",
  "static params:string[]",
  "static query:string",
  "static body:any",
  "static headers:any",
  "static url:string",
  "}",
].join("\n");

export const parserExtraLibs = [
  requestType,
  `type Parser = (
    args: {
      req: WebHookRequest;
      db: FirebaseFirestore.Firestore;
      ref: FirebaseFirestore.CollectionReference;
      res: {
        send: (v:any)=>void;
        sendStatus: (status:number)=>void
      };
      logging: RowyLogging;
    }
  ) => Promise<any>;`,
];
export const conditionExtraLibs = [
  requestType,
  `type Condition = (
    args: {
      req: WebHookRequest;
      db: FirebaseFirestore.Firestore;
      ref: FirebaseFirestore.CollectionReference;
      res: {
        send: (v:any)=>void;
        sendStatus: (status:number)=>void;
      };
      logging: RowyLogging;
    }
  ) => Promise<any>;`,
];

const additionalVariables: AdditionalVariables = [
  {
    key: "req",
    description: "webhook request",
  },
];

export const webhookBasic: WebHook = {
  name: "Basic",
  parser: {
    additionalVariables,
    extraLibs: parserExtraLibs,
    template: (
      table: TableSettings
    ) => `const basicParser: Parser = async({req, db, ref, logging}) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("basicParser started")

  // Import NPM package needed, some packages may not work in Webhooks
  // const {default: lodash} = await import("lodash");

  // Optionally return an object to be added as a new row to the table
  // Example: add the webhook body as row
  const {body} = req;
  ${
    table.audit !== false
      ? `const ${
          table.auditFieldCreatedBy ?? "_createdBy"
        } = await rowy.metadata.serviceAccountUser()
  return {
    ...body,
    ${table.auditFieldCreatedBy ?? "_createdBy"}
  }`
      : `return body;`
  }
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
}`,
  },
  condition: {
    additionalVariables,
    extraLibs: conditionExtraLibs,
    template: () => `const condition: Condition = async({ref, req, db, logging}) => {
  // WRITE YOUR CODE ONLY BELOW THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
  logging.log("condition started")

  return true;
  // WRITE YOUR CODE ONLY ABOVE THIS LINE. DO NOT WRITE CODE/COMMENTS OUTSIDE THE FUNCTION BODY
}`,
  },
  Auth: () => {
    return (
      <Typography color="text.disabled">
        <WarningIcon aria-label="Warning" style={{ verticalAlign: "bottom" }} />
        &nbsp; Specialized verification is not currently available for basic
        webhooks, you can add your own verification logic in the conditions
        section below.
      </Typography>
    );
  },
};

export default webhookBasic;

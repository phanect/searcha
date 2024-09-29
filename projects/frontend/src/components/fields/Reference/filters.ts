import { DocumentReference } from "@google-cloud/firestore";

export const valueFormatter = (value: DocumentReference) => {
  if (value && value.path) return value.path;
  return "";
};

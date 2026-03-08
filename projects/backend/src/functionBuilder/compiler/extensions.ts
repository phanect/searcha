import { commandErrorHandler, logErrorToDB } from "../logger";
import { addPackages } from "./terminal";
import { getExtension } from "../../rowyService";
import { asyncExecute } from "../../terminalUtils";
import type admin from "firebase-admin";

export const addExtensionLib = async (
  name: string,
  user: admin.auth.UserRecord,
  streamLogger,
  buildPath,
  buildFolderTimestamp
) => {
  try {
    const extensionResp = await getExtension(name);
    const { extension, dependencies } = extensionResp;
    const packages = Object.keys(dependencies).map((key) => ({
      name: key,
      version: dependencies[key],
    }));
    const success = await addPackages(packages, user, streamLogger, buildPath);
    if (!success) {
      return false;
    }
    const fs = require("node:fs");
    const path = require("node:path");
    fs.writeFileSync(
      path.resolve(
        __dirname,
        `../builds/${ buildFolderTimestamp }/src/extensions/${ name }.ts`
      ),
      extension
    );
    await asyncExecute(
      `cd ${ buildPath }/src/extensions;tsc ${ name }.ts`,
      commandErrorHandler(
        {
          user,
          description: "Error compiling extensionsLib",
        },
        streamLogger
      )
    );
  } catch (error) {
    console.log(error);
    logErrorToDB(
      {
        user,
        errorDescription: `Error installing extension ${ name }`,
      },
      streamLogger
    );
    return false;
  }
  return true;
};

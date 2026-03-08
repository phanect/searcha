import _get from "lodash/get";
import fetch from "node-fetch";
import rowy from "./rowy";
import { auth, db, storage } from "../firebaseConfig";
import type { Request, Response } from "express";
import type * as admin from "firebase-admin";
import type { Auth } from "firebase-admin/auth";
import type { CollectionGroup, CollectionReference } from "firebase-admin/firestore";
import type { Rowy } from "./rowy";
import type { User } from "../types/User";

type TableActionRequest = {
  collectionPath: {
    path: string;
    type: "collection" | "collectionGroup";
  };
  actionKey: string;
  schemaDocPath: string;
};
type ServiceAccountUser = {
  email: string;
  displayName: string;
};
type ActionArgs = {
  ref: CollectionReference | CollectionGroup;
  db: FirebaseFirestore.Firestore;
  auth: Auth;
  user: User | ServiceAccountUser;
  rowy: Rowy;
  fetch: any;
  storage: admin.storage.Storage;
};

type TableAction = (args: ActionArgs) => Promise<void> | void;

export const authUser2rowyUser = (currentUser: User, data?: any) => {
  const { name, email, uid, email_verified, picture } = currentUser;
  return {
    timestamp: new Date(),
    displayName: name,
    email,
    uid,
    emailVerified: email_verified,
    photoURL: picture,
    ...data,
  };
};
// TODO convert to schema publisher/subscriber
export const tableAction = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const userRoles = user.roles;
    if (!userRoles || userRoles.length === 0) {
      throw new Error("User has no assigned roles");
    }
    const { schemaDocPath, actionKey, collectionPath }: TableActionRequest
      = req.body;
    const schemaDoc = await db.doc(schemaDocPath).get();
    const schemaDocData = schemaDoc.data();
    if (!schemaDocData) {
      return res.send({
        success: false,
        message: "no schema found",
      });
    }
    const config = schemaDocData.tableActions[actionKey];
    const { fn } = config;
    const fnBody = fn.replace(/^.*=>/, "");
    const tableAction = eval(
      "async({db,ref,auth,fetch,rowy,storage})=>" + fnBody
    ) as TableAction;

    const results = await tableAction({
      ref:
        collectionPath.type === "collection"
          ? db.collection(collectionPath.path)
          : db.collectionGroup(collectionPath.path),
      db,
      auth,
      fetch,
      user,
      storage,
      rowy,
    });
    return res.send({
      success: true,
      hits: results,
    });
  } catch (error: any) {
    return res.send({
      success: false,
      error,
      message: error.message,
    });
  }
};

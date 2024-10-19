import admin, { type ServiceAccount } from "firebase-admin";
import { datasheetAdminEmail, firebaseProjectId } from "./adminize-data.json";
import serviceAccount from "./adminize-service-account.json";

console.log(`Running on ${firebaseProjectId}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: `https://${ firebaseProjectId }.firebaseio.com`,
});
const auth = admin.auth();
const { uid } = await auth.getUserByEmail(datasheetAdminEmail);

await auth.setCustomUserClaims(uid, { roles: [ "ADMIN" ]});

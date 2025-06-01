import { join } from "path";
import { cwd } from "process";

export const firebaseConfig = {
  serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || join(cwd(), './data/firebase/firebase-admin-service-account.json')
};
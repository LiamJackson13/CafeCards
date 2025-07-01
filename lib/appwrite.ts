import { Account, Avatars, Client } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!) // e.g., https://cloud.appwrite.io/v1
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!) // Your Appwrite project ID
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!); // e.g., com.myapp.mobile

export const account = new Account(client);
export const avatars = new Avatars(client);

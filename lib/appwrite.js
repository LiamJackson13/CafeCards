import { Account, Avatars, Client } from "react-native-appwrite";

export const client = new Client()
  .setPlatform("co.liamjackson.cafecards")
  .setProject("685f48ce0025763a40ec")
  .setEndpoint("https://syd.cloud.appwrite.io/v1");

export const account = new Account(client);
export const avatars = new Avatars(client);

/**
 * Appwrite Configuration
 *
 * This file sets up and exports the Appwrite client and services for the Cafe Cards app.
 * It configures the connection to the Appwrite backend with platform, project ID, and endpoint.
 * Exports initialized instances of Account, Avatars, Databases, and Teams services
 * that are used throughout the app for authentication, user management, and data operations.
 */
import {
  Account,
  Avatars,
  Client,
  Databases,
  Teams,
} from "react-native-appwrite";

export const client = new Client()
  .setPlatform("co.liamjackson.cafecards")
  .setProject("685f48ce0025763a40ec")
  .setEndpoint("https://syd.cloud.appwrite.io/v1");

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

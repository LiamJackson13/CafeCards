/**
 * Appwrite Client Configuration
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
  ID,
  Permission,
  Query,
  Role,
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

// Database configuration
export const DATABASE_ID = "6865cc6c000a762776eb";
export const LOYALTY_CARDS_COLLECTION_ID = "6868666e000011d27bb1";
export const CAFE_PROFILES_COLLECTION_ID = "6868e4650032e76edb25";

// Re-export Appwrite modules for convenience
export { ID, Permission, Query, Role };

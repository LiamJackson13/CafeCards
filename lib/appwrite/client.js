/**
 * Appwrite Client Configuration
 *
 * Sets up and exports the Appwrite client and services for the Cafe Cards app.
 * Configures the connection to the Appwrite backend with platform, project ID, and endpoint.
 * Exports initialized instances of Account, Avatars, Databases, and Teams services
 * for authentication, user management, and data operations.
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

// Initialize Appwrite client with project and endpoint
export const client = new Client()
  .setPlatform("co.liamjackson.cafecards")
  .setProject("685f48ce0025763a40ec")
  .setEndpoint("https://syd.cloud.appwrite.io/v1");

// Export Appwrite service instances for use throughout the app
export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

// Database and collection IDs
export const DATABASE_ID = "6865cc6c000a762776eb";
export const LOYALTY_CARDS_COLLECTION_ID = "6868666e000011d27bb1";
export const CAFE_PROFILES_COLLECTION_ID = "6868e4650032e76edb25";

// Re-export Appwrite modules for convenience
export { ID, Permission, Query, Role };

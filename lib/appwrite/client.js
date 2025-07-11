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
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT);

// Export Appwrite service instances for use throughout the app
export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

// Database and collection IDs
export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
export const LOYALTY_CARDS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_LOYALTY_CARDS_COLLECTION_ID;
export const CAFE_PROFILES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_CAFE_PROFILES_COLLECTION_ID;
export const CAFE_IDS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_CAFE_IDS_COLLECTION_ID;

// Re-export Appwrite modules for convenience
export { ID, Permission, Query, Role };

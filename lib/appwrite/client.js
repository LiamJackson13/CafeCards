/**
 * Appwrite Client Configuration
 */

import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  InputFile,
  Permission,
  Query,
  Role,
  Storage,
  Teams,
} from "react-native-appwrite";

// Initialize Appwrite client with project and endpoint
export const client = new Client() // Using Client class to centralize configuration
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT);

// Export Appwrite service instances for use throughout the app - using singleton pattern to share instances
export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);

// Database and collection IDs - using environment variables for configuration flexibility
export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID;
export const LOYALTY_CARDS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_LOYALTY_CARDS_COLLECTION_ID;
export const CAFE_PROFILES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_CAFE_PROFILES_COLLECTION_ID;
export const CAFE_IDS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_CAFE_IDS_COLLECTION_ID;

// Storage bucket IDs - centralized bucket configuration for file management
export const BUCKET_PROFILE_PICTURES =
  process.env.EXPO_PUBLIC_BUCKET_PROFILE_PICTURES;

// Re-export Appwrite modules for convenience
export { ID, InputFile, Permission, Query, Role };

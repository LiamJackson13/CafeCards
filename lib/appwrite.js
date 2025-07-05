/**
 * Appwrite Configuration
 *
 * This file now re-exports from the modular appwrite structure.
 * The original monolithic file has been split into multiple modules for better organization:
 * - client.js: Client configuration and services
 * - auth.js: Authentication functions
 * - loyalty-cards.js: Loyalty card CRUD operations
 * - utils.js: Helper utilities and parsing functions
 * - migration.js: Database migration functions
 */

// Re-export everything from the new modular structure
export * from "./appwrite/index.js";

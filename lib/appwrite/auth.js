/**
 * Appwrite Authentication Functions
 *
 * Contains user account management and authentication-related functions.
 */
import { account } from "./client.js";

/**
 * Updates the user's name in their Appwrite account
 * @param {string} name - The new name for the user - using string for simplicity and user input compatibility
 * @returns {Promise<Object>} The updated user account object
 * @throws {Error} If the name is invalid or the update fails
 */
export const updateUserName = async (name) => {
  try {
    if (!name || name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }

    if (name.trim().length > 128) {
      throw new Error("Name cannot be longer than 128 characters");
    }

    // Update the user's name in Appwrite
    const result = await account.updateName(name.trim());
    return result;
  } catch (error) {
    console.error("Error updating user name:", error);

    // Handle not logged in
    if (error.code === 401) {
      throw new Error("You must be logged in to update your name.");
    } else if (error.message?.includes("Name cannot be")) {
      throw error; // Re-throw validation errors as-is
    }

    // Generic error
    throw new Error("Failed to update name. Please try again.");
  }
};

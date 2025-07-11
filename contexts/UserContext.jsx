/**
 * User Authentication Context
 *
 * Provides user authentication state and methods throughout the app.
 * Integrates with Appwrite backend for authentication services and maintains
 * user session state. Used by UserOnly/GuestOnly components and authentication-related screens.
 */

import { createContext, useCallback, useEffect, useState } from "react";
import { ID } from "react-native-appwrite";
import {
  account,
  CAFE_IDS_COLLECTION_ID,
  DATABASE_ID,
  databases,
  deleteProfilePicture,
  getProfilePicturePreview,
  uploadProfilePicture,
} from "../lib/appwrite"; // Import the databases object and storage functions

// Create the UserContext to be used by the app
export const UserContext = createContext();

/**
 * UserProvider wraps the app and provides authentication state and actions.
 */
export function UserProvider({ children }) {
  const [authChecked, setAuthChecked] = useState(false);
  // User and role state
  const [user, setUser] = useState(null);
  const [isCafeUser, setIsCafeUser] = useState(false);
  const [debugCafeMode, setDebugCafeMode] = useState(false);

  // Helper to fetch cafe user IDs
  const fetchCafeUserIds = useCallback(async () => {
    const res = await databases.listDocuments(
      DATABASE_ID,
      CAFE_IDS_COLLECTION_ID
    );
    return res.documents.map((d) => d.userId);
  }, []);

  // Login: establish session then fetch role without re-running mount initialization
  async function login(email, password) {
    await account.createEmailPasswordSession(email, password);
    const u = await account.get();
    setUser(u);
    // Determine cafe user status for logged-in user
    const ids = await fetchCafeUserIds();
    const status = ids.includes(u.$id);
    setIsCafeUser(status);
    if (__DEV__) setDebugCafeMode(status);
  }

  /**
   * Register a new user and log them in.
   */
  async function register(email, password, isCafeUserFlag = false) {
    try {
      // Create new user account
      const createdUser = await account.create(ID.unique(), email, password);
      // If registering as a cafe, add entry to cafe IDs collection
      if (isCafeUserFlag) {
        await databases.createDocument(
          DATABASE_ID,
          CAFE_IDS_COLLECTION_ID,
          ID.unique(),
          { userId: createdUser.$id }
        );
      }
      // Log the user in, with cafe status determined during login
      await login(email, password);

      // If cafe user, set default name from email prefix
      if (isCafeUserFlag) {
        const defaultName = email.split("@")[0];
        await updateName(defaultName);
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Log out the current user and reset state.
   */
  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    setIsCafeUser(false);
  }

  /**
   * Update the user's name and refresh user data.
   */
  async function updateName(name) {
    try {
      const updatedUser = await account.updateName(name);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw Error(error.message);
    }
  }

  /**
   * Update the user's profile picture
   * @param {string} imageUri - Local URI of the selected image
   * @returns {Promise<string>} - URL of the uploaded profile picture
   */
  async function updateProfilePicture(imageUri) {
    try {
      const fileName = `profile_${user?.$id}_${Date.now()}.jpg`;

      // Upload new profile picture
      const fileId = await uploadProfilePicture(imageUri, fileName);

      // Get the old profile picture file ID from preferences (if exists)
      const currentPrefs = user?.prefs || {};
      const oldFileId = currentPrefs.profilePictureFileId;

      // Update user preferences with new profile picture info
      const profilePictureUrl = getProfilePicturePreview(fileId, 200, 200);
      console.log("Generated profile picture URL:", profilePictureUrl);
      console.log("URL type:", typeof profilePictureUrl);

      const updatedPrefs = {
        ...currentPrefs,
        profilePictureFileId: fileId,
        profilePictureUrl: profilePictureUrl,
      };

      console.log("Updated preferences:", updatedPrefs);

      const updatedUser = await account.updatePrefs(updatedPrefs);
      setUser(updatedUser);

      // Delete old profile picture if it exists
      if (oldFileId) {
        try {
          await deleteProfilePicture(oldFileId);
        } catch (error) {
          console.warn("Failed to delete old profile picture:", error);
        }
      }

      return updatedPrefs.profilePictureUrl;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw new Error("Failed to update profile picture");
    }
  }

  /**
   * Remove the user's profile picture
   */
  async function removeProfilePicture() {
    try {
      const currentPrefs = user?.prefs || {};
      const fileId = currentPrefs.profilePictureFileId;

      // Update user preferences to remove profile picture info
      const updatedPrefs = {
        ...currentPrefs,
        profilePictureFileId: null,
        profilePictureUrl: null,
      };

      const updatedUser = await account.updatePrefs(updatedPrefs);
      setUser(updatedUser);

      // Delete the profile picture from storage
      if (fileId) {
        try {
          await deleteProfilePicture(fileId);
        } catch (error) {
          console.warn("Failed to delete profile picture from storage:", error);
        }
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      throw new Error("Failed to remove profile picture");
    }
  }

  /**
   * Get the user's profile picture URL
   * @returns {string|null} - Profile picture URL or null if not set
   */
  function getProfilePictureUrl() {
    const url = user?.prefs?.profilePictureUrl || null;
    console.log("Getting profile picture URL:", url);
    console.log("URL type:", typeof url);
    return url;
  }

  /**
   * Refresh user data from the backend.
   */
  async function refreshUser() {
    try {
      const response = await account.get();
      setUser(response);
      return response;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      throw Error(error.message);
    }
  }

  // Initialization: check auth and café user role
  const initialize = useCallback(async () => {
    // Auth check
    let u = null;
    try {
      u = await account.get();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }

    // Role check if authed
    if (u) {
      try {
        const ids = await fetchCafeUserIds();
        const status = ids.includes(u.$id);
        setIsCafeUser(status);
        if (__DEV__) setDebugCafeMode(status);
      } catch {
        setIsCafeUser(false);
      }
    } else {
      setIsCafeUser(false);
    }
  }, [fetchCafeUserIds]);

  // On mount: run initialization
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Determine effective cafe-user status (with debug override)
  const actualIsCafeUser = __DEV__ ? debugCafeMode : isCafeUser;

  return (
    <UserContext.Provider
      value={{
        user, // Current user object or null
        login, // Login function
        register, // Register function
        logout, // Logout function
        updateName, // Update user name
        updateProfilePicture, // Update profile picture
        removeProfilePicture, // Remove profile picture
        getProfilePictureUrl, // Get profile picture URL
        refreshUser, // Refresh user data
        authChecked, // True when initial auth check is complete
        isCafeUser: actualIsCafeUser, // Cafe user status (with debug override)
        realIsCafeUser: isCafeUser, // Actual cafe user status (no debug override)
        debugCafeMode, // Debug cafe mode toggle (development only)
        setDebugCafeMode: __DEV__ ? setDebugCafeMode : () => {}, // Setter for debug mode
        isDebugMode: __DEV__, // True if in development
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

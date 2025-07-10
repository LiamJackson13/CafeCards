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
} from "../lib/appwrite"; // Import the databases object

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
  async function register(email, password) {
    try {
      await account.create(ID.unique(), email, password);
      await login(email, password);
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

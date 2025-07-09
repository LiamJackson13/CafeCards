/**
 * User Authentication Context
 *
 * Provides user authentication state and methods throughout the app.
 * Integrates with Appwrite backend for authentication services and maintains
 * user session state. Used by UserOnly/GuestOnly components and authentication-related screens.
 */

import { createContext, useCallback, useEffect, useState } from "react";
import { ID } from "react-native-appwrite";
import { account } from "../lib/appwrite";

// Create the UserContext to be used by the app
export const UserContext = createContext();

// Hardcoded cafe user IDs for special access/roles
const CAFE_USER_IDS = [
  "68678aaa002cdc721bfa",
  "6868da4c003d62b85e20",
  "686df1e7000d522586c4",
  // Add more cafe user IDs as needed
];

/**
 * UserProvider wraps the app and provides authentication state and actions.
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // Current user object
  const [authChecked, setAuthChecked] = useState(false); // True when auth check is complete
  const [isCafeUser, setIsCafeUser] = useState(false); // Cafe user status
  const [debugCafeMode, setDebugCafeMode] = useState(false); // Debug toggle for cafe user mode (dev only)

  // Helper: Check if a user ID is a cafe user
  function checkIfCafeUser(userId) {
    return CAFE_USER_IDS.includes(userId);
  }

  // Use debugCafeMode in development, otherwise use real isCafeUser
  const actualIsCafeUser = __DEV__ ? debugCafeMode : isCafeUser;

  /**
   * Log in a user with email and password.
   * Sets user state and cafe user status.
   */
  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const response = await account.get();
      const cafeUserStatus = checkIfCafeUser(response.$id);
      setUser(response);
      setIsCafeUser(cafeUserStatus);

      // Sync debug mode in development
      if (__DEV__) setDebugCafeMode(cafeUserStatus);
    } catch (error) {
      throw Error(error.message);
    }
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

    // Reset debug toggle on logout (development only)
    if (__DEV__) setDebugCafeMode(false);
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

  /**
   * On mount, check if a user is already logged in and set state.
   */
  const getInitialUserValue = useCallback(async () => {
    try {
      const response = await account.get();
      const cafeUserStatus = checkIfCafeUser(response.$id);
      setUser(response);
      setIsCafeUser(cafeUserStatus);

      // Sync debug mode in development
      if (__DEV__) setDebugCafeMode(cafeUserStatus);
    } catch (_error) {
      setUser(null);
      setIsCafeUser(false);

      // Reset debug toggle when no user (development only)
      if (__DEV__) setDebugCafeMode(false);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  // Run initial user check on mount
  useEffect(() => {
    getInitialUserValue();
  }, [getInitialUserValue]);

  return (
    <UserContext.Provider
      value={{
        user, // Current user object or null
        login, // Login function
        register, // Register function
        logout, // Logout function
        updateName, // Update user name
        refreshUser, // Refresh user data
        authChecked, // True if auth check is complete
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

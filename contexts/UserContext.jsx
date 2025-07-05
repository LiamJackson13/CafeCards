/**
 * User Authentication Context
 *
 * Provides user authentication state and methods throughout the app.
 * Manages user login, registration, logout, and authentication status checking.
 * Integrates with Appwrite backend for authentication services and maintains
 * user session state. Provides login/register functions that handle account
 * creation, session management, and error handling. Used by UserOnly/GuestOnly
 * components and authentication-related screens.
 */
import { createContext, useCallback, useEffect, useState } from "react";

import { ID } from "react-native-appwrite";
import { account } from "../lib/appwrite";

export const UserContext = createContext();

// Hardcoded cafe user IDs
const CAFE_USER_IDS = [
  "68678aaa002cdc721bfa",
  "6868da4c003d62b85e20",
  // Add more cafe user IDs as needed
];

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isCafeUser, setIsCafeUser] = useState(false);

  // Debug toggle state (only active in development)
  const [debugCafeMode, setDebugCafeMode] = useState(false);

  // Function to check if user is a cafe user
  function checkIfCafeUser(userId) {
    return CAFE_USER_IDS.includes(userId);
  }

  // Override isCafeUser for debugging
  const actualIsCafeUser = __DEV__ ? debugCafeMode : isCafeUser;

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const response = await account.get();
      const cafeUserStatus = checkIfCafeUser(response.$id);
      setUser(response);
      setIsCafeUser(cafeUserStatus);

      // In development, set debug toggle to match real user type
      if (__DEV__) {
        setDebugCafeMode(cafeUserStatus);
      }
    } catch (error) {
      throw Error(error.message);
    }
  }
  async function register(email, password) {
    try {
      await account.create(ID.unique(), email, password);
      await login(email, password);
    } catch (error) {
      throw Error(error.message);
    }
  }
  async function logout() {
    await account.deleteSession("current");
    setUser(null);
    setIsCafeUser(false);

    // Reset debug toggle on logout
    if (__DEV__) {
      setDebugCafeMode(false);
    }
  }

  // Function to update user name and refresh user data
  async function updateName(name) {
    try {
      const updatedUser = await account.updateName(name);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw Error(error.message);
    }
  }

  // Function to refresh user data
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

  const getInitialUserValue = useCallback(async () => {
    try {
      const response = await account.get();
      const cafeUserStatus = checkIfCafeUser(response.$id);
      setUser(response);
      setIsCafeUser(cafeUserStatus);

      // In development, set debug toggle to match real user type
      if (__DEV__) {
        setDebugCafeMode(cafeUserStatus);
      }
    } catch (_error) {
      setUser(null);
      setIsCafeUser(false);

      // Reset debug toggle when no user
      if (__DEV__) {
        setDebugCafeMode(false);
      }
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    getInitialUserValue();
  }, [getInitialUserValue]);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateName,
        refreshUser,
        authChecked,
        isCafeUser: actualIsCafeUser,
        realIsCafeUser: isCafeUser, // The actual user status without debug override
        debugCafeMode,
        setDebugCafeMode: __DEV__ ? setDebugCafeMode : () => {},
        isDebugMode: __DEV__,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

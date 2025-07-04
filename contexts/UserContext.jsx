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
import { createContext, useEffect, useState } from "react";

import { ID } from "react-native-appwrite";
import { account } from "../lib/appwrite";

export const UserContext = createContext();

// Hardcoded cafe user IDs
const CAFE_USER_IDS = [
  "68678aaa002cdc721bfa",
  // Add more cafe user IDs as needed
];

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isCafeUser, setIsCafeUser] = useState(false);

  // Function to check if user is a cafe user
  function checkIfCafeUser(userId) {
    return CAFE_USER_IDS.includes(userId);
  }

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const response = await account.get();
      setUser(response);
      setIsCafeUser(checkIfCafeUser(response.$id));
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
  }

  async function getInitialUserValue() {
    try {
      const response = await account.get();
      setUser(response);
      setIsCafeUser(checkIfCafeUser(response.$id));
    } catch (error) {
      setUser(null);
      setIsCafeUser(false);
    } finally {
      setAuthChecked(true);
    }
  }

  useEffect(() => {
    getInitialUserValue();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, login, register, logout, authChecked, isCafeUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

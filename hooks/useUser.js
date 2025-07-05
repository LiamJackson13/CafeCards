/**
 * User Authentication Hook
 *
 * A custom React hook that provides access to user authentication context.
 * Returns user state, authentication methods (login, register, logout), and
 * auth status checking. Ensures the hook is used within a UserProvider and
 * throws an error if used outside the provider context. Simplifies access
 * to user authentication functionality throughout the app.
 */
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

/**
 * Cafe User Hook
 *
 * Custom hook to check if the current user is a cafe user.
 * Returns the isCafeUser boolean state from the UserContext.
 */
export function useCafeUser() {
  const { isCafeUser } = useContext(UserContext);
  return isCafeUser;
}

// Import React's useContext for accessing context values
import { useContext } from "react";
// Import the UserContext provider for authentication and user info
import { UserContext } from "../contexts/UserContext";

/**
 * useUser
 * Provides access to the authentication context:
 * - Contains current user object, login/register/logout methods,
 *   and authentication status flags.
 * - Throws an error if used outside a UserProvider.
 */
export function useUser() {
  // Retrieve context value from nearest UserProvider
  const context = useContext(UserContext);

  // Guard: ensure hook is within a UserProvider
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  // Return full context: user state and auth methods
  return context;
}

/**
 * Cafe User Hook
 *
 * Hook to check if the current user is a cafe user.
 * Returns the isCafeUser boolean state from the UserContext.
 */
export function useCafeUser() {
  /**
   * useCafeUser
   * Returns a boolean indicating if the current user has cafe (staff) privileges.
   * Retrieves just the isCafeUser flag from UserContext for quick checks.
   */
  // Destructure only the isCafeUser flag from context
  const { isCafeUser } = useContext(UserContext);
  return isCafeUser;
}

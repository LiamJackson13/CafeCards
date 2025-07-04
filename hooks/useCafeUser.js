/**
 * Cafe User Hook
 *
 * Custom hook to check if the current user is a cafe user.
 * Returns the isCafeUser boolean state from the UserContext.
 */
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useCafeUser() {
  const { isCafeUser } = useContext(UserContext);
  return isCafeUser;
}

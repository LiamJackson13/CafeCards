/**
 * useDebug
 *
 * Hook to access debug-related functions from the UserContext.
 * Global debug cafe mode toggle that affects the entire app's behavior in development mode.
 */

import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useDebug() {
  // Extract debug-related state and setter from UserContext
  const { debugCafeMode, setDebugCafeMode, isDebugMode } =
    useContext(UserContext);

  // Return debug mode values and control function for components
  return {
    debugCafeMode, // Boolean: whether cafe debug mode is active
    setDebugCafeMode, // Function: toggles cafe debug mode on/off
    isDebugMode, // Boolean: indicates if app is in development/debug environment
  };
}

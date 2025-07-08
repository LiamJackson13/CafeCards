/**
 * useDebug
 *
 * Custom hook to access debug-related functions from the UserContext.
 * Provides access to the global debug cafe mode toggle that affects
 * the entire app's behavior in development mode.
 */
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export function useDebug() {
  const { debugCafeMode, setDebugCafeMode, isDebugMode } =
    useContext(UserContext);

  return {
    debugCafeMode, // Boolean: current debug cafe mode state
    setDebugCafeMode, // Function: toggle debug cafe mode
    isDebugMode, // Boolean: true if in development mode
  };
}

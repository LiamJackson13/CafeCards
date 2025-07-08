/**
 * GuestOnly Route Guard
 *
 * Protects routes/screens so only unauthenticated users can access them.
 * - Redirects authenticated users to the profile screen.
 * - Shows a loading indicator while authentication status is being checked.
 */
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import ThemedLoader from "../ThemedLoader";

const GuestOnly = ({ children }) => {
  const { user, authChecked } = useUser(); // Get user and auth status
  const router = useRouter();

  useEffect(() => {
    // If authentication has been checked and a user is found, redirect to profile
    if (authChecked && user) {
      router.replace("/profile");
    }
  }, [user, authChecked, router]);

  // Show loader while checking auth or if user is present
  if (!authChecked || user) {
    return <ThemedLoader />;
  }

  // Render protected content for guests (unauthenticated users)
  return children;
};

export default GuestOnly;

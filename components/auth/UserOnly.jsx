/**
 * UserOnly Route Guard
 *
 * Protects routes/screens so only authenticated users can access them.
 * - Redirects unauthenticated users to the login screen.
 * - Shows a loading indicator while authentication status is being checked.
 */
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import ThemedLoader from "../ThemedLoader";

const UserOnly = ({ children }) => {
  const { user, authChecked } = useUser(); // Get user and auth status
  const router = useRouter();

  useEffect(() => {
    // If authentication has been checked and no user is found, redirect to login
    if (authChecked && !user) {
      router.replace("/login");
    }
  }, [user, authChecked, router]);

  // Show loader while checking auth or if user is not present
  if (!authChecked || !user) {
    return <ThemedLoader />;
  }

  // Render protected content for authenticated users
  return children;
};

export default UserOnly;

/**
 * User Only Route Guard Component
 *
 * A route protection component that ensures only authenticated users can access
 * wrapped screens. Automatically redirects unauthenticated users to the login screen.
 * Displays a loading state while checking authentication status. Used to protect
 * dashboard screens and other authenticated areas from being accessed by
 * guests or unauthenticated users.
 */
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import ThemedLoader from "../ThemedLoader";

const UserOnly = ({ children }) => {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (authChecked && user === null) {
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authChecked]);

  if (!authChecked || !user) {
    return <ThemedLoader />;
  }

  return children;
};

export default UserOnly;

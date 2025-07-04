/**
 * Guest Only Route Guard Component
 *
 * A route protection component that ensures only unauthenticated (guest) users
 * can access wrapped screens. Automatically redirects authenticated users to
 * the profile screen. Displays a loading state while checking authentication
 * status. Used to protect auth screens like login and registration from
 * being accessed by already logged-in users.
 */
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useUser } from "../../hooks/useUser";
import ThemedLoader from "../ThemedLoader";

const GuestOnly = ({ children }) => {
  const { user, authChecked } = useUser();
  const router = useRouter();

  useEffect(
    () => {
      if (authChecked && user !== null) {
        router.replace("/profile");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, authChecked]
  );

  if (!authChecked || user) {
    return <ThemedLoader />;
  }
  return children;
};

export default GuestOnly;

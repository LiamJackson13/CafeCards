import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GuestOnly from "../../components/auth/GuestOnly";
import { useUser } from "../../hooks/useUser";

export default function AuthLayout() {
  const { user } = useUser();
  console.log(user);

  return (
    <GuestOnly>
      {/* Only unauthenticated users can see this page */}
      <StatusBar style="auto" />
      {/* Ensures the status bar on the phone matches the theme of the app */}
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />{" "}
      {/* Sets the nav options to be Stack and hides the header */}
    </GuestOnly>
  );
}

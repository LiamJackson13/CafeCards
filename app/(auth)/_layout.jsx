import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GuestOnly from "../../components/auth/GuestOnly";

// Layout for authentication screens
export default function AuthLayout() {
  return (
    // Only unauthenticated users can see this page
    <GuestOnly>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </GuestOnly>
  );
}

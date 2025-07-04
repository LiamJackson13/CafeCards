/**
 * Authentication Layout Component
 *
 * This layout component wraps all authentication-related screens (login, register).
 * It uses the GuestOnly component to ensure only unauthenticated users can access
 * these screens. Provides a Stack navigator for auth screens with no headers
 * and handles automatic redirection for already authenticated users.
 */

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import GuestOnly from "../../components/auth/GuestOnly";
import { useUser } from "../../hooks/useUser";

export default function AuthLayout() {
  const { user } = useUser();
  console.log(user);

  return (
    <GuestOnly>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />
    </GuestOnly>
  );
}

/**
 * Root App Layout Component
 *
 * Wraps the entire application with essential providers:
 * - ThemeProvider: app-wide theming (light/dark)
 * - UserProvider: authentication and user context
 * - CardsProvider: loyalty card data management
 * Sets up the root Stack navigator with theming and navigation structure:
 * - Home screen
 * - Auth screens
 * - Dashboard screens
 */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/Colors";
import { CardsProvider } from "../contexts/CardsContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { UserProvider } from "../contexts/UserContext";

// Stack navigator with themed headers and hidden by default
const StackNavigator = () => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  return (
    <>
      <StatusBar style={actualTheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
          headerTitleAlign: "center",
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

// Root layout wraps all providers and the stack navigator
const RootLayout = () => (
  <ThemeProvider>
    <UserProvider>
      <CardsProvider>
        <StackNavigator />
      </CardsProvider>
    </UserProvider>
  </ThemeProvider>
);

export default RootLayout;

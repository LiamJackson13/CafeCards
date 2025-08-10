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

// Stack navigator component: sets up app screens with themed headers
const StackNavigator = () => {
  // Theme context: determine current theme mode and colors
  const { userTheme } = useTheme();
  // Resolve colour palette based on theme
  const theme = Colors[userTheme] ?? Colors.light;

  return (
    <>
      {/* StatusBar: adapt style to light or dark mode */}
      <StatusBar style={userTheme === "dark" ? "light" : "dark"} />
      {/* Navigation stack with global header styling */}
      <Stack
        screenOptions={{
          // Header background and tint based on theme
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
          headerTitleAlign: "center",
          // Hide headers by default for custom layout
          headerShown: false,
        }}
      >
        {/* Home screen route: initial landing page */}
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
        />
        {/* Auth flow routes: login and register screens */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Dashboard routes: protected user area with tabs */}
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

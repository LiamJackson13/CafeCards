/**
 * Root App Layout Component
 *
 * This is the main layout component that wraps the entire application with essential providers.
 * It sets up the context providers for Theme, User authentication, and Books data management.
 * Contains the root Stack navigator configuration with theming support and defines the main
 * navigation structure including auth routes, dashboard routes, and the home screen.
 */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/Colors";
import { BooksProvider } from "../contexts/BooksContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { UserProvider } from "../contexts/UserContext";

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

const RootLayout = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <BooksProvider>
          <StackNavigator />
        </BooksProvider>
      </UserProvider>
    </ThemeProvider>
  );
};

export default RootLayout;

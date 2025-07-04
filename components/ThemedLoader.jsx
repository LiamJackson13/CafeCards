/**
 * Themed Loader Component
 *
 * A reusable loading indicator component that displays a centered activity spinner.
 * Automatically applies theme-based color to the loading spinner and provides
 * a full-screen centered layout. Used throughout the app to indicate loading states
 * during data fetching, authentication, and other asynchronous operations.
 */
import { ActivityIndicator, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import ThemedView from "./ThemedView";

const ThemedLoader = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size={"large"} color={theme.text} />
    </ThemedView>
  );
};

export default ThemedLoader;

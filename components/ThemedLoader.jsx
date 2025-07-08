/**
 * ThemedLoader
 *
 * Shows a centered loading spinner with theme-based color.
 */
import { ActivityIndicator, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import ThemedView from "./ThemedView";

const ThemedLoader = ({ size = "large", color, style }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const loaderColor = color || theme.text;

  return (
    <ThemedView
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        style,
      ]}
    >
      <ActivityIndicator size={size} color={loaderColor} />
    </ThemedView>
  );
};

export default ThemedLoader;

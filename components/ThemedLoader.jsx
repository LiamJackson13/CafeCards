/**
 * ThemedLoader
 *
 * Shows a centered loading spinner with theme-based color.
 */
import { ActivityIndicator, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import ThemedView from "./ThemedView";

const ThemedLoader = ({ size = "large", color, style }) => {
  // size: ActivityIndicator size ('small' or 'large')
  // color: optional override for spinner color; defaults to theme text color
  // style: additional styles to apply to the container view
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const loaderColor = color || theme.text; // fallback to theme text color

  return (
    // Centered view wrapping the spinner
    <ThemedView
      style={[
        {
          flex: 1, // fill available space
          justifyContent: "center", // center vertically
          alignItems: "center", // center horizontally
        },
        style, // merge custom styles if provided
      ]}
    >
      {/* Native loading spinner with themed color */}
      <ActivityIndicator size={size} color={loaderColor} />
    </ThemedView>
  );
};

export default ThemedLoader;

/**
 * Themed View Component
 *
 * A reusable container component that automatically applies theme-based background styling.
 * Provides optional safe area handling for proper display on devices with notches/status bars.
 * Automatically adapts background color based on the current theme (light/dark mode).
 * Essential building block for consistent theming throughout the app.
 */
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";

const ThemedView = ({ style, safe = false, ...props }) => {
  const insets = useSafeAreaInsets();
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;
  if (!safe)
    return (
      <View style={[{ backgroundColor: theme.background }, style]} {...props} />
    );

  return (
    <View
      style={[
        {
          backgroundColor: theme.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedView;

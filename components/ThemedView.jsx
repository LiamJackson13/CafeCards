/**
 * ThemedView
 *
 * Container that applies theme-based background color.
 * Optionally adds safe area padding for devices with notches/status bars.
 */
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";

const ThemedView = ({ style, safe = false, ...props }) => {
  // style: additional custom styles to apply to the View
  // safe: when true, adds top/bottom padding based on device safe area insets
  // ...props: other View props (e.g., accessibility, children)
  const insets = useSafeAreaInsets();
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  if (!safe)
    return (
      // Non-safe area view: only theme background applied
      <View style={[{ backgroundColor: theme.background }, style]} {...props} />
    );

  return (
    // Safe area view: applies theme background and insets padding
    <View
      style={[
        {
          backgroundColor: theme.background, // theme's background color
          paddingTop: insets.top, // avoid notch/status bar
          paddingBottom: insets.bottom, // avoid bottom inset
        },
        style, // merge custom styles
      ]}
      {...props}
    />
  );
};

export default ThemedView;

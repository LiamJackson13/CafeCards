/**
 * Themed Text Component
 *
 * A reusable text component that automatically applies theme-based styling.
 * Supports both regular text and title text with different color schemes.
 * Automatically adapts text color based on the current theme (light/dark mode)
 * and whether it's a title or regular text element.
 */
import { Text } from "react-native";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";

const ThemedText = ({ style, title = false, ...props }) => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;
  const textColor = title ? theme.title : theme.text;

  return <Text style={[{ color: textColor }, style]} {...props} />;
};

export default ThemedText;

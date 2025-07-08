/**
 * ThemedText
 *
 * Reusable text component that applies theme-based color automatically.
 * Uses a different color for titles if `title` prop is true.
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

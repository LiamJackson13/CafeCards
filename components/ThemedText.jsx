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
  // style: optional custom styles to merge with theme color
  // title: if true, apply the theme's `title` color, otherwise use `text` color
  // ...props: other Text props such as `children`, `numberOfLines`, etc.
  const { userTheme } = useTheme();
  const theme = Colors[userTheme] ?? Colors.light;
  const textColor = title ? theme.title : theme.text;

  // Render a Text element with the resolved theme color and merged styles/props
  return <Text style={[{ color: textColor }, style]} {...props} />;
};

export default ThemedText;

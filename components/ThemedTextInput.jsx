/**
 * ThemedTextInput
 *
 * Reusable text input with theme-based styling.
 * Applies consistent appearance and adapts to light/dark mode.
 * Optimizes for web (removes outline, sets cursor/user-select).
 */
import { Platform, TextInput } from "react-native";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";

const ThemedTextInput = ({ style, ...props }) => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  // Platform-specific tweaks for web
  const webStyles =
    Platform.OS === "web"
      ? {
          outline: "none",
          cursor: "text",
          userSelect: "text",
          WebkitUserSelect: "text",
          MozUserSelect: "text",
          msUserSelect: "text",
        }
      : {};

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          padding: 20,
          borderRadius: 6,
          ...webStyles,
        },
        style,
      ]}
      placeholderTextColor={theme.iconColor}
      autoComplete="off"
      autoCorrect={false}
      spellCheck={false}
      {...props}
    />
  );
};

export default ThemedTextInput;

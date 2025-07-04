/**
 * Themed Text Input Component
 *
 * A reusable text input component that automatically applies theme-based styling.
 * Provides consistent input field appearance across the app with proper theming support.
 * Includes platform-specific optimizations for web (outline removal, cursor styling).
 * Automatically adapts colors based on current theme and provides standard input styling
 * like padding, border radius, and background colors.
 */
import { Platform, TextInput } from "react-native";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";

const ThemedTextInput = ({ style, ...props }) => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

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

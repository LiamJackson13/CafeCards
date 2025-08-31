/**
 * ThemedTextInput
 */
import { Platform, TextInput } from "react-native";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";

const ThemedTextInput = ({ style, ...props }) => {
  // style: custom styles to merge with the themed TextInput container
  // ...props: additional TextInput props (e.g., value, onChangeText, placeholder)
  const { userTheme } = useTheme();
  const theme = Colors[userTheme] ?? Colors.light;

  // Platform-specific tweaks for web
  const webStyles =
    Platform.OS === "web"
      ? {
          // Remove default focus outline and enable text selection on web
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
        // Base input styles: themed background, text color, padding, and rounded corners
        {
          backgroundColor: theme.uiBackground,
          color: theme.text,
          padding: 20,
          borderRadius: 6,
          ...webStyles, // apply web-specific overrides when on web
        },
        style,
      ]}
      // Use theme icon color for placeholder text
      placeholderTextColor={theme.iconColor}
      // Disable native text corrections and suggestions for consistency
      autoComplete="off"
      autoCorrect={false}
      spellCheck={false}
      // Spread any additional TextInput props passed in
      {...props}
    />
  );
};

export default ThemedTextInput;

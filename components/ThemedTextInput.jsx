import { Platform, TextInput, useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";

const ThemedTextInput = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

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

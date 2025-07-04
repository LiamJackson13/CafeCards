/**
 * Themed Card Component
 *
 * A reusable card container component that provides consistent card styling throughout the app.
 * Automatically applies theme-based background colors and includes standard card styling
 * like padding, border radius, and shadow effects. Used for displaying content in
 * card-based layouts such as loyalty cards, team cards, and other grouped content.
 */
import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";

const ThemedCard = ({ style, ...props }) => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  return (
    <View
      style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
      {...props}
    />
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 20,
  },
});

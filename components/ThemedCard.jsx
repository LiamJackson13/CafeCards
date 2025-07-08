/**
 * ThemedCard
 *
 * Simple reusable card container with theme-based background.
 * Use for grouping content in a card layout.
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
    borderRadius: 5, // Rounded corners
    padding: 20, // Standard padding
  },
});

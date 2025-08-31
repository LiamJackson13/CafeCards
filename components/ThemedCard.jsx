/**
 * ThemedCard
 */
import { StyleSheet, View } from "react-native";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";

const ThemedCard = ({ style, ...props }) => {
  // style: custom styles to merge with base card styles
  // ...props: other View props (e.g., accessibility, testID)
  const { userTheme } = useTheme();
  const theme = Colors[userTheme] ?? Colors.light;

  return (
    // Container view applying theme background and card styling
    <View
      // backgroundColor: use the theme's UI background color
      style={[
        { backgroundColor: theme.uiBackground },
        styles.card, // base card styles: rounded corners and padding
        style, // any additional custom styles passed in
      ]}
      {...props}
    />
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    // Rounded corners for card container
    borderRadius: 5,
    // Default padding inside card
    padding: 20,
  },
});

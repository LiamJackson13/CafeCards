import { StyleSheet } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";

/**
 * LogoutButton
 *
 * Button for signing out of the app.
 */
const LogoutButton = ({ onPress }) => (
  // onPress: callback invoked when user taps the sign-out button
  <ThemedButton onPress={onPress} style={styles.logoutButton}>
    {/* Button label text */}
    <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
  </ThemedButton>
);

const styles = StyleSheet.create({
  // Style for the logout button container
  logoutButton: {
    backgroundColor: "#FF3B30", // red indicates destructive action
    marginHorizontal: 20, // horizontal spacing from screen edges
  },
  // Text styling for the sign-out label
  logoutText: {
    color: "#fff", // white text for contrast on red
    fontSize: 16, // readable text size
    fontWeight: "600", // semi-bold emphasis
    textAlign: "center", // center text within button
  },
});

export default LogoutButton;

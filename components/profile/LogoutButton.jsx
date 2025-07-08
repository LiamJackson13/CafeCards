import { StyleSheet } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";

/**
 * LogoutButton
 *
 * Button for signing out of the app.
 */
const LogoutButton = ({ onPress }) => (
  <ThemedButton onPress={onPress} style={styles.logoutButton}>
    <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
  </ThemedButton>
);

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: "#FF3B30",
    marginHorizontal: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default LogoutButton;

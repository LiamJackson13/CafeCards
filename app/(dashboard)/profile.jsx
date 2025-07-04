/**
 * User Profile Screen
 *
 * This screen displays user profile information and account management options.
 * Features include:
 * - Display of user email/account information
 * - Theme toggle for switching between light/dark modes
 * - Logout functionality
 * - Navigation links to other app sections (teams)
 * - Welcome message and app description
 * - Themed styling with safe area support
 */
import { StyleSheet, Text } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import ThemeToggle from "../../components/ThemeToggle";
import { useUser } from "../../hooks/useUser";

const ProfileScreen = () => {
  const { logout, user } = useUser();

  return (
    <ThemedView style={styles.container} safe>
      <ThemedText title style={styles.heading}>
        {user.email}
      </ThemedText>
      <Spacer />
      <ThemedText style={{ textAlign: "center" }}>
        Easily access all your cafe loyalty cards!
      </ThemedText>

      <Spacer />
      <ThemeToggle />
      <Spacer />
      <ThemedButton onPress={logout}>
        <Text style={{ color: "#f2f2f2" }}>Logout</Text>
      </ThemedButton>
    </ThemedView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },
});

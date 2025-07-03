import { StyleSheet, Text } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
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
        Time to start reading some books...
      </ThemedText>

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

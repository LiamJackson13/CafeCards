import { StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const ProfileScreen = () => {
  return (
    <ThemedView style={styles.container} safe>
      <ThemedText title style={styles.heading}>
        Your Email
      </ThemedText>
      <Spacer />
      <ThemedText style={{ textAlign: "center" }}>
        Time to start reading some books...
      </ThemedText>
      <Spacer />
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

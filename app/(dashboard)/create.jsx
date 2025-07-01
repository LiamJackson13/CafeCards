import { StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const CreateScreen = () => {
  return (
    <ThemedView style={styles.container} safe>
      <ThemedText title style={styles.heading}>
        Create a New Book
      </ThemedText>
      <Spacer />
    </ThemedView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

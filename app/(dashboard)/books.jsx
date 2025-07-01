import { StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const BooksScreen = () => {
  return (
    <ThemedView style={styles.container} safe>
      <Spacer />
      <ThemedText title style={styles.heading}>
        Your Reading List
      </ThemedText>
    </ThemedView>
  );
};

export default BooksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

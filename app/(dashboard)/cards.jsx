/**
 * Loyalty Cards Screen
 *
 * This screen displays the user's collection of cafe loyalty cards.
 * Features include:
 * - List view of all user's loyalty cards/books
 * - Card navigation to individual card details
 * - Pressable cards that navigate to detailed card view
 * - Empty state handling for users with no cards
 * - Integration with BooksContext for card data management
 * - Themed styling with consistent card layout
 */
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useBooks } from "../../hooks/useBooks";

const BooksScreen = () => {
  const { books } = useBooks();
  const router = useRouter();

  return (
    <ThemedView style={styles.container} safe>
      <Spacer />
      <ThemedText title style={styles.heading}>
        Your Cards
      </ThemedText>
      <Spacer />
      <FlatList
        data={books}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/books/${item.$id}`)}>
            <ThemedCard style={styles.card}>
              <ThemedText style={styles.title} title>
                {item.title}
              </ThemedText>
              <ThemedText>You have {item.author} stamps</ThemedText>
            </ThemedCard>
          </Pressable>
        )}
      />
    </ThemedView>
  );
};

export default BooksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    marginTop: 30,
    paddingBottom: 30,
  },
  card: {
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,
    padding: 10,
    paddingLeft: 14,
    borderLeftColor: Colors.primary,
    borderLeftWidth: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

/**
 * Individual Card/Book Details Screen
 *
 * This screen displays detailed information for a specific loyalty card or book.
 * Features include:
 * - Dynamic routing based on card/book ID parameter
 * - Display of card title, author, and description
 * - Delete functionality for removing cards
 * - Loading states while fetching card data
 * - Navigation back to cards list after deletion
 * - Error handling for missing or invalid cards
 * - Themed card layout with action buttons
 */

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useBooks } from "../../../hooks/useBooks";

// themed components
import ThemedText from "../../../components/ThemedText";
// import ThemedButton from "../../../components/ThemedButton";
import Spacer from "../../../components/Spacer";
import ThemedButton from "../../../components/ThemedButton";
import ThemedCard from "../../../components/ThemedCard";
import ThemedLoader from "../../../components/ThemedLoader";
import ThemedView from "../../../components/ThemedView";
import { Colors } from "../../../constants/Colors";

const BookDetails = () => {
  const [book, setBook] = useState(null);

  const { id } = useLocalSearchParams();
  const { fetchBookById, deleteBook } = useBooks();
  const router = useRouter();

  const handleDelete = async () => {
    await deleteBook(id);
    setBook(null);
    router.replace("/cards");
  };

  useEffect(() => {
    async function loadBook() {
      const bookData = await fetchBookById(id);
      setBook(bookData);
    }

    loadBook();
  }, [id]);

  if (!book) {
    return (
      <ThemedView safe style={styles.container}>
        <ThemedLoader />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safe>
      <ThemedCard style={styles.card}>
        <ThemedText style={styles.title}>{book.title}</ThemedText>
        <ThemedText>Cafe Name: {book.author}</ThemedText>
        <Spacer />
        <ThemedText title>Cafe Description:</ThemedText>
        <Spacer height={10} />
        <ThemedText>{book.description}</ThemedText>
      </ThemedCard>
      <ThemedButton style={styles.delete} onPress={handleDelete}>
        <Text style={{ color: "#fff", textAlign: "center" }}>Delete Card</Text>
      </ThemedButton>
    </ThemedView>
  );
};

export default BookDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
  },
  card: {
    margin: 20,
  },
  delete: {
    marginTop: 40,
    backgroundColor: Colors.warning,
    width: 200,
    alignSelf: "center",
  },
});

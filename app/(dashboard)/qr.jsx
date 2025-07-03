import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { useBooks } from "../../hooks/useBooks";

import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedView from "../../components/ThemedView";

const CreateScreen = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { createBook } = useBooks();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim() || !description.trim()) return;

    setLoading(true);

    await createBook({ title, author, description });

    // reset form fields
    setTitle("");
    setAuthor("");
    setDescription("");

    // redirect
    router.replace("/cards");

    // reset loading state
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : undefined}
    >
      <ThemedView style={styles.container}>
        <ThemedText title style={styles.heading}>
          Add a new Card
        </ThemedText>
        <Spacer />
        <ThemedTextInput
          style={styles.input}
          placeholder="Cafe Name"
          // placeholder="Book Title"
          value={title}
          onChangeText={setTitle}
          autoFocus={false}
        />
        <Spacer />
        <ThemedTextInput
          style={styles.input}
          placeholder="Stamps Added"
          value={author}
          onChangeText={setAuthor}
          keyboardType="numeric"
        />
        <Spacer />
        <ThemedTextInput
          style={styles.multiline}
          placeholder="Cafe Details"
          // placeholder="Card Description"
          value={description}
          onChangeText={setDescription}
          multiline={true}
        />
        <Spacer />
        <ThemedButton onPress={handleSubmit} disabled={loading}>
          <Text style={{ color: "#fff" }}>
            {loading ? "Saving..." : "Add Card"}
          </Text>
        </ThemedButton>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web" && {
      minHeight: "100vh",
      paddingVertical: 20,
      width: "100%",
    }),
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    padding: 20,
    borderRadius: 6,
    alignSelf: "stretch",
    marginHorizontal: 40,
    ...(Platform.OS === "web" && {
      maxWidth: 400,
      width: "calc(100% - 80px)",
      boxSizing: "border-box",
      alignSelf: "center",
    }),
  },
  multiline: {
    padding: 20,
    borderRadius: 6,
    minHeight: 100,
    alignSelf: "stretch",
    marginHorizontal: 40,
    ...(Platform.OS === "web" && {
      maxWidth: 400,
      width: "calc(100% - 80px)",
      boxSizing: "border-box",
      resize: "vertical",
      alignSelf: "center",
    }),
  },
});

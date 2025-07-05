/**
 * Name Modal Component
 *
 * A modal dialog for updating the user's display name.
 * Features:
 * - Input validation (required, length limits)
 * - Loading states during API calls
 * - Error handling and display
 * - Success feedback
 * - Themed styling with safe area support
 */
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { updateUserName } from "../../lib/appwrite";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import ThemedTextInput from "../ThemedTextInput";
import ThemedView from "../ThemedView";

const NameModal = ({ visible, onClose, currentName, onNameUpdated }) => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  const [name, setName] = useState(currentName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }

    if (name.trim().length > 128) {
      setError("Name cannot be longer than 128 characters");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await updateUserName(name.trim());

      // Call the callback to update the user state
      if (onNameUpdated) {
        onNameUpdated(updatedUser);
      }

      Alert.alert("Success", "Your name has been updated successfully", [
        { text: "OK", onPress: onClose },
      ]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName(currentName || "");
      setError("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.overlay}>
          <ThemedView style={[styles.modal, { borderColor: theme.border }]}>
            <View style={styles.header}>
              <ThemedText type="subtitle" style={styles.title}>
                Update Your Name
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Enter your display name for your profile
              </ThemedText>
            </View>

            <View style={styles.content}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Full Name</ThemedText>
                <ThemedTextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={128}
                  editable={!loading}
                  style={styles.input}
                />
                {error ? (
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                ) : null}
              </View>
            </View>

            <View style={styles.actions}>
              <ThemedButton
                onPress={handleClose}
                style={[styles.button, styles.cancelButton]}
                disabled={loading}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </ThemedButton>

              <ThemedButton
                onPress={handleSubmit}
                style={[
                  styles.button,
                  styles.updateButton,
                  { backgroundColor: theme.primary },
                ]}
                disabled={loading || !name.trim()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ThemedText style={styles.updateButtonText}>
                    Update Name
                  </ThemedText>
                )}
              </ThemedButton>
            </View>
          </ThemedView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  content: {
    padding: 24,
    paddingTop: 8,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    minHeight: 44,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    padding: 24,
    paddingTop: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  updateButton: {
    backgroundColor: "#007AFF",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NameModal;

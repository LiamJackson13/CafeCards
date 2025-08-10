/**
 * NameModal
 *
 * Modal dialog for updating the user's display name.
 * - Input validation (required, length limits)
 * - Loading and error states
 * - Success feedback
 * - Themed styling
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
import { useUser } from "../../hooks/useUser";
import {
  createCafeProfile,
  updateCafeProfile,
} from "../../lib/appwrite/cafe-profiles";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import ThemedTextInput from "../ThemedTextInput";
import ThemedView from "../ThemedView";

const NameModal = ({
  visible,
  onClose,
  currentName,
  onNameUpdated,
  isCafeUser = false,
  cafeProfileId,
}) => {
  // visible: controls modal visibility
  // onClose: callback to close the modal
  // currentName: pre-filled user name string
  // onNameUpdated: callback when name update succeeds
  // isCafeUser: flag indicating cafe manager context
  // cafeProfileId: ID for existing cafe profile to update

  const { user, updateName } = useUser();
  // user: current authenticated user object
  // updateName: context function to update auth user name
  const { userTheme } = useTheme();
  const theme = Colors[userTheme] ?? Colors.light;

  const [name, setName] = useState(currentName || "");
  // name: controlled input state for display name
  const [loading, setLoading] = useState(false);
  // loading: spinner flag during async operations
  const [error, setError] = useState("");
  // error: string for validation or submission errors

  // Handle submit: validate and update name
  const handleSubmit = async () => {
    // Clear previous errors
    setError("");
    // Required field validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    // Minimum length validation
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      return;
    }
    // Maximum length validation
    if (name.trim().length > 128) {
      setError("Name cannot be longer than 128 characters");
      return;
    }
    try {
      // Start loading spinner
      setLoading(true);
      if (isCafeUser) {
        // Manager updating or creating cafe profile
        if (cafeProfileId) {
          // Update existing cafe profile name
          await updateCafeProfile(cafeProfileId, { cafeName: name.trim() });
        } else {
          // Create new cafe profile if none exists
          await createCafeProfile({ cafeName: name.trim() }, user.$id);
          if (onNameUpdated) onNameUpdated(name.trim());
        }
        // Also update auth context username
        await updateName(name.trim());
        if (onNameUpdated && cafeProfileId) onNameUpdated(name.trim());
      } else {
        // Customer updating their auth user name
        const updatedUser = await updateName(name.trim());
        if (onNameUpdated) onNameUpdated(updatedUser);
      }
      // Success alert with close on OK
      Alert.alert("Success", "Your name has been updated successfully", [
        { text: "OK", onPress: onClose },
      ]);
    } catch (error) {
      // Show API or network errors
      setError(error.message);
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  // Reset state and close modal
  const handleClose = () => {
    // Only allow close when not loading
    if (!loading) {
      setName(currentName || "");
      setError("");
      onClose();
    }
  };

  return (
    <Modal
      // Modal wrapper with slide animation
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        // Adjust view to avoid keyboard on iOS/Android
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.overlay}>
          <ThemedView style={[styles.modal, { borderColor: theme.border }]}>
            {/* Main modal container */}
            <View style={styles.header}>
              {/* Header with title and subtitle */}
              <ThemedText type="subtitle" style={styles.title}>
                Update Your Name
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Enter your display name for your profile
              </ThemedText>
            </View>

            <View style={styles.content}>
              {/* Input section for name entry */}
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
              {/* Action buttons: Cancel and Update */}
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
                    Update
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
  // Overlay covering full screen behind modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // Card container for modal content with border and shadow
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
  // Header area with title/subtitle
  header: {
    padding: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  // Title text style
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  // Subtitle text style under title
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  // Main content area padding
  content: {
    padding: 24,
    paddingTop: 8,
  },
  // Container for input and error
  inputContainer: {
    marginBottom: 8,
  },
  // Label above text input
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  // Text input field styling
  input: {
    minHeight: 44,
  },
  // Error message text styling
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 8,
  },
  // Container wrapping Cancel and Update buttons
  actions: {
    flexDirection: "row",
    padding: 24,
    paddingTop: 16,
    gap: 12,
  },
  // Base style for both action buttons
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  // Cancel button style overrides
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  // Text style for Cancel button label
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // Style override for Update button
  updateButton: {
    backgroundColor: "#007AFF",
  },
  // Text style for Update button label
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NameModal;

/**
 * ProfilePictureModal
 *
 * Modal for selecting, taking, or removing profile pictures.
 * Provides options for camera, gallery, and removal actions.
 */

import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

const ProfilePictureModal = ({
  visible, // controls modal visibility
  onClose, // callback to close modal (e.g., backdrop press)
  onTakePhoto, // triggers camera capture
  onPickImage, // opens image gallery picker
  onRemovePhoto, // removes current profile photo
  hasProfilePicture, // indicates if a profile picture exists
  uploading, // true while a new photo is uploading
}) => {
  const { userTheme } = useTheme();
  const theme = Colors[userTheme] ?? Colors.light;

  return (
    <Modal
      animationType="fade" // fade-in transition
      transparent={true} // overlay allows see-through backdrop
      visible={visible} // binds modal visibility
      onRequestClose={onClose} // handle hardware back button
    >
      {/* Full-screen backdrop */}
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          {/* Prevent backdrop close when interacting inside modal */}
          <Pressable onPress={(e) => e.stopPropagation()}>
            <ThemedView
              style={[styles.modal, { backgroundColor: theme.background }]}
            >
              {/* Modal header title */}
              <ThemedText type="subtitle" style={styles.title}>
                Profile Picture
              </ThemedText>

              {/* Action buttons for photo options */}
              <View style={styles.options}>
                <ThemedButton
                  onPress={onTakePhoto} // open camera
                  disabled={uploading}
                  style={[styles.optionButton, { borderColor: theme.border }]}
                >
                  <ThemedText style={styles.optionText}>
                    📷 Take Photo
                  </ThemedText>
                </ThemedButton>

                <ThemedButton
                  onPress={onPickImage} // open gallery
                  disabled={uploading}
                  style={[styles.optionButton, { borderColor: theme.border }]}
                >
                  <ThemedText style={styles.optionText}>
                    🖼️ Choose from Gallery
                  </ThemedText>
                </ThemedButton>

                {hasProfilePicture && (
                  <ThemedButton
                    onPress={onRemovePhoto} // remove current photo
                    disabled={uploading}
                    style={[
                      styles.optionButton,
                      styles.removeButton,
                      { borderColor: theme.error || "#FF6B6B" },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.optionText,
                        { color: theme.error || "#FF6B6B" },
                      ]}
                    >
                      🗑️ Remove Photo
                    </ThemedText>
                  </ThemedButton>
                )}
              </View>

              {/* Cancel action at bottom */}
              <ThemedButton
                onPress={onClose}
                style={[styles.cancelButton, { backgroundColor: theme.border }]}
              >
                <ThemedText style={styles.cancelText}>Cancel</ThemedText>
              </ThemedButton>

              {uploading && (
                /* Upload status indicator */
                <View style={styles.uploadingContainer}>
                  <ThemedText style={styles.uploadingText}>
                    Uploading...
                  </ThemedText>
                </View>
              )}
            </ThemedView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    // Full-screen semi-transparent backdrop
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    // Outer wrapper with shadow and rounded corners
    margin: 20,
    borderRadius: 20,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modal: {
    // Inner card container with padding
    borderRadius: 20,
    padding: 20,
    minWidth: 280,
  },
  title: {
    // Title text at top of modal
    textAlign: "center",
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  options: {
    // Container wrapping option buttons
    marginBottom: 15,
  },
  optionButton: {
    // Styling for each option button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  removeButton: {
    // Additional style for remove action
    backgroundColor: "transparent",
  },
  optionText: {
    // Text style inside option buttons
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    // Style for cancel button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelText: {
    // Text styling for cancel label
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  uploadingContainer: {
    // Container for 'Uploading...' indicator
    marginTop: 15,
    paddingVertical: 10,
  },
  uploadingText: {
    // Text style for upload status
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default ProfilePictureModal;

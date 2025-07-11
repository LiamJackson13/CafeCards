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
  visible,
  onClose,
  onTakePhoto,
  onPickImage,
  onRemovePhoto,
  hasProfilePicture,
  uploading,
}) => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.background }]}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <ThemedView
              style={[styles.modal, { backgroundColor: theme.background }]}
            >
              {/* Header */}
              <ThemedText type="subtitle" style={styles.title}>
                Profile Picture
              </ThemedText>

              {/* Options */}
              <View style={styles.options}>
                <ThemedButton
                  onPress={onTakePhoto}
                  disabled={uploading}
                  style={[styles.optionButton, { borderColor: theme.border }]}
                >
                  <ThemedText style={styles.optionText}>
                    📷 Take Photo
                  </ThemedText>
                </ThemedButton>

                <ThemedButton
                  onPress={onPickImage}
                  disabled={uploading}
                  style={[styles.optionButton, { borderColor: theme.border }]}
                >
                  <ThemedText style={styles.optionText}>
                    🖼️ Choose from Gallery
                  </ThemedText>
                </ThemedButton>

                {hasProfilePicture && (
                  <ThemedButton
                    onPress={onRemovePhoto}
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

              {/* Cancel Button */}
              <ThemedButton
                onPress={onClose}
                style={[styles.cancelButton, { backgroundColor: theme.border }]}
              >
                <ThemedText style={styles.cancelText}>Cancel</ThemedText>
              </ThemedButton>

              {uploading && (
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
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    margin: 20,
    borderRadius: 20,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modal: {
    borderRadius: 20,
    padding: 20,
    minWidth: 280,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  options: {
    marginBottom: 15,
  },
  optionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  removeButton: {
    backgroundColor: "transparent",
  },
  optionText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  uploadingContainer: {
    marginTop: 15,
    paddingVertical: 10,
  },
  uploadingText: {
    textAlign: "center",
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default ProfilePictureModal;

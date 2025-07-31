import { Modal, StyleSheet, TextInput, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * ManualEntryModal Component:
 * - Props:
 *   visible: controls modal visibility
 *   onClose: callback to close modal
 *   cardId: current input value
 *   setCardId: updates cardId state
 *   onSubmit: handler for submit action
 *   isProcessing: disables input during processing
 */
const ManualEntryModal = ({
  visible,
  onClose,
  cardId,
  setCardId,
  onSubmit,
  isProcessing,
}) => {
  // Handle cancel: close modal and reset input value
  const handleCancel = () => {
    onClose();
    setCardId("");
  };

  // Render modal with input and action buttons
  return (
    <Modal visible={visible} transparent onRequestClose={handleCancel}>
      <View style={styles.modalOverlay}>
        {/* Modal container card */}
        <ThemedCard style={styles.modalContent}>
          {/* Title */}
          <ThemedText type="title" style={styles.modalTitle}>
            Manual Card Entry
          </ThemedText>

          {/* Subtitle explaining input */}
          <ThemedText style={styles.modalSubtitle}>
            Enter the customer&apos;s card ID or QR code data
          </ThemedText>

          {/* Text input for manual card ID entry */}
          <TextInput
            style={styles.textInput}
            value={cardId}
            onChangeText={setCardId}
            placeholder="Enter card ID..."
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          {/* Action buttons: Cancel and Add Stamp */}
          <View style={styles.modalButtons}>
            <ThemedButton
              onPress={handleCancel}
              style={[
                styles.modalButton,
                styles.cancelButton,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <ThemedText style={{ color: "#fff" }}>Cancel</ThemedText>
            </ThemedButton>

            <ThemedButton
              onPress={onSubmit}
              style={[
                styles.modalButton,
                styles.submitButton,
                { justifyContent: "center", alignItems: "center" },
              ]}
              disabled={isProcessing || !cardId.trim()}
            >
              <ThemedText style={{ color: "#fff" }}>
                {isProcessing ? "Processing..." : "Add Stamp"}
              </ThemedText>
            </ThemedButton>
          </View>
        </ThemedCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Overlay covering entire screen with semi-transparent background
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // Card container for modal content
  modalContent: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
  },
  // Title text at top of modal
  modalTitle: {
    textAlign: "center",
    marginBottom: 10,
  },
  // Subtitle text under title
  modalSubtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
  },
  // Text input styling for ID entry
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  // Container for modal action buttons
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  // Base style for both Cancel and Submit buttons
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
  },
  // Cancel button styling
  cancelButton: {
    backgroundColor: "#666",
  },
  // Submit button styling (Add Stamp)
  submitButton: {
    backgroundColor: "#007AFF",
  },
});

export default ManualEntryModal;

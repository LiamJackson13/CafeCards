import { Modal, StyleSheet, TextInput, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const ManualEntryModal = ({
  visible,
  onClose,
  cardId,
  setCardId,
  onSubmit,
  isProcessing,
}) => {
  const handleCancel = () => {
    onClose();
    setCardId("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <ThemedCard style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>
            Manual Card Entry
          </ThemedText>

          <ThemedText style={styles.modalSubtitle}>
            Enter the customer&apos;s card ID or QR code data
          </ThemedText>

          <TextInput
            style={styles.textInput}
            value={cardId}
            onChangeText={setCardId}
            placeholder="Enter card ID..."
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          <View style={styles.modalButtons}>
            <ThemedButton
              title="Cancel"
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
              title={isProcessing ? "Processing..." : "Add Stamp"}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
});

export default ManualEntryModal;

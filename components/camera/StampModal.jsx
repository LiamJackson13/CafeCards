import { useRef } from "react";
import { Modal, StyleSheet, View } from "react-native";
import IncrementDecrement from "../IncrementDecrement";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * StampModal
 *
 * Modal for adding stamps to a customer's card.
 * - Prevents multiple submissions by disabling the confirm button after first press.
 */
const StampModal = ({
  visible,
  onClose,
  pendingCustomer,
  stampsToAdd,
  setStampsToAdd,
  onConfirm,
  isProcessing,
}) => {
  // Prevent multiple presses of the confirm button
  const pressedRef = useRef(false);

  // Handle confirm: only allow once per open
  const handleConfirm = () => {
    if (pressedRef.current) return;
    pressedRef.current = true;
    onConfirm();
  };

  // Reset pressedRef when modal closes
  if (!visible && pressedRef.current) {
    pressedRef.current = false;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedCard style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>
            Add Stamps
          </ThemedText>

          {/* Show customer info if available */}
          {pendingCustomer && (
            <>
              <ThemedText style={styles.customerInfoText}>
                Customer: {pendingCustomer.name}
              </ThemedText>
              <ThemedText style={styles.customerEmailText}>
                {pendingCustomer.email}
              </ThemedText>
            </>
          )}

          <ThemedText style={styles.modalSubtitle}>
            How many stamps would you like to add?
          </ThemedText>

          <IncrementDecrement
            value={stampsToAdd}
            setValue={setStampsToAdd}
            min={1}
            max={10}
          />

          <View style={styles.modalButtons}>
            <ThemedButton
              onPress={onClose}
              style={[styles.modalButton, styles.cancelButton]}
              disabled={isProcessing}
            >
              <ThemedText style={{ color: "#fff" }}>Cancel</ThemedText>
            </ThemedButton>

            <ThemedButton
              onPress={handleConfirm}
              style={[styles.modalButton, styles.submitButton]}
              disabled={isProcessing || stampsToAdd < 1 || pressedRef.current}
            >
              <ThemedText style={{ color: "#fff" }}>
                {isProcessing
                  ? "Adding..."
                  : `Add ${stampsToAdd} Stamp${stampsToAdd !== 1 ? "s" : ""}`}
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
  customerInfoText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  customerEmailText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 20,
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

export default StampModal;

import { useRef } from "react";
import { Modal, StyleSheet, View } from "react-native";
import IncrementDecrement from "../IncrementDecrement";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * StampModal
 *
 * Modal dialog for cafe staff to add stamps to a customer’s loyalty card.
 * Props:
 * - visible: boolean to show/hide the modal
 * - onClose: callback to close the modal
 * - pendingCustomer: customer object to display name/email
 * - stampsToAdd: current number of stamps selected
 * - setStampsToAdd: setter for stampsToAdd state
 * - onConfirm: callback to perform the stamp addition
 * - isProcessing: disables inputs/buttons while the transaction is in progress
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
  // Ref guard to prevent multiple confirm submissions
  const pressedRef = useRef(false);

  /**
   * handleConfirm
   * Ensures the confirm action only fires once per modal open.
   */
  const handleConfirm = () => {
    if (pressedRef.current) return; // Already pressed—ignore
    pressedRef.current = true; // Mark as pressed
    onConfirm(); // Invoke parent confirm logic
  };

  // Reset the press guard when modal is closed
  if (!visible && pressedRef.current) {
    pressedRef.current = false;
  }

  return (
    <Modal
      visible={visible} // Control modal visibility
      animationType="slide" // Slide-in animation
      transparent // Allow overlay transparency
      onRequestClose={onClose} // Android back button handler
    >
      <View style={styles.modalOverlay}>

        {/* Dark semi-transparent backdrop */}
        <ThemedCard style={styles.modalContent}>

          {/* White card container */}
          <ThemedText type="title" style={styles.modalTitle}>
            Add Stamps {/* Modal header */}
          </ThemedText>
          {/* Display customer info if available */}
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
            How many stamps would you like to add? {/* Instruction text */}
          </ThemedText>
          {/* Increment/decrement control for stamp count */}
          <IncrementDecrement
            value={stampsToAdd} // Current count
            setValue={setStampsToAdd} // Update handler
            min={1}
            max={10}
          />
          {/* Action buttons row */}
          <View style={styles.modalButtons}>
            {/* Cancel button */}
            <ThemedButton
              onPress={onClose} // Close modal
              style={[styles.modalButton, styles.cancelButton]}
              disabled={isProcessing} // Disable during processing
            >
              <ThemedText style={{ color: "#fff" }}>Cancel</ThemedText>
            </ThemedButton>

            {/* Confirm add-stamps button */}
            <ThemedButton
              onPress={handleConfirm} // Guarded confirm handler
              style={[styles.modalButton, styles.submitButton]}
              disabled={
                isProcessing || // Disable if processing
                stampsToAdd < 1 || // Disable if no stamps chosen
                pressedRef.current // Disable after first press
              }
            >
              <ThemedText style={{ color: "#fff" }}>
                {isProcessing
                  ? "Adding…" // Show spinner text
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
    // Fullscreen backdrop behind the card
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    // Card container for modal content
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    // Header text style
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    // Instructional text style
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
  },
  customerInfoText: {
    // Customer name display styling
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  customerEmailText: {
    // Customer email display styling
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    // Container for cancel/submit buttons
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    // Base style for both action buttons
    flex: 1,
    padding: 15,
    borderRadius: 8,
  },
  cancelButton: {
    // Cancel button background color
    backgroundColor: "#666",
  },
  submitButton: {
    // Confirm button background color
    backgroundColor: "#007AFF",
  },
});

export default StampModal;

import { Modal, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useUser } from "../../hooks/useUser";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * QRCodeModal
 *
 * Shows a modal with a QR code for reward redemption.
 * - Ensures the QR data uses the current user's name.
 * - Displays available rewards and instructions.
 */
const QRCodeModal = ({ visible, onClose, qrData, availableRewards, theme }) => {
  const { user } = useUser();

  if (!qrData) return null; // don't render if no QR payload

  // Parse and inject current user's name into QR payload if applicable
  let modifiedQRData = qrData;
  try {
    // Try parsing JSON to update payload metadata
    const parsedData = JSON.parse(qrData);
    if (parsedData.type === "reward_redemption" && user?.name) {
      // Assign current user's name for redemption record
      parsedData.customerName = user.name;
      modifiedQRData = JSON.stringify(parsedData);
    }
  } catch (error) {
    // Fallback to original data if parsing fails
    console.warn("Could not parse QR data:", error);
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>

        {/* dark translucent backdrop */}
        <ThemedCard style={styles.modalContent}>

          {/* card container */}
          <ThemedText style={styles.modalTitle}>

           {/* modal heading */}
            🎉 Redeem Your Free Coffee!
          </ThemedText>
          <ThemedText style={styles.modalSubtitle}>

            {/* instruction subtitle */}
            Show this QR code to the cafe staff to redeem one of your
            {availableRewards || 1} available reward
            {(availableRewards || 1) > 1 ? "s" : ""}
          </ThemedText>
          <View style={styles.qrContainer}>

            {/* QR code wrapper */}
            <QRCode
              value={modifiedQRData}
              size={200}
              backgroundColor="white"
              color="black"
            />
          </View>
          <ThemedText style={styles.qrInstructions}>

            {/* usage hint */}
            Present this code at the counter for scanning
          </ThemedText>
          <ThemedText style={[styles.statusText, { color: theme.primary }]}>
                   {/* waiting status */}
            ⏱️ Waiting for cafe to scan...
         </ThemedText>
          <ThemedButton
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: theme.primary }]}
          >
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </ThemedButton>
        </ThemedCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Full-screen backdrop with semi-transparent black
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // Main card container for QR and instructions
  modalContent: {
    width: "100%",
    maxWidth: 350,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  // Title text at top of modal
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  // Subtitle/instructions under title
  modalSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 25,
    lineHeight: 20,
  },
  // Container styling around the QR code graphic
  qrContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Instructions label under QR code
  qrInstructions: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 15,
  },
  // Status text shown while waiting for scan
  statusText: {
    fontSize: 11,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
    marginBottom: 25,
  },
  // Style for the close button wrapper
  closeButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  // Text style inside the close button
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default QRCodeModal;

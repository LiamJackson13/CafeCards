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

  if (!qrData) return null;

  // Parse and modify QR data to ensure it uses the current user's name
  let modifiedQRData = qrData;
  try {
    const parsedData = JSON.parse(qrData);
    if (parsedData.type === "reward_redemption" && user?.name) {
      parsedData.customerName = user.name;
      modifiedQRData = JSON.stringify(parsedData);
    }
  } catch (error) {
    // If parsing fails, use original data
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
        <ThemedCard style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>
            🎉 Redeem Your Free Coffee!
          </ThemedText>

          <ThemedText style={styles.modalSubtitle}>
            Show this QR code to the cafe staff to redeem one of your
            {availableRewards || 1} available reward
            {(availableRewards || 1) > 1 ? "s" : ""}
          </ThemedText>

          <View style={styles.qrContainer}>
            <QRCode
              value={modifiedQRData}
              size={200}
              backgroundColor="white"
              color="black"
            />
          </View>

          <ThemedText style={styles.qrInstructions}>
            Present this code at the counter for scanning
          </ThemedText>

          <ThemedText style={[styles.statusText, { color: theme.primary }]}>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 350,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 25,
    lineHeight: 20,
  },
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
  qrInstructions: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.6,
    marginBottom: 15,
  },
  statusText: {
    fontSize: 11,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
    marginBottom: 25,
  },
  closeButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default QRCodeModal;

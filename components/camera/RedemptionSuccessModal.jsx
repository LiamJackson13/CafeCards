import { Modal, StyleSheet, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * RedemptionSuccessModal
 * Modal shown after a successful reward redemption.
 */
const RedemptionSuccessModal = ({ visible, customer, onDismiss }) => {
  // Do not render modal if no customer data is provided
  if (!customer) return null;

  return (
    <Modal
      // Modal: transparent fade overlay for success confirmation
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        {/* Card container for success content */}
        <ThemedCard style={styles.modalContainer}>
          {/* Celebration icon section */}
          <View style={styles.successIcon}>
            {/* Checkmark emoji indicating success */}
            <ThemedText style={styles.checkmark}>✅</ThemedText>
          </View>

          {/* Title text for redemption success */}
          <ThemedText type="title" style={styles.title}>
            Reward Redeemed!
          </ThemedText>

          {/* Subheading message confirming redemption */}
          <ThemedText style={styles.message}>
            Successfully redeemed reward for:
          </ThemedText>

          {/* Customer info section: name and email */}
          <View style={styles.customerInfo}>
            <ThemedText type="subtitle" style={styles.customerName}>
              {customer.name || "Customer"}
            </ThemedText>
            {customer.email && (
              <ThemedText style={styles.customerEmail}>
                {customer.email}
              </ThemedText>
            )}
          </View>

          {/* Reward details section: reward and remaining count */}
          <View style={styles.rewardInfo}>
            <ThemedText style={styles.rewardText}>
              🎁 Free Coffee Reward Claimed
            </ThemedText>
            {customer.availableRewards && customer.availableRewards > 0 && (
              <ThemedText style={styles.remainingText}>
                Remaining rewards: {customer.availableRewards}
              </ThemedText>
            )}
          </View>

          {/* Continue scanning button to dismiss modal */}
          <ThemedButton onPress={onDismiss} style={styles.continueButton}>
            <ThemedText style={styles.continueButtonText}>
              Continue Scanning
            </ThemedText>
          </ThemedButton>
        </ThemedCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Full-screen overlay with semi-transparent backdrop
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // Container for the modal card styling
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    padding: 30,
    alignItems: "center",
    borderRadius: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  // Wrapper for the checkmark icon
  successIcon: {
    marginBottom: 20,
  },
  // Style for the checkmark emoji
  checkmark: {
    fontSize: 64,
  },
  // Title text style for the modal header
  title: {
    textAlign: "center",
    marginBottom: 10,
    color: "#28a745",
    fontWeight: "bold",
  },
  // Message text under the title
  message: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  // Section containing customer name and email details
  customerInfo: {
    alignItems: "center",
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    width: "100%",
  },
  // Customer name text styling
  customerName: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "600",
  },
  // Customer email text styling
  customerEmail: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.7,
  },
  // Section for reward information and remaining count
  rewardInfo: {
    alignItems: "center",
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#e8f5e8",
    borderRadius: 10,
    width: "100%",
  },
  // Text style for claimed reward message
  rewardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#28a745",
    textAlign: "center",
    marginBottom: 5,
  },
  // Text style for remaining rewards count
  remainingText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  // Button styling to continue scanning
  continueButton: {
    width: "100%",
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
  },
  // Text styling inside the continue button
  continueButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default RedemptionSuccessModal;

import { Modal, StyleSheet, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const RedemptionSuccessModal = ({ visible, customer, onDismiss, theme }) => {
  if (!customer) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <ThemedCard style={styles.modalContainer}>
          <View style={styles.successIcon}>
            <ThemedText style={styles.checkmark}>✅</ThemedText>
          </View>

          <ThemedText type="title" style={styles.title}>
            Reward Redeemed!
          </ThemedText>

          <ThemedText style={styles.message}>
            Successfully redeemed reward for:
          </ThemedText>

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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
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
  successIcon: {
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 64,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
    color: "#28a745",
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  customerInfo: {
    alignItems: "center",
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    width: "100%",
  },
  customerName: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "600",
  },
  customerEmail: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.7,
  },
  rewardInfo: {
    alignItems: "center",
    marginBottom: 25,
    padding: 15,
    backgroundColor: "#e8f5e8",
    borderRadius: 10,
    width: "100%",
  },
  rewardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#28a745",
    textAlign: "center",
    marginBottom: 5,
  },
  remainingText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  continueButton: {
    width: "100%",
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default RedemptionSuccessModal;

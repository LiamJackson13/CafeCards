/**
 * PasswordModal Component
 *
 * A modal component for changing user passwords with validation and Appwrite integration.
 * Includes error handling and loading states.
 */
import { useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import { account } from "../../lib/appwrite";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const PasswordModal = ({ visible, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = async () => {
    setPasswordError("");

    // Validation
    if (!currentPassword.trim()) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (!newPassword.trim()) {
      setPasswordError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);

    try {
      await account.updatePassword(newPassword, currentPassword);
      handleClose();
      // Could show a success toast here instead of alert
    } catch (error) {
      console.error("Password change error:", error);

      if (error.message?.includes("Invalid credentials")) {
        setPasswordError("Current password is incorrect");
      } else if (error.message?.includes("Password")) {
        setPasswordError("Password requirements not met");
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleClose = () => {
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedCard style={styles.modalContent}>
          <ThemedText type="title" style={styles.modalTitle}>
            Change Password
          </ThemedText>

          {passwordError ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>Current Password</ThemedText>
            <TextInput
              style={styles.textInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={true}
              placeholder="Enter current password"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>New Password</ThemedText>
            <TextInput
              style={styles.textInput}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              placeholder="Enter new password (8+ characters)"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.inputLabel}>
              Confirm New Password
            </ThemedText>
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              placeholder="Confirm new password"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.modalButtons}>
            <ThemedButton
              onPress={handleClose}
              style={[styles.modalButton, styles.cancelButton]}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </ThemedButton>

            <ThemedButton
              onPress={handlePasswordSubmit}
              style={[styles.modalButton, styles.submitButton]}
              disabled={isChangingPassword}
            >
              <ThemedText style={styles.submitButtonText}>
                {isChangingPassword ? "Changing..." : "Change Password"}
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
    padding: 25,
    borderRadius: 15,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#AA7C48",
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default PasswordModal;

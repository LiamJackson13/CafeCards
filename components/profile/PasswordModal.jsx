/**
 * PasswordModal Component
 *
 * Modal for changing user passwords with validation and Appwrite integration.
 * Includes error handling and loading states.
 */
import { useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import { account } from "../../lib/appwrite";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const PasswordModal = ({ visible, onClose }) => {
  // visible: toggles display of the password modal
  // onClose: callback fired to close the modal and reset state
  const [currentPassword, setCurrentPassword] = useState("");
  // currentPassword: user-entered current password for verification
  // setCurrentPassword: function to update currentPassword state
  const [newPassword, setNewPassword] = useState("");
  // newPassword: user-entered new password
  // setNewPassword: function to update newPassword state
  const [confirmPassword, setConfirmPassword] = useState("");
  // confirmPassword: confirmation of newPassword to ensure match
  // setConfirmPassword: function to update confirmPassword state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  // isChangingPassword: loading flag during password update
  const [passwordError, setPasswordError] = useState("");
  // passwordError: stores validation or API error message

  // Handle password change with validation and error handling
  const handlePasswordSubmit = async () => {
    setPasswordError(""); // clear previous error

    // Ensure current password is provided
    if (!currentPassword.trim()) {
      setPasswordError("Please enter your current password");
      return;
    }
    // Ensure new password meets length requirement
    if (!newPassword.trim()) {
      setPasswordError("Please enter a new password");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }
    // Ensure confirmation matches new password
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setIsChangingPassword(true); // show loading state

    try {
      // Attempt password update via Appwrite account API
      await account.updatePassword(newPassword, currentPassword);
      handleClose(); // close modal on success
      // Success feedback could be added here (e.g., toast)
    } catch (error) {
      console.error("Password change error:", error);

      // Provide user-friendly error messages based on API response
      if (error.message?.includes("Invalid credentials")) {
        setPasswordError("Current password is incorrect");
      } else if (error.message?.includes("Password")) {
        setPasswordError("Password requirements not met");
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    } finally {
      setIsChangingPassword(false); // reset loading state
    }
  };

  // Reset inputs and close modal
  const handleClose = () => {
    // Clear states and invoke onClose callback
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Modal
      // Modal wrapper with slide animation and transparent backdrop
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>

        {/* backdrop overlay */}
        <ThemedCard style={styles.modalContent}>

          {/* card container */}
          <ThemedText type="title" style={styles.modalTitle}>

            {/* title */}
            Change Password
          </ThemedText>
          {passwordError ? (
            // Display validation or submission error above inputs
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{passwordError}</ThemedText>
            </View>
          ) : null}
          {/* Current password input */}
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
          {/* New password input */}
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
          {/* Confirm new password input */}
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
          {/* Actions: Cancel and Submit buttons */}
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
  // Full-screen semi-transparent overlay behind the modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  // Card container for modal content with padding and rounded corners
  modalContent: {
    width: "100%",
    maxWidth: 400,
    padding: 25,
    borderRadius: 15,
  },
  // Title text at top of the modal
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
  },
  // Container for error message box above inputs
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  // Text style for error messages
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  // Wrapper around each label + text input field
  inputContainer: {
    marginBottom: 15,
  },
  // Label text above the TextInput
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  // TextInput styling for password fields
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  // Container for modal action buttons
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  // Base style applied to both Cancel and Submit buttons
  modalButton: {
    flex: 1,
    paddingVertical: 12,
  },
  // Additional styles for Cancel button
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  // Text style inside the Cancel button
  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  // Additional styles for Submit button
  submitButton: {
    backgroundColor: "#AA7C48",
  },
  // Text style inside the Submit button
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default PasswordModal;

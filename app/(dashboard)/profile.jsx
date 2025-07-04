/**
 * User Profile Screen
 *
 * This screen displays user profile information and account management options.
 * Features include:
 * - Display of user email/account information
 * - Theme toggle for switching between light/dark modes
 * - Logout functionality
 * - Profile stats and information cards
 * - Welcome message and app description
 * - Themed styling with safe area support
 */
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import ThemeToggle from "../../components/ThemeToggle";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useCafeUser } from "../../hooks/useCafeUser";
import { useUser } from "../../hooks/useUser";
import { account } from "../../lib/appwrite";

const ProfileScreen = () => {
  const { logout, user, debugCafeMode, setDebugCafeMode, realIsCafeUser } =
    useUser();
  const isCafeUser = useCafeUser(); // This now includes debug override
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  // Password change modal state
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const StatCard = ({ title, value, icon }) => (
    <ThemedCard style={styles.statCard}>
      <ThemedText style={styles.statIcon}>{icon}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statTitle}>{title}</ThemedText>
    </ThemedCard>
  );

  const ProfileOption = ({ title, subtitle, icon, action }) => (
    <ThemedCard style={styles.optionCard}>
      <View style={styles.optionContent}>
        <View style={styles.optionLeft}>
          <ThemedText style={styles.optionIcon}>{icon}</ThemedText>
          <View style={styles.optionText}>
            <ThemedText style={styles.optionTitle}>{title}</ThemedText>
            {subtitle && (
              <ThemedText style={styles.optionSubtitle}>{subtitle}</ThemedText>
            )}
          </View>
        </View>
        {action && action}
      </View>
    </ThemedCard>
  );

  // Customer Stats
  const customerStats = [
    { title: "Cards Saved", value: "5", icon: "💳" },
    { title: "Scans This Month", value: "12", icon: "📱" },
    { title: "Points Earned", value: "248", icon: "⭐" },
  ];

  // Cafe Owner Stats
  const cafeStats = [
    { title: "Total Customers", value: "1,247", icon: "👥" },
    { title: "Cards Issued", value: "89", icon: "🎫" },
    { title: "Rewards Redeemed", value: "156", icon: "🎁" },
  ];

  const statsToShow = isCafeUser ? cafeStats : customerStats;

  const handleChangePassword = () => {
    setIsPasswordModalVisible(true);
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

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
      setIsPasswordModalVisible(false);
      // Could show a success toast here instead of alert
    } catch (error) {
      console.error("Password change error:", error);

      if (error.message.includes("Invalid credentials")) {
        setPasswordError("Current password is incorrect");
      } else if (error.message.includes("Password")) {
        setPasswordError("Password requirements not met");
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalVisible(false);
    setPasswordError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Debug Toggle - Only visible in development */}
        {__DEV__ && (
          <>
            <ThemedCard style={styles.debugCard}>
              <View style={styles.debugContent}>
                <View style={styles.debugLeft}>
                  <ThemedText style={styles.debugIcon}>🐛</ThemedText>
                  <View style={styles.debugText}>
                    <ThemedText style={styles.debugTitle}>
                      Global Debug Mode
                    </ThemedText>
                    <ThemedText style={styles.debugSubtitle}>
                      Switch entire app between Customer/Cafe
                      {debugCafeMode === realIsCafeUser && user
                        ? " (Auto-set)"
                        : ""}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.debugToggleContainer}>
                  <ThemedText style={styles.debugLabel}>
                    {debugCafeMode ? "Cafe" : "Customer"}
                  </ThemedText>
                  <Switch
                    value={debugCafeMode}
                    onValueChange={setDebugCafeMode}
                    trackColor={{
                      false: theme.iconColor,
                      true: Colors.primary,
                    }}
                    thumbColor={debugCafeMode ? "#fff" : "#f4f3f4"}
                  />
                </View>
              </View>
            </ThemedCard>
            <Spacer size={20} />
          </>
        )}

        {/* Profile Header */}
        <View style={styles.header}>
          {isCafeUser && (
            <View style={styles.cafeOwnerBadge}>
              <ThemedText style={styles.badgeText}>🏪 Cafe Owner</ThemedText>
            </View>
          )}
          <View
            style={[
              styles.avatarContainer,
              isCafeUser && styles.cafeAvatarContainer,
            ]}
          >
            <ThemedText style={styles.avatarText}>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </ThemedText>
          </View>
          <ThemedText type="title" style={styles.userName}>
            {user?.email?.split("@")[0] || "User"}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {user?.email || "user@example.com"}
          </ThemedText>
          {isCafeUser && (
            <ThemedText style={styles.cafeRole}>Business Account</ThemedText>
          )}
        </View>

        <Spacer size={30} />

        {/* Stats Section */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {isCafeUser ? "Business Analytics" : "Your Stats"}
        </ThemedText>
        <View style={styles.statsContainer}>
          {statsToShow.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
            />
          ))}
        </View>

        <Spacer size={30} />

        {/* Settings Section */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {isCafeUser ? "Business Settings" : "Settings"}
        </ThemedText>

        <ProfileOption
          title="Theme"
          subtitle="Switch between light and dark mode"
          icon="🎨"
          action={<ThemeToggle />}
        />

        {isCafeUser ? (
          <>
            <ProfileOption
              title="Cafe Management"
              subtitle="Manage your cafe details and offerings"
              icon="☕"
            />

            <ProfileOption
              title="Loyalty Programs"
              subtitle="Configure reward systems and campaigns"
              icon="🎯"
            />

            <ProfileOption
              title="Customer Analytics"
              subtitle="View detailed customer insights"
              icon="📊"
            />

            <ProfileOption
              title="Change Password"
              subtitle="Update your account password"
              icon="🔑"
              action={
                <ThemedButton
                  onPress={handleChangePassword}
                  style={[
                    styles.changePasswordButton,
                    { backgroundColor: theme.text },
                  ]}
                >
                  <ThemedText style={styles.changePasswordText}>
                    Change
                  </ThemedText>
                </ThemedButton>
              }
            />

            <ProfileOption
              title="Business Settings"
              subtitle="Manage business account preferences"
              icon="⚙️"
            />
          </>
        ) : (
          <>
            <ProfileOption
              title="Notifications"
              subtitle="Manage your notification preferences"
              icon="🔔"
            />

            <ProfileOption
              title="Change Password"
              subtitle="Update your account password"
              icon="🔑"
              action={
                <ThemedButton
                  onPress={handleChangePassword}
                  style={[
                    styles.changePasswordButton,
                    { backgroundColor: Colors.primary },
                  ]}
                >
                  <ThemedText
                    style={[styles.changePasswordText, { color: "#fff" }]}
                  >
                    Change
                  </ThemedText>
                </ThemedButton>
              }
            />

            <ProfileOption
              title="Privacy & Security"
              subtitle="Manage your account security"
              icon="🔒"
            />

            <ProfileOption
              title="Help & Support"
              subtitle="Get help and contact support"
              icon="❓"
            />
          </>
        )}

        <Spacer size={30} />

        {/* About Section */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          About
        </ThemedText>

        <ThemedCard style={styles.aboutCard}>
          <ThemedText style={styles.aboutTitle}>Cafe Cards</ThemedText>
          <ThemedText style={styles.aboutDescription}>
            Your digital wallet for cafe loyalty cards. Scan, save, and manage
            all your favorite cafe rewards in one convenient place.
          </ThemedText>
          <View style={styles.appInfo}>
            <ThemedText style={styles.appInfoText}>Version 1.0.0</ThemedText>
            <ThemedText style={styles.appInfoText}>•</ThemedText>
            <ThemedText style={styles.appInfoText}>Build 2025.1.1</ThemedText>
          </View>
        </ThemedCard>

        <Spacer size={30} />

        {/* Logout Button */}
        <ThemedButton onPress={logout} style={styles.logoutButton}>
          <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
        </ThemedButton>

        <Spacer size={50} />
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        visible={isPasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handlePasswordModalClose}
      >
        <View style={styles.modalOverlay}>
          <ThemedCard style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Change Password
            </ThemedText>

            {passwordError ? (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>
                  {passwordError}
                </ThemedText>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>
                Current Password
              </ThemedText>
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
                onPress={handlePasswordModalClose}
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
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#AA7C48",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
  optionCard: {
    marginBottom: 10,
    padding: 15,
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
  aboutCard: {
    padding: 20,
    alignItems: "center",
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 15,
  },
  appInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appInfoText: {
    fontSize: 12,
    opacity: 0.6,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    marginHorizontal: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cafeOwnerBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cafeAvatarContainer: {
    backgroundColor: "#4CAF50",
  },
  cafeRole: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
    fontStyle: "italic",
  },
  changePasswordButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    minWidth: 70,
  },
  changePasswordText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
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
    backgroundColor: "#007AFF",
  },
  submitButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  // Debug styles
  debugCard: {
    padding: 15,
    backgroundColor: "#fff3cd",
    borderColor: "#ffeaa7",
    borderWidth: 1,
    borderRadius: 10,
  },
  debugContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  debugLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  debugIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  debugText: {
    flex: 1,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 2,
  },
  debugSubtitle: {
    fontSize: 12,
    color: "#856404",
    opacity: 0.8,
  },
  debugToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  debugLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#856404",
    minWidth: 50,
    textAlign: "right",
  },
});

export default ProfileScreen;

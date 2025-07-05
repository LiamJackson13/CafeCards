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
import { ScrollView, StyleSheet, View } from "react-native";
import DebugToggle from "../../components/profile/DebugToggle";
import NameModal from "../../components/profile/NameModal";
import PasswordModal from "../../components/profile/PasswordModal";
import ProfileOption from "../../components/profile/ProfileOption";
import StatCard from "../../components/profile/StatCard";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import ThemeToggle from "../../components/ThemeToggle";
import { Colors } from "../../constants/Colors";
import { useCafeUser } from "../../hooks/useCafeUser";
import { useUser } from "../../hooks/useUser";

const ProfileScreen = () => {
  const { logout, user, refreshUser } = useUser();
  const isCafeUser = useCafeUser(); // This now includes debug override

  // Modal state
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);

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
  };

  const handleEditName = () => {
    setIsNameModalVisible(true);
  };

  const handleNameUpdated = async (updatedUser) => {
    // Refresh user data from the context
    try {
      await refreshUser();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  // Get display name - use user's name if available, otherwise derive from email
  const getDisplayName = () => {
    if (user?.name && user.name.trim() !== "") {
      return user.name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Debug Toggle - Only visible in development */}
        <DebugToggle />

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
              {getDisplayName().charAt(0).toUpperCase()}
            </ThemedText>
          </View>

          <View style={styles.nameContainer}>
            <ThemedText type="title" style={styles.userName}>
              {getDisplayName()}
            </ThemedText>
            <ThemedButton
              onPress={handleEditName}
              style={styles.editNameButton}
            >
              <ThemedText style={styles.editNameText}>Edit Name</ThemedText>
            </ThemedButton>
          </View>

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
      <PasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
      />

      {/* Name Edit Modal */}
      <NameModal
        visible={isNameModalVisible}
        onClose={() => setIsNameModalVisible(false)}
        currentName={user?.name || ""}
        onNameUpdated={handleNameUpdated}
      />
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
  nameContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  editNameButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editNameText: {
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.7,
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
});

export default ProfileScreen;

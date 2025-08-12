/**
 * User Profile Screen
 */

// imports
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import LogoutButton from "../../components/profile/LogoutButton";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileModals from "../../components/profile/ProfileModals";
import SettingsSection from "../../components/profile/SettingsSection";
import StatsSection from "../../components/profile/StatsSection";
import Spacer from "../../components/Spacer";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useProfile } from "../../hooks/profile/useProfile";

const ProfileScreen = () => {
  // Theme context: get current theme and colors
  const { userTheme } = useTheme();
  // Resolve theme colors for styling
  const theme = Colors[userTheme] ?? Colors.light;
  // Pull-to-refresh state for manual data refresh
  const [refreshing, setRefreshing] = useState(false);

  // Profile hook: user info, role, stats, modal visibility, and handlers
  const {
    user,
    isCafeUser,
    stats,
    statsLoading,
    statsError,
    isPasswordModalVisible,
    setIsPasswordModalVisible,
    isNameModalVisible,
    setIsNameModalVisible,
    logout,
    handleChangePassword,
    handleEditName,
    handleNameUpdated,
    cafeProfile,
    getDisplayName,
    refetchStats,
  } = useProfile();
  // Select summary stats based on user role (first/last for cafe, first two for customers)
  const summaryStats = isCafeUser
    ? stats
      ? [stats[0], stats[stats.length - 1]]
      : []
    : stats?.slice(0, 2);

  // Pull-to-refresh handler: refetch stats data
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchStats();
    } catch (error) {
      console.error("Error refreshing profile data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ThemedView style={styles.container} safe>
      {/* Scrollable content area with pull-to-refresh */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.text}
            colors={[theme.primary]}
          />
        }
      >
        {/* Profile header: display and edit user/cafe information */}
        <ProfileHeader
          isCafeUser={isCafeUser}
          cafeProfile={cafeProfile}
          getDisplayName={getDisplayName}
          user={user}
          onEditName={handleEditName}
        />


        {/* Summary stats section (customer or cafe user) */}
        <Spacer size={20} />
        <StatsSection
          isCafeUser={isCafeUser}
          stats={summaryStats}
          loading={statsLoading}
          error={statsError}
        />

        {isCafeUser && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          ></View>
        )}

        {/* Account settings: password change modal trigger */}
        <Spacer size={20} />
        <SettingsSection
          isCafeUser={isCafeUser}
          onChangePassword={handleChangePassword}
        />

        {/* App Information: version, build, last updated */}
        <Spacer size={20} />
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            App Information
          </ThemedText>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Version:</ThemedText>
            <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Build:</ThemedText>
            <ThemedText style={styles.infoValue}>2025.1.1</ThemedText>
          </View>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Last Updated:</ThemedText>
            <ThemedText style={styles.infoValue}>July 4, 2025</ThemedText>
          </View>
        </ThemedCard>

        {/* Logout button: end user session */}
        <Spacer size={20} />
        <LogoutButton onPress={logout} />

        {/* Spacer for safe area bottom padding */}
        <Spacer size={50} />
      </ScrollView>

      {/* Modals: handle name edit and password change dialogs */}
      <ProfileModals
        isPasswordModalVisible={isPasswordModalVisible}
        setIsPasswordModalVisible={setIsPasswordModalVisible}
        isNameModalVisible={isNameModalVisible}
        setIsNameModalVisible={setIsNameModalVisible}
        currentName={
          isCafeUser ? cafeProfile?.cafeName || "" : user?.name || ""
        }
        onNameUpdated={handleNameUpdated}
        isCafeUser={isCafeUser}
        cafeProfileId={cafeProfile?.$id}
      />
    </ThemedView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // Main container: full-screen wrapper
  container: {
    flex: 1,
  },
  // ScrollView container: padding and vertical scroll
  scrollView: {
    flex: 1,
    padding: 20,
  },
  // Section card wrapper: spacing around each card section
  section: {
    marginBottom: 20,
    padding: 18,
  },
  // Title for each section card
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  // Container for data management buttons
  dataButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 5,
  },
  // Individual data button styling
  dataButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  // Export button color styling
  exportButton: {
    backgroundColor: "#3498DB",
  },
  // Clear data button color styling
  clearButton: {
    backgroundColor: "#E74C3C",
  },
  // Row layout for app info label/value pairs
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  // Label styling for app info
  infoLabel: {
    fontWeight: "500",
    opacity: 0.7,
  },
  // Value styling for app info
  infoValue: {
    fontWeight: "400",
  },
  // Button to view analytics (if needed)
  viewAnalyticsButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ProfileScreen;

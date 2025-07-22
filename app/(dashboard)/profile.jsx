/**
 * User Profile Screen
 *
 * Displays user profile info, stats, and account management options.
 * Features:
 * - Profile header and editable display name
 * - Stats section (customer/cafe user)
 * - Settings (password change, etc.)
 * - Data management actions (export/clear)
 * - App info/version/build
 * - Logout
 * - Pull-to-refresh for stats
 * - Themed, safe-area layout
 */
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LogoutButton from "../../components/profile/LogoutButton";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileModals from "../../components/profile/ProfileModals";
import SettingsSection from "../../components/profile/SettingsSection";
import StatsSection from "../../components/profile/StatsSection";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useProfile } from "../../hooks/profile/useProfile";

const ProfileScreen = () => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;
  const [refreshing, setRefreshing] = useState(false);

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
  // Determine summary stats: for cafe users use Total Customers and Rewards Redeemed, otherwise first two stats
  const summaryStats = isCafeUser
    ? stats
      ? [stats[0], stats[stats.length - 1]]
      : []
    : stats?.slice(0, 2);

  // Pull-to-refresh handler
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
        {/* Profile Header */}
        <ProfileHeader
          isCafeUser={isCafeUser}
          cafeProfile={cafeProfile}
          getDisplayName={getDisplayName}
          user={user}
          onEditName={handleEditName}
        />

        <Spacer size={20} />

        {/* Stats Section (Summary) */}
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

        <Spacer size={20} />

        {/* Settings Section */}
        <SettingsSection
          isCafeUser={isCafeUser}
          onChangePassword={handleChangePassword}
        />

        <Spacer size={20} />

        {/* Data Management */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Data Management
          </ThemedText>
          <View style={styles.dataButtons}>
            <ThemedButton
              title="Export Data"
              style={[styles.dataButton, styles.exportButton]}
            >
              <Text>Export Data</Text>
            </ThemedButton>
            <ThemedButton
              title="Clear All Data"
              style={[styles.dataButton, styles.clearButton]}
            >
              <Text>Clear All Data</Text>
            </ThemedButton>
          </View>
        </ThemedCard>

        {/* App Information */}
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

        <Spacer size={20} />

        {/* Logout Button */}
        <LogoutButton onPress={logout} />

        <Spacer size={50} />
      </ScrollView>

      {/* Modals */}
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
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  dataButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
    marginBottom: 5,
  },
  dataButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  exportButton: {
    backgroundColor: "#3498DB",
  },
  clearButton: {
    backgroundColor: "#E74C3C",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  infoLabel: {
    fontWeight: "500",
    opacity: 0.7,
  },
  infoValue: {
    fontWeight: "400",
  },
  viewAnalyticsButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ProfileScreen;

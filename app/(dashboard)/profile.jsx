/**
 * User Profile Screen
 *
 * This screen displays user profile information and account management options.
 * Features include:
 * - Display of user email/account information
 * - Theme toggle for switching between light/dark modes
 * - Logout functionality
 * - Real-time profile stats and information cards
 * - Pull-to-refresh functionality for updated stats
 * - Welcome message and app description
 * - Themed styling with safe area support
 */
import { useState } from "react";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import AboutSection from "../../components/profile/AboutSection";
import LogoutButton from "../../components/profile/LogoutButton";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileModals from "../../components/profile/ProfileModals";
import SettingsSection from "../../components/profile/SettingsSection";
import StatsSection from "../../components/profile/StatsSection";
import Spacer from "../../components/Spacer";
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
    getDisplayName,
    refetchStats,
  } = useProfile();

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
          getDisplayName={getDisplayName}
          user={user}
          onEditName={handleEditName}
        />

        <Spacer size={30} />

        {/* Stats Section */}
        <StatsSection
          isCafeUser={isCafeUser}
          stats={stats}
          loading={statsLoading}
          error={statsError}
        />

        <Spacer size={30} />

        {/* Settings Section */}
        <SettingsSection
          isCafeUser={isCafeUser}
          onChangePassword={handleChangePassword}
        />

        <Spacer size={30} />

        {/* About Section */}
        <AboutSection />

        <Spacer size={30} />

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
});

export default ProfileScreen;

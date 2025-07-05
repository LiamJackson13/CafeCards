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
import { ScrollView, StyleSheet } from "react-native";
import AboutSection from "../../components/profile/AboutSection";
import LogoutButton from "../../components/profile/LogoutButton";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileModals from "../../components/profile/ProfileModals";
import SettingsSection from "../../components/profile/SettingsSection";
import StatsSection from "../../components/profile/StatsSection";
import Spacer from "../../components/Spacer";
import ThemedView from "../../components/ThemedView";
import { useProfile } from "../../hooks/profile/useProfile";

const ProfileScreen = () => {
  const {
    user,
    isCafeUser,
    statsToShow,
    isPasswordModalVisible,
    setIsPasswordModalVisible,
    isNameModalVisible,
    setIsNameModalVisible,
    logout,
    handleChangePassword,
    handleEditName,
    handleNameUpdated,
    getDisplayName,
  } = useProfile();

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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
        <StatsSection isCafeUser={isCafeUser} statsToShow={statsToShow} />

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

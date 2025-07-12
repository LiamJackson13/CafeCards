import { Image, Pressable, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useProfilePicture } from "../../hooks/profile/useProfilePicture";
import ThemedButton from "../ThemedButton";
import ThemedLoader from "../ThemedLoader";
import ThemedText from "../ThemedText";
import DebugToggle from "./DebugToggle";
import ProfilePictureModal from "./ProfilePictureModal";

/**
 * ProfileHeader
 *
 * Displays the profile header with avatar, name, email, and edit button.
 * - Shows debug toggle in development.
 * - Cafe users see business badges.
 */
const ProfileHeader = ({
  user,
  isCafeUser,
  cafeProfile,
  onEditName,
  getDisplayName,
}) => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  // Profile picture hook
  const {
    profilePictureUrl,
    uploading,
    loading,
    isModalVisible,
    setIsModalVisible,
    showImagePicker,
    takePhoto,
    pickImage,
    confirmRemovePhoto,
  } = useProfilePicture();

  // Determine display name: cafe profile name for cafe users, else user name
  const displayName =
    isCafeUser && cafeProfile?.cafeName
      ? cafeProfile.cafeName
      : getDisplayName();

  return (
    <>
      {/* Debug Toggle - Only visible in development */}
      <DebugToggle />

      <View style={styles.header}>
        {/* Cafe Owner Badge */}
        {isCafeUser && (
          <View
            style={[styles.cafeOwnerBadge, { backgroundColor: theme.primary }]}
          >
            <ThemedText style={styles.badgeText}>🏪 Cafe Owner</ThemedText>
          </View>
        )}

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Pressable
            onPress={showImagePicker}
            disabled={uploading}
            style={[
              styles.avatarContainer,
              {
                backgroundColor: isCafeUser ? theme.primary : theme.secondary,
                borderColor: actualTheme === "dark" ? "#fff" : "#000",
              },
            ]}
          >
            {uploading || loading ? (
              <ThemedLoader size="small" />
            ) : profilePictureUrl && typeof profilePictureUrl === "string" ? (
              <Image
                source={{ uri: profilePictureUrl }}
                style={styles.avatarImage}
                onError={({ nativeEvent }) =>
                  console.error(
                    "Image load error:",
                    nativeEvent.error || JSON.stringify(nativeEvent)
                  )
                }
              />
            ) : (
              <ThemedText style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </ThemedText>
            )}

            {/* Camera icon overlay */}
            <View
              style={[
                styles.cameraOverlay,
                {
                  backgroundColor:
                    actualTheme === "light" ? Colors.light.background : "#fff",
                  borderColor: actualTheme === "dark" ? "#fff" : "#000",
                },
              ]}
            >
              <ThemedText style={styles.cameraIcon}>📷</ThemedText>
            </View>
          </Pressable>
        </View>

        {/* Name and Edit Button */}
        <View style={styles.nameContainer}>
          <ThemedText type="title" style={styles.userName}>
            {displayName}
          </ThemedText>
          <ThemedButton
            onPress={onEditName}
            style={[styles.editNameButton, { borderColor: theme.border }]}
          >
            <ThemedText style={[styles.editNameText, { color: theme.text }]}>
              ✏️ Edit Name
            </ThemedText>
          </ThemedButton>
        </View>

        {/* Email */}
        <ThemedText style={[styles.userEmail, { color: theme.text }]}>
          {user?.email || "user@example.com"}
        </ThemedText>

        {/* Cafe Role Badge */}
        {isCafeUser && (
          <View
            style={[
              styles.roleContainer,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <ThemedText style={[styles.cafeRole, { color: theme.primary }]}>
              Business Account
            </ThemedText>
          </View>
        )}
      </View>

      {/* Profile Picture Modal */}
      <ProfilePictureModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onTakePhoto={takePhoto}
        onPickImage={pickImage}
        onRemovePhoto={confirmRemovePhoto}
        hasProfilePicture={!!profilePictureUrl}
        uploading={uploading}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },

  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  avatarImage: {
    width: 115,
    height: 115,
    borderRadius: 56,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  cameraIcon: {
    fontSize: 14,
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  editNameButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editNameText: {
    fontSize: 14,
    fontWeight: "500",
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 10,
  },
  cafeOwnerBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  roleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 5,
  },
  cafeRole: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default ProfileHeader;

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
  const { userTheme } = useTheme();
  const theme = Colors[userTheme] ?? Colors.light;

  // Profile picture hook
  // useProfilePicture hook provides picture URL, loading states, and modal controls
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

  // Determine displayName: cafeName if manager, else user name
  const displayName =
    isCafeUser && cafeProfile?.cafeName
      ? cafeProfile.cafeName
      : getDisplayName();

  return (
    <>
      {/* Debug toggle for development environment */}
      <DebugToggle />

      <View style={styles.header}>
        {/* Container for header elements: badge, avatar, name, email */}
        {isCafeUser && (
          <View
            style={[styles.cafeOwnerBadge, { backgroundColor: theme.primary }]}
          >
            {/* Badge label for cafe owners */}
            <ThemedText style={styles.badgeText}>🏪 Cafe Owner</ThemedText>
          </View>
        )}

        {/* Avatar Section */}
        <View style={styles.avatarWrapper}>
          {/* Pressable avatar container opens image picker */}
          <Pressable
            onPress={showImagePicker}
            disabled={uploading}
            style={[
              styles.avatarContainer,
              {
                backgroundColor: isCafeUser ? theme.primary : theme.secondary,
                borderColor: userTheme === "dark" ? "#fff" : "#000",
              },
            ]}
          >
            {/* Show loader while uploading or loading image */}
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

            {/* Camera icon overlay for edit affordance */}
            <View
              style={[
                styles.cameraOverlay,
                {
                  backgroundColor:
                    userTheme === "light" ? Colors.light.background : "#fff",
                  borderColor: userTheme === "dark" ? "#fff" : "#000",
                },
              ]}
            >
              <ThemedText style={styles.cameraIcon}>📷</ThemedText>
            </View>
          </Pressable>
        </View>

        {/* Name and edit button */}
        <View style={styles.nameContainer}>
          {/* Display user or cafe name */}
          <ThemedText type="title" style={styles.userName}>
            {displayName}
          </ThemedText>
          <ThemedButton
            onPress={onEditName}
            style={[styles.editNameButton, { borderColor: theme.border }]}
          >
            {/* Button to open name editing modal */}
            <ThemedText style={[styles.editNameText, { color: theme.text }]}>
              ✏️ Edit Name
            </ThemedText>
          </ThemedButton>
        </View>

        {/* Email display */}
        <ThemedText style={[styles.userEmail, { color: theme.text }]}>
          {/* Show user's email or placeholder */}
          {user?.email || "user@example.com"}
        </ThemedText>

        {/* Business account badge for cafe users */}
        {isCafeUser && (
          <View
            style={[
              styles.roleContainer,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            {/* Label indicating business account role */}
            <ThemedText style={[styles.cafeRole, { color: theme.primary }]}>
              Business Account
            </ThemedText>
          </View>
        )}
      </View>

      {/* Profile picture selection modal */}
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
  // Wrapper for the entire header section
  header: {
    alignItems: "center",
    paddingVertical: 30,
  },
  // Container for the avatar and camera overlay
  avatarWrapper: {
    position: "relative",
    marginBottom: 20,
  },
  // Touchable avatar circle styling
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
  // Text styling for avatar initial fallback
  avatarText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  // Profile image styling inside avatar container
  avatarImage: {
    width: 115,
    height: 115,
    borderRadius: 56,
  },
  // Overlay circle for camera icon
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
  // Camera icon styling
  cameraIcon: {
    fontSize: 14,
  },
  // Container for user name and edit action
  nameContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  // User or cafe name text style
  userName: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  // Edit name button styling
  editNameButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  // Text style inside the edit name button
  editNameText: {
    fontSize: 14,
    fontWeight: "500",
  },
  // Styling for user email text
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 10,
  },
  // Badge styling for cafe owner role
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
  // Text style for cafe owner badge label
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  // Container for business account role indicator
  roleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 5,
  },
  // Text style for business account badge
  cafeRole: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default ProfileHeader;

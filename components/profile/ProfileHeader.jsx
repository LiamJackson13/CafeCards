import { StyleSheet, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import DebugToggle from "./DebugToggle";

const ProfileHeader = ({ user, isCafeUser, onEditName, getDisplayName }) => {
  return (
    <>
      {/* Debug Toggle - Only visible in development */}
      <DebugToggle />

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
          <ThemedButton onPress={onEditName} style={styles.editNameButton}>
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
    </>
  );
};

const styles = StyleSheet.create({
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
  cafeAvatarContainer: {
    backgroundColor: "#4CAF50",
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
  cafeRole: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
    fontStyle: "italic",
  },
});

export default ProfileHeader;

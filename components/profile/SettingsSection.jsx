import { StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import ThemeToggle from "../ThemeToggle";
import ProfileOption from "./ProfileOption";

const ChangePasswordButton = ({ onPress }) => (
  // onPress: callback to open the password change modal
  <ThemedButton
    onPress={onPress}
    style={[styles.changePasswordButton, { backgroundColor: Colors.primary }]}
  >
    {/* Button label text for password change */}
    <ThemedText style={[styles.changePasswordText, { color: "#fff" }]}>
      Change
    </ThemedText>
  </ThemedButton>
);

const CustomerSettings = ({ onChangePassword }) => (
  // Customer-specific settings: currently only change password
  <>
    <ProfileOption
      title="Change Password"
      subtitle="Update your account password"
      icon="🔑"
      action={<ChangePasswordButton onPress={onChangePassword} />}
    />
  </>
);

const CafeSettings = ({ onChangePassword }) => (
  // Cafe manager settings: identical change password option
  <>
    <ProfileOption
      title="Change Password"
      subtitle="Update your account password"
      icon="🔑"
      action={<ChangePasswordButton onPress={onChangePassword} />}
    />
  </>
);

const SettingsSection = ({ isCafeUser, onChangePassword }) => {
  // isCafeUser: determines which settings group to render
  // onChangePassword: callback passed to change password buttons
  return (
    <>
      {/* Theme toggle option available to all users */}
      <ProfileOption
        title="Theme"
        subtitle="Switch between light and dark mode"
        icon="🎨"
        action={<ThemeToggle />}
      />

      {/* Render settings based on user role */}
      {isCafeUser ? (
        <CafeSettings onChangePassword={onChangePassword} />
      ) : (
        <CustomerSettings onChangePassword={onChangePassword} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Styling for change password button container
  changePasswordButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    minWidth: 70,
  },
  // Text style for change password button label
  changePasswordText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default SettingsSection;

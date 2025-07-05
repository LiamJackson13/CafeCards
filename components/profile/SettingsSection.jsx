import { StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import ThemeToggle from "../ThemeToggle";
import ProfileOption from "./ProfileOption";

const ChangePasswordButton = ({ onPress }) => (
  <ThemedButton
    onPress={onPress}
    style={[styles.changePasswordButton, { backgroundColor: Colors.primary }]}
  >
    <ThemedText style={[styles.changePasswordText, { color: "#fff" }]}>
      Change
    </ThemedText>
  </ThemedButton>
);

const CustomerSettings = ({ onChangePassword }) => (
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
      action={<ChangePasswordButton onPress={onChangePassword} />}
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
);

const CafeSettings = ({ onChangePassword }) => (
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
      action={<ChangePasswordButton onPress={onChangePassword} />}
    />

    <ProfileOption
      title="Business Settings"
      subtitle="Manage business account preferences"
      icon="⚙️"
    />
  </>
);

const SettingsSection = ({ isCafeUser, onChangePassword }) => {
  return (
    <>
      <ProfileOption
        title="Theme"
        subtitle="Switch between light and dark mode"
        icon="🎨"
        action={<ThemeToggle />}
      />

      {isCafeUser ? (
        <CafeSettings onChangePassword={onChangePassword} />
      ) : (
        <CustomerSettings onChangePassword={onChangePassword} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
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

export default SettingsSection;

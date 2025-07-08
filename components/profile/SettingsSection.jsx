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
      title="Change Password"
      subtitle="Update your account password"
      icon="🔑"
      action={<ChangePasswordButton onPress={onChangePassword} />}
    />
  </>
);

const CafeSettings = ({ onChangePassword }) => (
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

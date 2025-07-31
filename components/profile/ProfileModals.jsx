import NameModal from "./NameModal";
import PasswordModal from "./PasswordModal";

/**
 * ProfileModals
 *
 * Renders modals for editing name and changing password.
 */
const ProfileModals = ({
  isPasswordModalVisible, // controls visibility of the password change modal
  setIsPasswordModalVisible, // toggles password modal visibility
  isNameModalVisible, // controls visibility of the name editing modal
  setIsNameModalVisible, // toggles name modal visibility
  currentName, // user's current display name, pre-fills NameModal
  onNameUpdated, // callback when name is updated successfully
  isCafeUser, // flag indicating cafe manager context for NameModal
  cafeProfileId, // ID for updating existing cafe profile (if applicable)
}) => {
  return (
    <>
      {/* Password Change Modal: handles user password updates */}
      <PasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
      />

      {/* Name Edit Modal: handles updating display or cafe profile name */}
      <NameModal
        visible={isNameModalVisible}
        onClose={() => setIsNameModalVisible(false)}
        currentName={currentName}
        onNameUpdated={onNameUpdated}
        isCafeUser={isCafeUser}
        cafeProfileId={cafeProfileId}
      />
    </>
  );
};

export default ProfileModals;

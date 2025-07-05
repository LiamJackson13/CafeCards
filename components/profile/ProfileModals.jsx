import NameModal from "./NameModal";
import PasswordModal from "./PasswordModal";

const ProfileModals = ({
  isPasswordModalVisible,
  setIsPasswordModalVisible,
  isNameModalVisible,
  setIsNameModalVisible,
  currentName,
  onNameUpdated,
}) => {
  return (
    <>
      {/* Password Change Modal */}
      <PasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
      />

      {/* Name Edit Modal */}
      <NameModal
        visible={isNameModalVisible}
        onClose={() => setIsNameModalVisible(false)}
        currentName={currentName}
        onNameUpdated={onNameUpdated}
      />
    </>
  );
};

export default ProfileModals;

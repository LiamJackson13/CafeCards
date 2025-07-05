import { useState } from "react";
import { useCafeUser, useUser } from "../useUser";
import { useProfileStats } from "./useProfileStats";

export const useProfile = () => {
  const { logout, user, refreshUser } = useUser();
  const isCafeUser = useCafeUser(); // This now includes debug override
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useProfileStats();

  // Modal state
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);

  const handleChangePassword = () => {
    setIsPasswordModalVisible(true);
  };

  const handleEditName = () => {
    setIsNameModalVisible(true);
  };

  const handleNameUpdated = async (updatedUser) => {
    // Refresh user data from the context
    try {
      await refreshUser();
      // Also refresh stats since user data changed
      await refetchStats();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  // Get display name - use user's name if available, otherwise derive from email
  const getDisplayName = () => {
    if (user?.name && user.name.trim() !== "") {
      return user.name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  return {
    // User data
    user,
    isCafeUser,
    stats,
    statsLoading,
    statsError,

    // Modal state
    isPasswordModalVisible,
    setIsPasswordModalVisible,
    isNameModalVisible,
    setIsNameModalVisible,

    // Actions
    logout,
    handleChangePassword,
    handleEditName,
    handleNameUpdated,
    getDisplayName,
    refetchStats,
  };
};

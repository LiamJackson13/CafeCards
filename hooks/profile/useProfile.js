import { useCallback, useEffect, useState } from "react";
import { getCafeProfile } from "../../lib/appwrite/cafe-profiles";
import { useCafeUser, useUser } from "../useUser";
import { useProfileStats } from "./useProfileStats";

/**
 * useProfile
 *
 * Custom hook for managing profile state, modals, and actions.
 * Handles user info, modal visibility, stats, and name editing logic.
 * Integrates with user context and profile stats hook.
 */
export const useProfile = () => {
  const { logout, user, refreshUser } = useUser();
  const isCafeUser = useCafeUser(); // Includes debug override if present
  const [cafeProfile, setCafeProfile] = useState(null);

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useProfileStats();

  const fetchCafeProfile = useCallback(async () => {
    if (!user?.$id) {
      console.error("User ID is missing. Cannot fetch cafe profile.");
      return;
    }

    console.log("Fetching cafe profile with user ID:", user.$id);

    if (isCafeUser) {
      try {
        const profile = await getCafeProfile(user.$id);
        setCafeProfile(profile);
      } catch (error) {
        console.error("Error fetching cafe profile:", error);
      }
    }
  }, [isCafeUser, user]);

  useEffect(() => {
    fetchCafeProfile();
  }, [fetchCafeProfile]);

  // Modal state for password and name editing
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);

  // Show password change modal
  const handleChangePassword = () => {
    setIsPasswordModalVisible(true);
  };

  // Show name edit modal
  const handleEditName = () => {
    setIsNameModalVisible(true);
  };

  // After name update, refresh user and stats
  const handleNameUpdated = async (updated) => {
    try {
      if (isCafeUser) {
        // Refresh cafe profile
        if (cafeProfile) {
          setCafeProfile({ ...cafeProfile, cafeName: updated.name });
        }
        await fetchCafeProfile();
      } else {
        await refreshUser();
      }
      await refetchStats();
    } catch (error) {
      console.error("Failed to refresh data after name update:", error);
    }
  };

  // Get display name: prefer user's name, fallback to email prefix or "User"
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
    cafeProfile,

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

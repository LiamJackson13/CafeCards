import { useCallback, useEffect, useState } from "react";
import { getCafeProfile } from "../../lib/appwrite/cafeProfiles";
import { useCafeUser, useUser } from "../useUser";
import { useProfileStats } from "./useProfileStats";

/**
 * useProfile
 *
 * Hook for managing profile state, modals, and actions.
 * Handles user info, modal visibility, stats, and name editing logic.
 */
export const useProfile = () => {
  // Extract logout method, current user data, and refresh function from user context
  const { logout, user, refreshUser } = useUser();
  const isCafeUser = useCafeUser(); // May include debug override logic
  const [cafeProfile, setCafeProfile] = useState(null);

  // Retrieve user statistics (visits, redemptions) from custom hook
  const {
    stats, // Aggregated stats object
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useProfileStats();

  // Fetch cafe profile data when user or permissions change
  const fetchCafeProfile = useCallback(async () => {
    // Ensure user ID is available
    if (!user?.$id) {
      console.error("User ID is missing. Cannot fetch cafe profile.");
      return;
    }

    // Only fetch profile for cafe staff users
    if (isCafeUser) {
      try {
        const profile = await getCafeProfile(user.$id);
        setCafeProfile(profile); // Store fetched profile
      } catch (error) {
        console.error("Error fetching cafe profile:", error);
      }
    }
  }, [isCafeUser, user]);

  // Run fetchCafeProfile on mount and whenever dependencies update
  useEffect(() => {
    fetchCafeProfile();
  }, [fetchCafeProfile]);

  // Local UI state for modal visibility
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false); // Show/hide password change modal
  const [isNameModalVisible, setIsNameModalVisible] = useState(false); // Show/hide name edit modal

  // Opens the password modal when user wants to change password
  const handleChangePassword = () => {
    setIsPasswordModalVisible(true);
  };

  // Opens the name edit modal when user opts to edit their name
  const handleEditName = () => {
    setIsNameModalVisible(true);
  };

  // After user updates their name, refresh relevant data
  const handleNameUpdated = async (updated) => {
    try {
      if (isCafeUser) {
        // If staff, optimistically update local cafe name
        if (cafeProfile) {
          setCafeProfile({ ...cafeProfile, cafeName: updated.name });
        }
        await fetchCafeProfile(); // Re-fetch full profile
      } else {
        await refreshUser(); // Re-fetch user context for regular users
      }
      await refetchStats(); // Update stats after name change
    } catch (error) {
      console.error("Failed to refresh data after name update:", error);
    }
  };

  // Gets the display name: prefer provided name, else email prefix, else generic
  const getDisplayName = () => {
    if (user?.name && user.name.trim() !== "") {
      return user.name;
    }
    // Fallback to part of email before '@'
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

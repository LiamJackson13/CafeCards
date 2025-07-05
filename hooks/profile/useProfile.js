import { useState } from "react";
import { useCafeUser, useUser } from "../useUser";

export const useProfile = () => {
  const { logout, user, refreshUser } = useUser();
  const isCafeUser = useCafeUser(); // This now includes debug override

  // Modal state
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);

  // Customer Stats
  const customerStats = [
    { title: "Cards Saved", value: "5", icon: "💳" },
    { title: "Scans This Month", value: "12", icon: "📱" },
    { title: "Points Earned", value: "248", icon: "⭐" },
  ];

  // Cafe Owner Stats
  const cafeStats = [
    { title: "Total Customers", value: "1,247", icon: "👥" },
    { title: "Cards Issued", value: "89", icon: "🎫" },
    { title: "Rewards Redeemed", value: "156", icon: "🎁" },
  ];

  const statsToShow = isCafeUser ? cafeStats : customerStats;

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
    statsToShow,

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
  };
};

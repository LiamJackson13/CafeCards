/**
 * useProfileStats
 *
 * Custom hook for fetching and calculating profile statistics for both customers and cafe users.
 * Handles loading, error, and refetch logic. Returns stats formatted for display in StatCard components.
 */

import { useEffect, useState } from "react";
import {
  getLoyaltyCardsByCafeUser,
  getLoyaltyCardsByCustomerId,
} from "../../lib/appwrite/loyalty-cards";
import { useCafeUser, useUser } from "../useUser";

export const useProfileStats = () => {
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats on mount and when user/cafe role changes
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.$id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let calculatedStats;

        if (isCafeUser) {
          // Fetch cafe owner stats
          const cafeCards = await getLoyaltyCardsByCafeUser(user.$id);
          calculatedStats = calculateCafeStats(cafeCards);
        } else {
          // Fetch customer stats
          const customerCards = await getLoyaltyCardsByCustomerId(user.$id);
          calculatedStats = calculateCustomerStats(customerCards);
        }

        setStats(calculatedStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile stats:", err);
        setError(err.message);
        // Set fallback stats
        setStats(getFallbackStats(isCafeUser));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.$id, isCafeUser]);

  // Manual refetch handler
  const refetchStats = async () => {
    if (!user?.$id) return;

    try {
      setLoading(true);
      let calculatedStats;

      if (isCafeUser) {
        const cafeCards = await getLoyaltyCardsByCafeUser(user.$id);
        calculatedStats = calculateCafeStats(cafeCards);
      } else {
        const customerCards = await getLoyaltyCardsByCustomerId(user.$id);
        calculatedStats = calculateCustomerStats(customerCards);
      }

      setStats(calculatedStats);
      setError(null);
    } catch (err) {
      console.error("Error refetching profile stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, error, refetch: refetchStats };
};

/**
 * Calculate stats for customer users.
 * Returns array of stat objects for StatCard display.
 */
const calculateCustomerStats = (cards) => {
  if (!Array.isArray(cards)) {
    console.warn("Cards data is not an array:", cards);
    cards = [];
  }

  const totalCards = cards.length;
  const totalStamps = cards.reduce(
    (sum, card) => sum + (parseInt(card.currentStamps) || 0),
    0
  );
  const totalRewards = cards.reduce(
    (sum, card) => sum + (parseInt(card.totalRedeemed) || 0),
    0
  );

  return [
    {
      title: "Active Cards",
      value: totalCards.toString(),
      icon: "💳",
      color: "#4F46E5",
    },
    {
      title: "Total Stamps",
      value: totalStamps.toString(),
      icon: "⭐",
      color: "#059669",
    },
    {
      title: "Rewards Earned",
      value: totalRewards.toString(),
      icon: "🎁",
      color: "#7C3AED",
    },
  ];
};

/**
 * Calculate stats for cafe owner users.
 * Returns array of stat objects for StatCard display.
 */
const calculateCafeStats = (cards) => {
  if (!Array.isArray(cards)) {
    console.warn("Cafe cards data is not an array:", cards);
    cards = [];
  }

  const totalCustomers = new Set(cards.map((card) => card.customerId)).size;
  const totalCards = cards.length;
  const totalStampsIssued = cards.reduce(
    (sum, card) => sum + (parseInt(card.currentStamps) || 0),
    0
  );
  const totalRewardsRedeemed = cards.reduce(
    (sum, card) => sum + (parseInt(card.totalRedeemed) || 0),
    0
  );

  return [
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: "👥",
      color: "#4F46E5",
    },
    {
      title: "Cards Issued",
      value: totalCards.toString(),
      icon: "🎫",
      color: "#059669",
    },
    {
      title: "Stamps Given",
      value: totalStampsIssued.toString(),
      icon: "⭐",
      color: "#DC2626",
    },
    {
      title: "Rewards Redeemed",
      value: totalRewardsRedeemed.toString(),
      icon: "🎁",
      color: "#7C3AED",
    },
  ];
};

/**
 * Get fallback stats in case of error or no data.
 * Returns array of stat objects with zero values.
 */
const getFallbackStats = (isCafeUser) => {
  if (isCafeUser) {
    return [
      { title: "Total Customers", value: "0", icon: "👥", color: "#4F46E5" },
      { title: "Cards Issued", value: "0", icon: "🎫", color: "#059669" },
      { title: "Stamps Given", value: "0", icon: "⭐", color: "#DC2626" },
      { title: "Rewards Redeemed", value: "0", icon: "🎁", color: "#7C3AED" },
    ];
  }

  return [
    { title: "Active Cards", value: "0", icon: "💳", color: "#4F46E5" },
    { title: "Total Stamps", value: "0", icon: "⭐", color: "#059669" },
    { title: "Rewards Earned", value: "0", icon: "🎁", color: "#7C3AED" },
  ];
};

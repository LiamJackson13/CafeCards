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
  // Get current user from authentication context
  const { user } = useUser();
  // Determine if the user is a cafe staff member
  const isCafeUser = useCafeUser();
  // State to hold formatted statistics for display
  const [stats, setStats] = useState(null);
  // Loading flag to indicate fetch in progress
  const [loading, setLoading] = useState(true);
  // Error message state for fetch failures
  const [error, setError] = useState(null);

  // Effect: fetch profile statistics on mount and when user role changes
  useEffect(() => {
    const fetchStats = async () => {
      // If user ID is not available, skip fetching and stop loading
      if (!user?.$id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Begin loading state
        let calculatedStats;

        if (isCafeUser) {
          // For cafe owners: fetch all loyalty cards they manage
          const cafeCards = await getLoyaltyCardsByCafeUser(user.$id);
          // Calculate aggregated stats for cafe (customers, stamps issued, redemptions)
          calculatedStats = calculateCafeStats(cafeCards);
        } else {
          // For customers: fetch cards belonging to this customer
          const customerCards = await getLoyaltyCardsByCustomerId(user.$id);
          // Calculate personal stats (active cards, stamps, rewards)
          calculatedStats = calculateCustomerStats(customerCards);
        }

        setStats(calculatedStats); // Store calculated stats
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Error fetching profile stats:", err);
        // Capture error message and provide fallback stats
        setError(err.message);
        setStats(getFallbackStats(isCafeUser));
      } finally {
        setLoading(false); // Fetch complete
      }
    };

    fetchStats();
  }, [user?.$id, isCafeUser]);

  // Manual refetch function to reload stats on demand
  const refetchStats = async () => {
    if (!user?.$id) return; // No-op if user not authenticated

    try {
      setLoading(true); // Show loading indicator
      let calculatedStats;

      if (isCafeUser) {
        // Re-fetch and recalculate cafe stats
        const cafeCards = await getLoyaltyCardsByCafeUser(user.$id);
        calculatedStats = calculateCafeStats(cafeCards);
      } else {
        // Re-fetch and recalculate customer stats
        const customerCards = await getLoyaltyCardsByCustomerId(user.$id);
        calculatedStats = calculateCustomerStats(customerCards);
      }

      setStats(calculatedStats); // Update stats state
      setError(null); // Clear error state
    } catch (err) {
      console.error("Error refetching profile stats:", err);
      setError(err.message); // Preserve error message
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return { stats, loading, error, refetch: refetchStats };
};

/**
 * Calculate stats for customer users.
 * - totalCards: number of active loyalty cards
 * - totalStamps: sum of current stamps across all cards
 * - totalRewards: sum of redeemed rewards count
 */
const calculateCustomerStats = (cards) => {
  if (!Array.isArray(cards)) {
    console.warn("Cards data is not an array:", cards);
    cards = [];
  }

  // Count active cards
  const totalCards = cards.length;
  // Sum current stamps (parsed as integers)
  const totalStamps = cards.reduce(
    (sum, card) => sum + (parseInt(card.currentStamps) || 0),
    0
  );
  // Sum total redeemed rewards
  const totalRewards = cards.reduce(
    (sum, card) => sum + (parseInt(card.totalRedeemed) || 0),
    0
  );

  // Return array of stat objects for StatCard components
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
 * - totalCustomers: unique customers count
 * - totalCards: number of issued cards
 * - totalStampsIssued: sum of stamps given
 * - totalRewardsRedeemed: sum of redeemed rewards
 */
const calculateCafeStats = (cards) => {
  if (!Array.isArray(cards)) {
    console.warn("Cafe cards data is not an array:", cards);
    cards = [];
  }

  // Unique customer count
  const totalCustomers = new Set(cards.map((card) => card.customerId)).size;
  // Total cards issued by cafe
  const totalCards = cards.length;
  // Sum of stamps given across all cards
  const totalStampsIssued = cards.reduce(
    (sum, card) => sum + (parseInt(card.currentStamps) || 0),
    0
  );
  // Sum of rewards redeemed by customers
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
 * Provides fallback zeroed stats in case of errors or no data.
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

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
          console.log("Fetched cafe cards:", cafeCards);
          calculatedStats = calculateCafeStats(cafeCards);
        } else {
          // Fetch customer stats
          const customerCards = await getLoyaltyCardsByCustomerId(user.$id);
          console.log("Fetched customer cards:", customerCards);
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

  const refetchStats = async () => {
    if (!user?.$id) return;

    try {
      setLoading(true);
      let calculatedStats;

      if (isCafeUser) {
        const cafeCards = await getLoyaltyCardsByCafeUser(user.$id);
        console.log("Refetching cafe cards:", cafeCards);
        calculatedStats = calculateCafeStats(cafeCards);
      } else {
        const customerCards = await getLoyaltyCardsByCustomerId(user.$id);
        console.log("Refetching customer cards:", customerCards);
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

const calculateCustomerStats = (cards) => {
  // Ensure cards is an array
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

const calculateCafeStats = (cards) => {
  // Ensure cards is an array
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

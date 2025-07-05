/**
 * Cards List Hook
 *
 * Manages cards list state, refresh logic, and data formatting.
 */
import { useContext, useState } from "react";
import { CardsContext } from "../../contexts/CardsContext";

export const useCardsList = () => {
  const { cards, loading, fetchCards } = useContext(CardsContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCards();
    } catch (error) {
      console.error("Error refreshing cards:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Process and format cards data for display
  const processCardsData = (cardsData) => {
    if (!cardsData || cardsData.length === 0) return [];

    return cardsData.map((card) => ({
      id: card.$id || card.id,
      customerName: card.customerName || "Unknown Customer",
      customerEmail: card.customerEmail || "",
      cafeName: "Local Cafe",
      location: "Downtown",
      stamps: card.currentStamps || 0,
      maxStamps: 10,
      totalStamps: card.totalStamps || card.currentStamps || 0,
      rewardsEarned:
        card.availableRewards || Math.floor((card.currentStamps || 0) / 10),
      reward: "Free Coffee",
      color: "#007AFF",
      icon: "☕",
      isReady: (card.availableRewards || 0) > 0,
      ...card,
    }));
  };

  const displayCards = processCardsData(cards);

  return {
    displayCards,
    loading,
    refreshing,
    onRefresh,
  };
};

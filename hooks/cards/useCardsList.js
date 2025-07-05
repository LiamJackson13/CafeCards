/**
 * Cards List Hook
 *
 * Manages cards list state, refresh logic, and data formatting.
 */
import { useContext, useState } from "react";
import { CardsContext } from "../../contexts/CardsContext";

export const useCardsList = () => {
  const { cards, loading, fetchCards, updateCard } = useContext(CardsContext);
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

  // Function to update a specific card in the list
  const updateCardInList = (updatedCard) => {
    if (updateCard) {
      updateCard(updatedCard);
    }
  };

  // Process and format cards data for display
  const processCardsData = (cardsData) => {
    if (!cardsData || cardsData.length === 0) return [];

    const processedCards = cardsData.map((card) => ({
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
      isPinned: card.isPinned || false,
      ...card,
    }));

    // Sort cards: pinned cards first, then by last stamp date (most recent first)
    return processedCards.sort((a, b) => {
      // First, sort by pinned status (pinned cards first)
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // If both have same pinned status, sort by last stamp date
      const dateA = new Date(a.lastStampDate || a.issueDate || 0);
      const dateB = new Date(b.lastStampDate || b.issueDate || 0);
      return dateB - dateA;
    });
  };

  const displayCards = processCardsData(cards);

  return {
    displayCards,
    loading,
    refreshing,
    onRefresh,
    updateCardInList,
  };
};

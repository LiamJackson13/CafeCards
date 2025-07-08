/**
 * useCardsList
 *
 * Custom React hook for managing the list of loyalty cards.
 * Handles refresh logic, card updates, and formatting for display.
 * Integrates with CardsContext for global card state and actions.
 */

import { useContext, useState } from "react";
import { CardsContext } from "../../contexts/CardsContext";

export const useCardsList = () => {
  const { cards, loading, fetchCards, updateCard } = useContext(CardsContext);
  const [refreshing, setRefreshing] = useState(false);

  // Pull-to-refresh handler for card list
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

  // Update a specific card in the list (delegates to CardsContext)
  const updateCardInList = (updatedCard) => {
    if (updateCard) {
      updateCard(updatedCard);
    }
  };

  // Format and process cards for display (adds defaults, sorts, etc.)
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

    // Sort: pinned cards first, then by last stamp date (most recent first)
    return processedCards.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.lastStampDate || a.issueDate || 0);
      const dateB = new Date(b.lastStampDate || b.issueDate || 0);
      return dateB - dateA;
    });
  };

  // Cards ready for display in UI
  const displayCards = processCardsData(cards);

  return {
    displayCards, // Array of formatted cards for UI
    loading, // Loading state from CardsContext
    refreshing, // Pull-to-refresh state
    onRefresh, // Handler to refresh cards
    updateCardInList, // Handler to update a card in the list
  };
};

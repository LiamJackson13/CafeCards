/**
 * useEnhancedCardsList
 *
 * Custom React hook for managing the list of loyalty cards with cafe design integration.
 * Loads and caches cafe design data for each unique cafe, merges it with card data,
 * and provides formatted cards for display. Handles refresh logic and error fallback.
 */

import { useContext, useEffect, useState } from "react";
import { CardsContext } from "../../contexts/CardsContext";
import { getCafeDesign } from "../../lib/appwrite/cafe-profiles";

export const useEnhancedCardsList = () => {
  const { cards, loading, fetchCards } = useContext(CardsContext);
  const [refreshing, setRefreshing] = useState(false);
  const [cafeDesigns, setCafeDesigns] = useState({});

  // Load cafe designs for all unique cafe users
  useEffect(() => {
    const loadCafeDesigns = async () => {
      if (!cards || cards.length === 0) return;

      const uniqueCafeUserIds = [
        ...new Set(
          cards.filter((card) => card.cafeUserId).map((card) => card.cafeUserId)
        ),
      ];

      const designs = {};
      for (const cafeUserId of uniqueCafeUserIds) {
        try {
          const design = await getCafeDesign(cafeUserId);
          designs[cafeUserId] = design;
        } catch (error) {
          console.error(`Error loading design for cafe ${cafeUserId}:`, error);
          // Use default design if fetch fails
          designs[cafeUserId] = {
            primaryColor: "#AA7C48",
            secondaryColor: "#7B6F63",
            backgroundColor: "#FDF3E7",
            textColor: "#3B2F2F",
            stampIcon: "☕",
            stampIconColor: "#FFD700",
            borderRadius: 15,
            shadowEnabled: true,
            cafeName: "Local Cafe",
            location: "Downtown",
            rewardDescription: "Free Coffee",
            maxStampsPerCard: 10,
          };
        }
      }
      setCafeDesigns(designs);
    };

    loadCafeDesigns();
  }, [cards]);

  // Pull-to-refresh handler for card list
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchCards();
    } catch (error) {
      console.error("Error refreshing cards:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Update a specific card in the list (refreshes cards from backend)
  const updateCardInList = async (updatedCard) => {
    try {
      await fetchCards();
    } catch (error) {
      console.error("Error refreshing cards after pin update:", error);
    }
  };

  // Merge card data with cafe design for display
  const processCardsData = (cardsData) => {
    if (!cardsData || cardsData.length === 0) return [];

    const processedCards = cardsData.map((card) => {
      const cafeDesign = cafeDesigns[card.cafeUserId] || {
        primaryColor: "#AA7C48",
        secondaryColor: "#7B6F63",
        backgroundColor: "#FDF3E7",
        textColor: "#3B2F2F",
        stampIcon: "☕",
        stampIconColor: "#FFD700",
        borderRadius: 15,
        shadowEnabled: true,
        cafeName: "Local Cafe",
        location: "Downtown",
        rewardDescription: "Free Coffee",
        maxStampsPerCard: 10,
      };

      return {
        id: card.$id || card.id,
        customerName: card.customerName || "Unknown Customer",
        customerEmail: card.customerEmail || "",
        cafeName: cafeDesign.cafeName || "Local Cafe",
        location: cafeDesign.location || "Downtown",
        stamps: card.currentStamps || 0,
        maxStamps: cafeDesign.maxStampsPerCard || 10,
        totalStamps: card.totalStamps || card.currentStamps || 0,
        rewardsEarned:
          card.availableRewards ||
          Math.floor(
            (card.currentStamps || 0) / (cafeDesign.maxStampsPerCard || 10)
          ),
        reward: cafeDesign.rewardDescription || "Free Coffee",
        color: cafeDesign.primaryColor || "#007AFF",
        icon: cafeDesign.stampIcon || "☕",
        isReady: (card.availableRewards || 0) > 0,
        isPinned: card.isPinned || false,
        cafeDesign: cafeDesign, // Attach full design for custom UI
        ...card,
      };
    });

    // Sort: pinned cards first, then by last stamp date (most recent first)
    return processedCards.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.lastStampDate || a.issueDate || 0);
      const dateB = new Date(b.lastStampDate || b.issueDate || 0);
      return dateB - dateA;
    });
  };

  const displayCards = processCardsData(cards);

  return {
    displayCards, // Array of formatted cards for UI
    loading, // Loading state from CardsContext
    refreshing, // Pull-to-refresh state
    onRefresh, // Handler to refresh cards
    updateCardInList, // Handler to update a card in the list
    cafeDesigns, // Map of cafeUserId to design object
  };
};

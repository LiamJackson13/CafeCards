/**
 * Enhanced Card List Hook with Cafe Design Integration
 *
 * Manages cards data loading, formatting, and cafe design integration for the cards list.
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
          // Use default design
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

  // Function to update a specific card in the list
  const updateCardInList = async (updatedCard) => {
    // Since the database update already happened in updateCardPinnedStatus,
    // just refresh the cards list to get the latest data
    try {
      await fetchCards();
    } catch (error) {
      console.error("Error refreshing cards after pin update:", error);
    }
  };

  // Process and format cards data for display with cafe design
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
        // Include the full cafe design for the custom components
        cafeDesign: cafeDesign,
        ...card,
      };
    });

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
    cafeDesigns,
  };
};

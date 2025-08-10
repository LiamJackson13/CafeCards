/**
 * useCardsList
 *
 * Custom React hook for managing the list of loyalty cards with cafe design integration.
 * Loads and caches cafe design data for each unique cafe, merges it with card data,
 * and provides formatted cards for display. Handles refresh logic and error fallback.
 */

import { useContext, useEffect, useState } from "react";
import { CardsContext } from "../../contexts/CardsContext";
import { getCafeDesign } from "../../lib/appwrite/cafe-profiles";

export const useCardsList = () => {
  const { cards, loading, fetchCards } = useContext(CardsContext);
  // Indicates if pull-to-refresh is active (controls spinner)
  const [refreshing, setRefreshing] = useState(false);
  // Stores fetched design configurations keyed by cafeUserId
  const [cafeDesigns, setCafeDesigns] = useState({});

  // Effect: load design metadata for each unique cafe from card list
  useEffect(() => {
    const loadCafeDesigns = async () => {
      // Skip if no cards available
      if (!cards || cards.length === 0) return;

      // Build a set of unique cafeUserIds to minimize API calls
      const uniqueCafeUserIds = [
        ...new Set(
          cards.filter((card) => card.cafeUserId).map((card) => card.cafeUserId)
        ),
      ];

      const designs = {}; // Temp map for fetched or default designs
      for (const cafeUserId of uniqueCafeUserIds) {
        try {
          // Fetch the design configuration for this cafe user
          const design = await getCafeDesign(cafeUserId);
          designs[cafeUserId] = design;
        } catch (error) {
          console.error(`Error loading design for cafe ${cafeUserId}:`, error);
          // Use fallback theme-based design if fetching fails
          designs[cafeUserId] = {
            primaryColor: "#AA7C48",
            // backgroundColor and textColor are handled by theme system
            stampIcon: "☕",
            stampIconColor: "#FFD700",
            borderRadius: 15,
            shadowEnabled: true,
            cafeName: "Local Cafe",
            address: "123 Main St, Newport",
            rewardDescription: "Free Coffee",
            maxStampsPerCard: 10,
          };
        }
      }
      // Update state with complete design map
      setCafeDesigns(designs);
    };

    loadCafeDesigns();
  }, [cards]); // Runs whenever card list changes

  // Handler: pull-to-refresh action for card list
  const onRefresh = async () => {
    try {
      setRefreshing(true); // Show refresh indicator
      await fetchCards(); // Re-fetch card data
    } catch (error) {
      console.error("Error refreshing cards:", error);
    } finally {
      setRefreshing(false); // Hide refresh indicator
    }
  };

  // Handler: update a single card in list by refetching all cards
  const updateCardInList = async (updatedCard) => {
    try {
      await fetchCards(); // Refresh full list to apply updates
    } catch (error) {
      console.error("Error refreshing cards after pin update:", error);
    }
  };

  // Merge raw card data with design meta and compute display fields
  const processCardsData = (cardsData) => {
    // Return empty array if no cards provided
    if (!cardsData || cardsData.length === 0) return [];

    const processedCards = cardsData.map((card) => {
      // Retrieve the design for this cafe or fallback to theme-based defaults
      const cafeDesign = cafeDesigns[card.cafeUserId] || {
        primaryColor: "#AA7C48",
        // backgroundColor and textColor are handled by theme system
        stampIcon: "☕",
        stampIconColor: "#FFD700",
        borderRadius: 15,
        shadowEnabled: true,
        cafeName: "Local Cafe",
        address: "123 Main St, Newport",
        rewardDescription: "Free Coffee",
        maxStampsPerCard: 10,
      };

      return {
        // Core identifiers and raw values
        id: card.$id || card.id,
        customerName: card.customerName || "Unknown Customer",
        customerEmail: card.customerEmail || "",
        // Use design values for theming and display
        cafeName: cafeDesign.cafeName,
        address: cafeDesign.address || "123 Main St, Newport",
        stamps: card.currentStamps || 0,
        maxStamps: cafeDesign.maxStampsPerCard,
        totalStamps: card.totalStamps || card.currentStamps || 0,
        // Calculate earned rewards count
        rewardsEarned:
          card.availableRewards ||
          Math.floor(
            (card.currentStamps || 0) / (cafeDesign.maxStampsPerCard || 10)
          ),
        reward: cafeDesign.rewardDescription,
        // UI properties
        color: cafeDesign.primaryColor,
        icon: cafeDesign.stampIcon,
        isReady: (card.availableRewards || 0) > 0,
        isPinned: card.isPinned || false,
        cafeDesign, // expose full design object
        ...card, // include any extra backend fields
      };
    });

    // Sort cards by pinned status and most recent stamping date
    return processedCards.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const dateA = new Date(a.lastStampDate || a.issueDate || 0);
      const dateB = new Date(b.lastStampDate || b.issueDate || 0);
      // Newer dates first
      return dateB - dateA;
    });
  };

  // Apply processing to raw context cards
  const displayCards = processCardsData(cards);

  return {
    // State
    displayCards,
    loading,
    refreshing,
    // Actions
    onRefresh,
    updateCardInList,
    cafeDesigns,
  };
};

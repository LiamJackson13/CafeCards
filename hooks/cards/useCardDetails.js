/**
 * useCardDetails
 *
 * Hook for managing individual loyalty card details.
 * Handles loading, formatting, polling, and actions (like adding stamps and redemption).
*/

import { useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { CardsContext } from "../../contexts/CardsContext";
import { addStampToCard, parseScanHistory } from "../../lib/appwrite";

export const useCardDetails = (
  cardId,
  user,
  isCafeUser,
  onRedemptionSuccess
) => {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingStamp, setAddingStamp] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [previousAvailableRewards, setPreviousAvailableRewards] =
    useState(null);
  const [formattedCard, setFormattedCard] = useState(null);

  // Context method for fetching card data by ID
  const { fetchCardById } = useContext(CardsContext);

  // Effect: load or reload card data on mount or when cardId changes
  useEffect(() => {
    async function loadCard() {
      try {
        setFormattedCard(null);
        // Show spinner while fetching
        setLoading(true);
        // Fetch card details from context/backend
        const cardData = await fetchCardById(cardId);
        setCard(cardData);
      } catch (error) {
        // Log fetch error and alert user
        console.error("Error loading card:", error);
        Alert.alert("Error", "Failed to load card details");
      } finally {
        // Always hide loading spinner
        setLoading(false);
      }
    }

    // Only load if a valid cardId is provided
    if (cardId) {
      loadCard();
    } else {
      // If no cardId, reset everything
      setCard(null);
      setFormattedCard(null);
      setLoading(false);
    }
  }, [cardId, fetchCardById]);

  // Effect: detect when availableRewards decreases to auto-close modal and notify
  useEffect(() => {
    // Skip until card is loaded
    if (!card) return;

    // Current count of available rewards (new reward system)
    const currentAvailableRewards = card.availableRewards || 0;

    // If rewards dropped while redemption modal open, redemption just succeeded
    if (
      previousAvailableRewards !== null &&
      currentAvailableRewards < previousAvailableRewards &&
      showRedeemModal
    ) {
      // Close the modal UI
      setShowRedeemModal(false);

      // Delay notification callback for smoother UX
      setTimeout(() => {
        if (onRedemptionSuccess) {
          // Build structured info for callback
          const rewardInfo = {
            cafeName: card.cafeName || "your favorite cafe",
            rewardType: "free coffee",
            rewardsRemaining: currentAvailableRewards,
          };
          onRedemptionSuccess(rewardInfo);
        } else {
          // Default alert if no callback provided
          Alert.alert(
            "Reward Redeemed! 🎉",
            "Your reward has been successfully redeemed. Enjoy your free coffee!",
            [{ text: "OK" }]
          );
        }
      }, 300);
    }

    // Update stored previous count for next comparison
    setPreviousAvailableRewards(currentAvailableRewards);
  }, [card, showRedeemModal, previousAvailableRewards, onRedemptionSuccess]);

  // Effect: while redemption modal is open, poll for card updates every 1.5s
  useEffect(() => {
    // Skip if modal closed or no cardId
    if (!showRedeemModal || !cardId) return;

    const pollInterval = setInterval(async () => {
      try {
        // Refetch card details to detect state changes
        const updatedCard = await fetchCardById(cardId);
        setCard(updatedCard);
      } catch (error) {
        console.error("Error polling for card updates:", error);
      }
    }, 1500);

    // Clear interval when modal closes or dependencies change
    return () => {
      clearInterval(pollInterval);
    };
  }, [showRedeemModal, cardId, fetchCardById]);

  // Helper: normalize and augment raw card data for UI display
  const formatCardData = useCallback((cardData) => {
    if (!cardData) return null;

    // Parse raw scan history into structured entries
    const scanHistory = parseScanHistory(cardData.scanHistory);

    // New rewards system only
    if (!("availableRewards" in cardData)) {
      throw new Error(
        "This card does not support the new reward system. Please contact support."
      );
    }

    return {
      ...cardData,
      id: cardData.$id, // Ensure id field is available for UI components
      availableRewards: cardData.availableRewards || 0,
      totalRedeemed: cardData.totalRedeemed || 0,
      scanHistory,
      hasAvailableRewards: (cardData.availableRewards || 0) > 0,
    };
  }, []); // Empty dependency array since function doesn't depend on external values

  // Generate JSON payload string used in redemption QR code
  const generateRedemptionQRData = () => {
    if (!card || !user) return "";

    return JSON.stringify({
      type: "reward_redemption",
      app: "cafe-cards",
      customerId: card.customerId,
      customerName: card.customerName || user.name,
      email: card.customerEmail,
      cardId: card.cardId,
      currentStamps: card.currentStamps,
      availableRewards: card.availableRewards || 0,
      timestamp: new Date().toISOString(),
    });
  };

  // Action: add a stamp to the card via Appwrite backend (cafe staff only)
  const handleAddStamp = async () => {
    // Prevent non-staff from adding stamps
    if (!isCafeUser || !user) {
      Alert.alert("Error", "Only cafe staff can add stamps");
      return;
    }

    try {
      // Indicate stamping in progress
      setAddingStamp(true);
      // Call backend API to add stamp and get updated card
      const updatedCard = await addStampToCard(card.customerId, user.$id);
      // Update state with new card data
      setCard(updatedCard);
      Alert.alert("Success", "Stamp added successfully!");
    } catch (error) {
      // Log error and notify user
      console.error("Error adding stamp:", error);
      Alert.alert("Error", error.message || "Failed to add stamp");
    } finally {
      // Reset stamping indicator
      setAddingStamp(false);
    }
  };

  // Prepare final formatted card for UI components
  useEffect(() => {
    // Format card data whenever the raw card state changes
    const formatted = formatCardData(card);
    setFormattedCard(formatted);
  }, [card, formatCardData]);

  return {
    // State values provided to consuming components
    card,
    formattedCard,
    loading,
    addingStamp,
    showRedeemModal,

    // Action handlers and utilities
    handleAddStamp,
    setShowRedeemModal,
    generateRedemptionQRData,
  };
};

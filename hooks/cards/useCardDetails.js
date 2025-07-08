/**
 * useCardDetails
 *
 * Custom React hook for managing individual loyalty card details.
 * Handles loading, formatting, polling, and actions (like adding stamps and redemption).
 * Integrates with CardsContext and Appwrite backend.
 */

import { useContext, useEffect, useState } from "react";
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

  const { fetchCardById } = useContext(CardsContext);

  // Load card data on mount or when cardId changes
  useEffect(() => {
    async function loadCard() {
      try {
        setLoading(true);
        const cardData = await fetchCardById(cardId);
        setCard(cardData);
      } catch (error) {
        console.error("Error loading card:", error);
        Alert.alert("Error", "Failed to load card details");
      } finally {
        setLoading(false);
      }
    }

    if (cardId) {
      loadCard();
    }
  }, [cardId, fetchCardById]);

  // Monitor for reward redemptions and auto-close modal
  useEffect(() => {
    if (!card) return;

    const currentAvailableRewards = card.availableRewards || 0;

    // If rewards decreased while modal is open, close modal and show success
    if (
      previousAvailableRewards !== null &&
      currentAvailableRewards < previousAvailableRewards &&
      showRedeemModal
    ) {
      setShowRedeemModal(false);

      // Call the success callback with a slight delay for better UX
      setTimeout(() => {
        if (onRedemptionSuccess) {
          // Pass reward info to callback
          const rewardInfo = {
            cafeName: card.cafeName || "your favorite cafe",
            rewardType: "free coffee",
            rewardsRemaining: currentAvailableRewards,
          };
          onRedemptionSuccess(rewardInfo);
        } else {
          Alert.alert(
            "Reward Redeemed! 🎉",
            "Your reward has been successfully redeemed. Enjoy your free coffee!",
            [{ text: "OK" }]
          );
        }
      }, 300);
    }

    // Update the previous rewards count
    setPreviousAvailableRewards(currentAvailableRewards);
  }, [card, showRedeemModal, previousAvailableRewards, onRedemptionSuccess]);

  // Poll for card updates while the redeem modal is open
  useEffect(() => {
    if (!showRedeemModal || !cardId) return;

    const pollInterval = setInterval(async () => {
      try {
        const updatedCard = await fetchCardById(cardId);
        setCard(updatedCard);
      } catch (error) {
        console.error("Error polling for card updates:", error);
      }
    }, 1500); // Poll every 1.5 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [showRedeemModal, cardId, fetchCardById]);

  // Format card data for display (handles old and new reward systems)
  const formatCardData = (cardData) => {
    if (!cardData) return null;

    const scanHistory = parseScanHistory(cardData.scanHistory);

    // New reward system
    if ("availableRewards" in cardData) {
      return {
        ...cardData,
        availableRewards: cardData.availableRewards || 0,
        totalRedeemed: cardData.totalRedeemed || 0,
        scanHistory,
        hasAvailableRewards: (cardData.availableRewards || 0) > 0,
        supportsNewRewards: true,
      };
    } else {
      // Old system: calculate rewards from currentStamps
      const rewardsEarned = Math.floor(cardData.currentStamps / 10);
      const currentProgress = cardData.currentStamps % 10;

      return {
        ...cardData,
        availableRewards: rewardsEarned,
        totalRedeemed: 0, // Unknown in old system
        currentStamps: currentProgress,
        scanHistory,
        hasAvailableRewards: rewardsEarned > 0,
        supportsNewRewards: false,
      };
    }
  };

  // Generate QR code data for reward redemption
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

  // Handle adding a stamp (cafe users only)
  const handleAddStamp = async () => {
    if (!isCafeUser || !user) {
      Alert.alert("Error", "Only cafe staff can add stamps");
      return;
    }

    try {
      setAddingStamp(true);
      const updatedCard = await addStampToCard(card.customerId, user.$id);
      setCard(updatedCard);
      Alert.alert("Success", "Stamp added successfully!");
    } catch (error) {
      console.error("Error adding stamp:", error);
      Alert.alert("Error", error.message || "Failed to add stamp");
    } finally {
      setAddingStamp(false);
    }
  };

  const formattedCard = formatCardData(card);

  return {
    // State
    card,
    formattedCard,
    loading,
    addingStamp,
    showRedeemModal,

    // Actions
    handleAddStamp,
    setShowRedeemModal,
    generateRedemptionQRData,
  };
};

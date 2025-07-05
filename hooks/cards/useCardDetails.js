/**
 * Card Details Hook
 *
 * Manages card data loading, formatting, and actions for individual card details.
 */
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { CardsContext } from "../../contexts/CardsContext";
import { addStampToCard, parseScanHistory } from "../../lib/appwrite";

export const useCardDetails = (cardId, user, isCafeUser) => {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingStamp, setAddingStamp] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const { fetchCardById } = useContext(CardsContext);

  // Load card data
  useEffect(() => {
    async function loadCard() {
      try {
        console.log("Loading card with ID:", cardId);
        setLoading(true);
        const cardData = await fetchCardById(cardId);
        console.log("Received card data:", cardData);
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

  // Format card data for display
  const formatCardData = (cardData) => {
    if (!cardData) return null;

    const scanHistory = parseScanHistory(cardData.scanHistory);

    // Check if this card uses new reward system
    const supportsNewRewards = "availableRewards" in cardData;

    if (supportsNewRewards) {
      // New system: use availableRewards field
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
        currentStamps: currentProgress, // Override to show progress only
        scanHistory,
        hasAvailableRewards: rewardsEarned > 0,
        supportsNewRewards: false,
      };
    }
  };

  // Generate QR code data for redemption
  const generateRedemptionQRData = () => {
    if (!card || !user) return "";

    return JSON.stringify({
      type: "reward_redemption",
      app: "cafe-cards",
      customerId: card.customerId,
      customerName: card.customerName,
      email: card.customerEmail,
      cardId: card.cardId,
      currentStamps: card.currentStamps,
      availableRewards: card.availableRewards || 0,
      timestamp: new Date().toISOString(),
    });
  };

  // Handle adding stamp
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

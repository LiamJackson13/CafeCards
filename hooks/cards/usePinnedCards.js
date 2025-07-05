import { useState } from "react";
import { Alert } from "react-native";
import { updateCardPinnedStatus } from "../../lib/appwrite/loyalty-cards";

/**
 * Hook for managing pinned cards functionality
 */
export const usePinnedCards = () => {
  const [updatingPinStatus, setUpdatingPinStatus] = useState(false);

  /**
   * Toggles the pinned status of a card
   * @param {Object} card - The card to toggle
   * @param {Function} onUpdate - Callback to update the card in the parent component
   * @returns {Promise<void>}
   */
  const toggleCardPin = async (card, onUpdate) => {
    if (updatingPinStatus) return;

    try {
      setUpdatingPinStatus(true);

      const newPinnedStatus = !card.isPinned;

      // Update the card in the database
      const updatedCard = await updateCardPinnedStatus(
        card.$id,
        newPinnedStatus
      );

      // Update the card in the parent component's state
      if (onUpdate) {
        onUpdate(updatedCard);
      }

      // Show feedback to user
      const action = newPinnedStatus ? "pinned" : "unpinned";
      // Note: We could add a toast notification here instead of Alert
      console.log(`Card ${action} successfully`);
    } catch (error) {
      console.error("Error toggling card pin status:", error);

      Alert.alert(
        "Error",
        error.message || "Failed to update card pin status. Please try again."
      );
    } finally {
      setUpdatingPinStatus(false);
    }
  };

  /**
   * Pins a card
   * @param {Object} card - The card to pin
   * @param {Function} onUpdate - Callback to update the card in the parent component
   * @returns {Promise<void>}
   */
  const pinCard = async (card, onUpdate) => {
    if (card.isPinned) return;

    try {
      setUpdatingPinStatus(true);

      const updatedCard = await updateCardPinnedStatus(card.$id, true);

      if (onUpdate) {
        onUpdate(updatedCard);
      }

      console.log("Card pinned successfully");
    } catch (error) {
      console.error("Error pinning card:", error);

      Alert.alert(
        "Error",
        error.message || "Failed to pin card. Please try again."
      );
    } finally {
      setUpdatingPinStatus(false);
    }
  };

  /**
   * Unpins a card
   * @param {Object} card - The card to unpin
   * @param {Function} onUpdate - Callback to update the card in the parent component
   * @returns {Promise<void>}
   */
  const unpinCard = async (card, onUpdate) => {
    if (!card.isPinned) return;

    try {
      setUpdatingPinStatus(true);

      const updatedCard = await updateCardPinnedStatus(card.$id, false);

      if (onUpdate) {
        onUpdate(updatedCard);
      }

      console.log("Card unpinned successfully");
    } catch (error) {
      console.error("Error unpinning card:", error);

      Alert.alert(
        "Error",
        error.message || "Failed to unpin card. Please try again."
      );
    } finally {
      setUpdatingPinStatus(false);
    }
  };

  return {
    updatingPinStatus,
    toggleCardPin,
    pinCard,
    unpinCard,
  };
};

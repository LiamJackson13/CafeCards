import { useState } from "react";
import { Alert } from "react-native";
import { updateCardPinnedStatus } from "../../lib/appwrite/loyalty-cards";

/**
 * usePinnedCards
 *
 * Custom hook for managing pinned cards functionality.
 * Provides methods to pin, unpin, and toggle the pinned status of a card.
 * Handles updating the backend and parent state, and provides feedback on errors.
 */
export const usePinnedCards = () => {
  // Tracks whether a pin/unpin operation is currently in progress
  const [updatingPinStatus, setUpdatingPinStatus] = useState(false);

  /**
   * Toggles the pinned status of a card:
   * - Prevents overlapping operations
   * - Flips the isPinned flag and updates backend
   * - Calls onUpdate callback with updated card data
   * @param {Object} card - The card object to toggle pin status on
   * @param {Function} onUpdate - Callback to apply updated card in parent state
   */
  const toggleCardPin = async (card, onUpdate) => {
    // Prevent if another update is in progress
    if (updatingPinStatus) return;

    try {
      setUpdatingPinStatus(true); // Mark operation as active
      // Determine new pin status by negating current status
      const newPinnedStatus = !card.isPinned;

      // Call backend to update the pinned status
      const updatedCard = await updateCardPinnedStatus(
        card.$id,
        newPinnedStatus
      );

      // If parent provided a callback, update its state
      if (onUpdate) {
        onUpdate(updatedCard);
      }

      // Log success; replace with toast or UI feedback as needed
      console.log(
        `Card ${newPinnedStatus ? "pinned" : "unpinned"} successfully`
      );
    } catch (error) {
      // Log error details for debugging
      console.error("Error toggling card pin status:", error);
      // Show alert to user with error message fallback
      Alert.alert(
        "Error",
        error.message || "Failed to update card pin status. Please try again."
      );
    } finally {
      // Clear busy flag regardless of success or failure
      setUpdatingPinStatus(false);
    }
  };

  /**
   * Pins a card (sets isPinned = true) if not already pinned
   * - Skips operation if card is already pinned
   * @param {Object} card - The card to pin
   * @param {Function} onUpdate - Callback to update parent state
   */
  const pinCard = async (card, onUpdate) => {
    // No-op if already pinned
    if (card.isPinned) return;

    try {
      setUpdatingPinStatus(true); // Enter busy state
      // Update backend to mark card as pinned
      const updatedCard = await updateCardPinnedStatus(card.$id, true);

      // Propagate updated card to parent
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
      setUpdatingPinStatus(false); // Clear busy state
    }
  };

  /**
   * Unpins a card (sets isPinned = false) if currently pinned
   * - Skips operation if card is not pinned
   * @param {Object} card - The card to unpin
   * @param {Function} onUpdate - Callback to update parent state
   */
  const unpinCard = async (card, onUpdate) => {
    // No-op if not currently pinned
    if (!card.isPinned) return;

    try {
      setUpdatingPinStatus(true); // Enter busy state
      // Update backend to mark card as unpinned
      const updatedCard = await updateCardPinnedStatus(card.$id, false);

      // Propagate updated card to parent
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
      setUpdatingPinStatus(false); // Clear busy state
    }
  };

  return {
    updatingPinStatus, // True when any pin/unpin operation is ongoing
    toggleCardPin, // Toggles pin status with backend update and callback
    pinCard, // Explicitly pins card if not already pinned
    unpinCard, // Explicitly unpins card if currently pinned
  };
};

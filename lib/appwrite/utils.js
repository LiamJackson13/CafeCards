/**
 * Appwrite Utility Functions
 *
 * Contains helper functions and utilities for working with Appwrite data.
 */
import {
  DATABASE_ID,
  databases,
  LOYALTY_CARDS_COLLECTION_ID,
} from "./client.js";

/**
 * Helper function to safely parse scan history from JSON string
 * @param {string} scanHistoryString - JSON string of scan history
 * @returns {Array} Parsed scan history array
 */
export const parseScanHistory = (scanHistoryString) => {
  try {
    return JSON.parse(scanHistoryString || "[]");
  } catch (error) {
    console.warn("Failed to parse scan history:", error);
    return [];
  }
};

/**
 * Helper function to calculate rewards and current stamps based on total stamps
 * @param {number} totalStamps - Total stamps collected
 * @returns {Object} Object with currentStamps and availableRewards
 */
export const calculateRewards = (totalStamps) => {
  const availableRewards = Math.floor(totalStamps / 10);
  const currentStamps = totalStamps % 10;
  return { currentStamps, availableRewards };
};

/**
 * Helper function to safely create card data that works with current database schema
 * @param {Object} cardData - The card data
 * @param {string} cafeUserId - The cafe user ID
 * @returns {Object} Safe card document data
 */
export const createSafeCardDocument = (cardData, cafeUserId) => {
  const baseDocument = {
    customerId: cardData.customerId,
    customerName: cardData.customerName,
    customerEmail: cardData.customerEmail,
    cardId: cardData.cardId,
    currentStamps: cardData.currentStamps || 0,
    totalStamps: cardData.totalStamps || 0,
    issueDate: cardData.issueDate || new Date().toISOString(),
    lastStampDate: new Date().toISOString(),
    cafeUserId: cafeUserId,
    isActive: true,
    scanHistory: JSON.stringify([]),
  };

  // Only add new fields if they were provided (indicating schema supports them)
  if (cardData.availableRewards !== undefined) {
    baseDocument.availableRewards = cardData.availableRewards;
  }
  if (cardData.totalRedeemed !== undefined) {
    baseDocument.totalRedeemed = cardData.totalRedeemed;
  }

  return baseDocument;
};

/**
 * Helper function to safely create update data that works with current database schema
 * @param {Object} updateData - The update data
 * @param {Object} existingCard - The existing card data
 * @returns {Object} Safe update data
 */
export const createSafeUpdateData = (updateData, existingCard = {}) => {
  const safeData = { ...updateData };

  // For required fields, ensure they are always present with defaults
  // This helps when updating legacy cards that may not have these fields

  // Always include totalRedeemed if it's not already in the update data
  if (safeData.totalRedeemed === undefined) {
    safeData.totalRedeemed = existingCard.totalRedeemed || 0;
  }

  // Always include availableRewards if it's not already in the update data
  if (safeData.availableRewards === undefined) {
    safeData.availableRewards = existingCard.availableRewards || 0;
  }

  return safeData;
};

/**
 * Utility function to check if a document exists and is accessible
 * @param {string} documentId - The document ID to check
 * @returns {Promise<boolean>} Whether the document is accessible
 */
export const isDocumentAccessible = async (documentId) => {
  try {
    if (!documentId) return false;

    await databases.getDocument(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      documentId
    );

    return true;
  } catch (error) {
    console.log(`Document ${documentId} is not accessible:`, error.message);
    return false;
  }
};

/**
 * Clean up function to validate all cards in an array and remove inaccessible ones
 * @param {Array} cards - Array of card documents to validate
 * @returns {Promise<Array>} Array of valid, accessible cards
 */
export const validateAndCleanCards = async (cards) => {
  if (!Array.isArray(cards)) return [];

  const validCards = [];

  for (const card of cards) {
    if (!card || !card.$id) {
      console.warn("Skipping invalid card (missing $id):", card);
      continue;
    }

    const isAccessible = await isDocumentAccessible(card.$id);
    if (isAccessible) {
      validCards.push(card);
    } else {
      console.warn("Removing inaccessible card from local state:", card.$id);
    }
  }

  return validCards;
};

/**
 * Debug function to inspect card structure
 * @param {string} customerId - Customer ID to check
 * @returns {Promise<Object>} Card structure info
 */
export const debugCardStructure = async (customerId) => {
  try {
    const { findLoyaltyCardByCustomerId } = await import("./loyalty-cards.js");
    const card = await findLoyaltyCardByCustomerId(customerId);
    if (!card) {
      return { error: "Card not found" };
    }

    return {
      cardId: card.$id,
      hasAvailableRewards: "availableRewards" in card,
      hasTotalRedeemed: "totalRedeemed" in card,
      availableRewardsValue: card.availableRewards,
      totalRedeemedValue: card.totalRedeemed,
      currentStamps: card.currentStamps,
      totalStamps: card.totalStamps,
      allFields: Object.keys(card),
    };
  } catch (error) {
    return { error: error.message };
  }
};

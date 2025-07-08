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
 * Safely parses scan history from a JSON string.
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
 * Calculates rewards and current stamps based on total stamps.
 * @param {number} totalStamps - Total stamps collected
 * @returns {Object} { currentStamps, availableRewards }
 */
export const calculateRewards = (totalStamps) => {
  const availableRewards = Math.floor(totalStamps / 10);
  const currentStamps = totalStamps % 10;
  return { currentStamps, availableRewards };
};

/**
 * Creates a safe card document for the current database schema.
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
    isPinned: false,
    scanHistory: JSON.stringify([]),
  };

  // Add new fields if provided (for schema compatibility)
  if (cardData.availableRewards !== undefined) {
    baseDocument.availableRewards = cardData.availableRewards;
  }
  if (cardData.totalRedeemed !== undefined) {
    baseDocument.totalRedeemed = cardData.totalRedeemed;
  }

  return baseDocument;
};

/**
 * Creates safe update data for the current database schema.
 * Ensures required fields are present with defaults for legacy cards.
 * @param {Object} updateData - The update data
 * @param {Object} existingCard - The existing card data
 * @returns {Object} Safe update data
 */
export const createSafeUpdateData = (updateData, existingCard = {}) => {
  const safeData = { ...updateData };

  // Ensure totalRedeemed and availableRewards are always present
  if (safeData.totalRedeemed === undefined) {
    safeData.totalRedeemed = existingCard.totalRedeemed || 0;
  }
  if (safeData.availableRewards === undefined) {
    safeData.availableRewards = existingCard.availableRewards || 0;
  }

  return safeData;
};

/**
 * Checks if a document exists and is accessible.
 * @param {string} documentId - The document ID to check
 * @returns {Promise<boolean>} Whether the document is accessible
 */
export const isDocumentAccessible = async (documentId) => {
  if (!documentId) return false;
  try {
    await databases.getDocument(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      documentId
    );
    return true;
  } catch (error) {
    if (__DEV__) {
      console.log(`Document ${documentId} is not accessible:`, error.message);
    }
    return false;
  }
};

/**
 * Validates all cards in an array and removes inaccessible ones.
 * @param {Array} cards - Array of card documents to validate
 * @returns {Promise<Array>} Array of valid, accessible cards
 */
export const validateAndCleanCards = async (cards) => {
  if (!Array.isArray(cards)) return [];
  const validCards = [];
  for (const card of cards) {
    if (!card || !card.$id) {
      if (__DEV__) console.warn("Skipping invalid card (missing $id):", card);
      continue;
    }
    const isAccessible = await isDocumentAccessible(card.$id);
    if (isAccessible) {
      validCards.push(card);
    } else if (__DEV__) {
      console.warn("Removing inaccessible card from local state:", card.$id);
    }
  }
  return validCards;
};

/**
 * Debug function to inspect card structure.
 * @param {string} customerId - Customer ID to check
 * @returns {Promise<Object>} Card structure info or error
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

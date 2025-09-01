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
 * @param {string} scanHistoryString - JSON string of scan history - using string for database storage compatibility
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
 * Creates a safe card document for the current database schema.
 * @param {Object} cardData - The card data - using Object to group related card properties
 * @param {string} cafeUserId - The cafe user ID
 * @returns {Object} Safe card document data
 */
export const createSafeCardDocument = (cardData, cafeUserId) => {
  return {
    customerId: cardData.customerId,
    customerName: cardData.customerName,
    customerEmail: cardData.customerEmail,
    cardId: cardData.cardId,
    currentStamps: cardData.currentStamps || 0, // Using number primitives for efficient counter operations
    totalStamps: cardData.totalStamps || 0,
    availableRewards: cardData.availableRewards || 0,
    totalRedeemed: cardData.totalRedeemed || 0,
    issueDate: cardData.issueDate || new Date().toISOString(),
    lastStampDate: new Date().toISOString(),
    cafeUserId: cafeUserId,
    isActive: true, // Using boolean for simple active/inactive state
    isPinned: false,
    scanHistory: JSON.stringify([]), // Using JSON string for array storage in database
  };
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
 * @param {Array} cards - Array of card documents to validate - using Array for collection handling
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
    const { findLoyaltyCardByCustomerId } = await import("./loyaltyCards.js");
    const card = await findLoyaltyCardByCustomerId(customerId);
    if (!card) {
      return { error: "Card not found" };
    }
    return {
      cardId: card.$id,
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

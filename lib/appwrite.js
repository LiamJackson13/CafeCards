/**
 * Appwrite Configuration
 *
 * This file sets up and exports the Appwrite client and services for the Cafe Cards app.
 * It configures the connection to the Appwrite backend with platform, project ID, and endpoint.
 * Exports initialized instances of Account, Avatars, Databases, and Teams services
 * that are used throughout the app for authentication, user management, and data operations.
 */
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Permission,
  Query,
  Role,
  Teams,
} from "react-native-appwrite";

export const client = new Client()
  .setPlatform("co.liamjackson.cafecards")
  .setProject("685f48ce0025763a40ec")
  .setEndpoint("https://syd.cloud.appwrite.io/v1");

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

// Database configuration
export const DATABASE_ID = "6865cc6c000a762776eb";
export const BOOKS_COLLECTION_ID = "6865cc8d003cfd746b7f";
// Note: You need to create the loyalty_cards collection in Appwrite console with these attributes:
// - customerId (string, required)
// - customerName (string, required)
// - customerEmail (string, required)
// - cardId (string, required)
// - currentStamps (integer, required, default: 0)
// - totalStamps (integer, required, default: 0)
// - issueDate (datetime, required)
// - lastStampDate (datetime, required)
// - cafeUserId (string, required) - references the cafe user who manages this card
// - isActive (boolean, required, default: true)
// - scanHistory (string, optional) - JSON string containing scan history array
export const LOYALTY_CARDS_COLLECTION_ID = "6868666e000011d27bb1"; // Replace with actual collection ID

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
 * User Account Management Functions
 */

/**
 * Updates the user's name in their Appwrite account
 * @param {string} name - The new name for the user
 * @returns {Promise<Object>} The updated user account object
 */
export const updateUserName = async (name) => {
  try {
    if (!name || name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }

    if (name.trim().length > 128) {
      throw new Error("Name cannot be longer than 128 characters");
    }

    const result = await account.updateName(name.trim());
    return result;
  } catch (error) {
    console.error("Error updating user name:", error);

    if (error.code === 401) {
      throw new Error("You must be logged in to update your name.");
    } else if (error.message?.includes("Name cannot be")) {
      throw error; // Re-throw validation errors as-is
    }

    throw new Error("Failed to update name. Please try again.");
  }
};

/**
 * Loyalty Card Management Functions
 */

/**
 * Creates a new loyalty card entry for a customer
 * @param {Object} cardData - The card data to save
 * @param {string} cafeUserId - The ID of the cafe user adding the card
 * @returns {Promise<Object>} The created card document
 */
export const createLoyaltyCard = async (cardData, cafeUserId) => {
  try {
    const cardDocument = {
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
      // Store scanHistory as JSON string
      scanHistory: JSON.stringify([]),
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      ID.unique(),
      cardDocument,
      [
        Permission.read(Role.user(cafeUserId)),
        Permission.update(Role.user(cafeUserId)),
        Permission.delete(Role.user(cafeUserId)),
      ]
    );

    return result;
  } catch (error) {
    console.error("Error creating loyalty card:", error);
    throw error;
  }
};

/**
 * Updates an existing loyalty card (e.g., adding stamps)
 * @param {string} cardDocumentId - The document ID of the card to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} The updated card document
 */
export const updateLoyaltyCard = async (cardDocumentId, updateData) => {
  try {
    if (!cardDocumentId) {
      throw new Error("Card document ID is required");
    }

    const result = await databases.updateDocument(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      cardDocumentId,
      updateData
    );

    return result;
  } catch (error) {
    console.error("Error updating loyalty card:", error);

    // Provide more specific error information
    if (
      error.code === 404 ||
      error.message?.includes(
        "Document with the requested ID could not be found"
      )
    ) {
      throw new Error(
        `Loyalty card not found (ID: ${cardDocumentId}). It may have been deleted.`
      );
    } else if (error.code === 401) {
      throw new Error("You don't have permission to update this loyalty card.");
    } else if (error.code === 400) {
      throw new Error("Invalid data provided for loyalty card update.");
    }

    throw error;
  }
};

/**
 * Finds a loyalty card by customer ID
 * @param {string} customerId - The customer ID to search for
 * @returns {Promise<Object|null>} The card document or null if not found
 */
export const findLoyaltyCardByCustomerId = async (customerId) => {
  try {
    if (!customerId) {
      console.warn("Customer ID is required for finding loyalty card");
      return null;
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [Query.equal("customerId", customerId)]
    );

    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error("Error finding loyalty card:", error);

    // Return null instead of throwing for not found cases
    if (
      error.code === 404 ||
      error.message?.includes(
        "Collection with the requested ID could not be found"
      )
    ) {
      console.warn("Loyalty cards collection not found, returning null");
      return null;
    } else if (error.code === 401) {
      console.warn(
        "Permission denied when finding loyalty card, returning null"
      );
      return null;
    }

    // For other errors, still throw
    throw error;
  }
};

/**
 * Gets all loyalty cards managed by a specific cafe user
 * @param {string} cafeUserId - The ID of the cafe user
 * @returns {Promise<Array>} Array of card documents
 */
export const getLoyaltyCardsByCafeUser = async (cafeUserId) => {
  try {
    if (!cafeUserId) {
      console.warn("Cafe user ID is required for fetching loyalty cards");
      return [];
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [Query.equal("cafeUserId", cafeUserId)]
    );

    return result.documents || [];
  } catch (error) {
    console.error("Error fetching loyalty cards:", error);

    // Return empty array instead of throwing for common errors
    if (
      error.code === 404 ||
      error.message?.includes(
        "Collection with the requested ID could not be found"
      )
    ) {
      console.warn("Loyalty cards collection not found, returning empty array");
      return [];
    } else if (error.code === 401) {
      console.warn(
        "Permission denied when fetching loyalty cards, returning empty array"
      );
      return [];
    }

    // For other errors, still throw
    throw error;
  }
};

/**
 * Gets all loyalty cards for a specific customer
 * @param {string} customerId - The customer ID to search for
 * @returns {Promise<Array>} Array of card documents for the customer
 */
export const getLoyaltyCardsByCustomerId = async (customerId) => {
  try {
    if (!customerId) {
      console.warn("Customer ID is required for fetching loyalty cards");
      return [];
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [Query.equal("customerId", customerId)]
    );

    return result.documents || [];
  } catch (error) {
    console.error("Error fetching customer loyalty cards:", error);

    // Return empty array instead of throwing for common errors
    if (
      error.code === 404 ||
      error.message?.includes(
        "Collection with the requested ID could not be found"
      )
    ) {
      console.warn("Loyalty cards collection not found, returning empty array");
      return [];
    } else if (error.code === 401) {
      console.warn(
        "Permission denied when fetching customer loyalty cards, returning empty array"
      );
      return [];
    }

    // For other errors, still throw
    throw error;
  }
};

/**
 * Adds a stamp to a loyalty card
 * @param {string} customerId - The customer ID
 * @param {string} cafeUserId - The cafe user ID adding the stamp
 * @returns {Promise<Object>} The updated card with stamp added
 */
export const addStampToCard = async (customerId, cafeUserId) => {
  try {
    if (!customerId || !cafeUserId) {
      throw new Error("Customer ID and cafe user ID are required");
    }

    // Find existing card
    let card = await findLoyaltyCardByCustomerId(customerId);

    if (card) {
      // Validate card still exists and user has permission
      if (!card.$id) {
        throw new Error("Invalid card data received");
      }

      // Parse existing scan history
      let existingScanHistory = [];
      try {
        existingScanHistory = JSON.parse(card.scanHistory || "[]");
      } catch (parseError) {
        console.warn(
          "Failed to parse scan history, starting fresh:",
          parseError
        );
        existingScanHistory = [];
      }

      // Update existing card
      const newStamps = card.currentStamps + 1;
      const newScanEntry = {
        timestamp: new Date().toISOString(),
        action: "stamp_added",
        cafeUserId: cafeUserId,
      };

      const updateData = {
        currentStamps: newStamps,
        totalStamps: card.totalStamps + 1,
        lastStampDate: new Date().toISOString(),
        scanHistory: JSON.stringify([...existingScanHistory, newScanEntry]),
      };

      card = await updateLoyaltyCard(card.$id, updateData);
    } else {
      // Create new card if it doesn't exist
      const cardData = {
        customerId: customerId,
        customerName: "Unknown Customer", // This should be populated from QR data
        customerEmail: "unknown@example.com", // This should be populated from QR data
        cardId: customerId,
        currentStamps: 1,
        totalStamps: 1,
      };

      card = await createLoyaltyCard(cardData, cafeUserId);
    }

    return card;
  } catch (error) {
    console.error("Error adding stamp to card:", error);

    // Provide more user-friendly error messages
    if (error.message?.includes("Loyalty card not found")) {
      throw new Error(
        "The loyalty card was deleted or is no longer available. Please try creating a new card."
      );
    } else if (error.message?.includes("permission")) {
      throw new Error(
        "You don't have permission to add stamps to this loyalty card."
      );
    } else if (
      error.message?.includes("Customer ID and cafe user ID are required")
    ) {
      throw error; // Re-throw validation errors as-is
    }

    throw new Error("Failed to add stamp to loyalty card. Please try again.");
  }
};

/**
 * Redeems a reward for a customer by resetting their stamp count
 * @param {string} customerId - The customer ID
 * @param {string} cafeUserId - The ID of the cafe user processing the redemption
 * @returns {Promise<Object>} The updated card document
 */
export const redeemReward = async (customerId, cafeUserId) => {
  try {
    if (!customerId || !cafeUserId) {
      throw new Error("Customer ID and cafe user ID are required");
    }

    // Find existing loyalty card
    let card = await findLoyaltyCardByCustomerId(customerId);

    if (!card) {
      throw new Error("Loyalty card not found for this customer");
    }

    // Check if customer has a complete set of stamps (eligible for reward)
    const currentProgress = card.currentStamps % 10;
    if (currentProgress !== 0 || card.currentStamps === 0) {
      throw new Error("Customer does not have a complete reward to redeem");
    }

    // Parse existing scan history
    const existingScanHistory = parseScanHistory(card.scanHistory);

    // Create redemption entry
    const redemptionEntry = {
      timestamp: new Date().toISOString(),
      action: "reward_redeemed",
      cafeUserId: cafeUserId,
    };

    // Update card: reset current stamps but keep total stamps
    const updateData = {
      currentStamps: 0, // Reset to 0 after redemption
      lastStampDate: new Date().toISOString(),
      scanHistory: JSON.stringify([...existingScanHistory, redemptionEntry]),
    };

    card = await updateLoyaltyCard(card.$id, updateData);

    return card;
  } catch (error) {
    console.error("Error redeeming reward:", error);

    // Provide more user-friendly error messages
    if (error.message?.includes("Loyalty card not found")) {
      throw new Error("The loyalty card was not found. Please try again.");
    } else if (error.message?.includes("permission")) {
      throw new Error(
        "You don't have permission to redeem rewards for this card."
      );
    } else if (error.message?.includes("does not have a complete reward")) {
      throw error; // Re-throw validation errors as-is
    }

    throw new Error("Failed to redeem reward. Please try again.");
  }
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
 * Gets a loyalty card by its document ID
 * @param {string} cardDocumentId - The document ID of the card
 * @returns {Promise<Object|null>} The card document or null if not found
 */
export const getLoyaltyCardById = async (cardDocumentId) => {
  try {
    if (!cardDocumentId) {
      console.warn("Card document ID is required for fetching loyalty card");
      return null;
    }

    const result = await databases.getDocument(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      cardDocumentId
    );

    return result;
  } catch (error) {
    console.error("Error fetching loyalty card by ID:", error);

    // Return null instead of throwing for not found cases
    if (
      error.code === 404 ||
      error.message?.includes(
        "Document with the requested ID could not be found"
      )
    ) {
      console.warn("Loyalty card not found, returning null");
      return null;
    } else if (error.code === 401) {
      console.warn(
        "Permission denied when fetching loyalty card, returning null"
      );
      return null;
    }

    // For other errors, still throw
    throw error;
  }
};

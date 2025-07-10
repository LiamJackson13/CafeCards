/**
 * Appwrite Loyalty Card Functions
 *
 * Contains all loyalty card CRUD operations and business logic.
 * Used for creating, updating, fetching, and managing loyalty cards and rewards.
 */

import {
  DATABASE_ID,
  databases,
  ID,
  LOYALTY_CARDS_COLLECTION_ID,
  Permission,
  Query,
  Role,
} from "./client.js";
import {
  calculateRewards,
  createSafeCardDocument,
  createSafeUpdateData,
  parseScanHistory,
} from "./utils.js";

/**
 * Creates a new loyalty card entry for a customer
 * @param {Object} cardData - The card data to save
 * @param {string} cafeUserId - The ID of the cafe user adding the card
 * @returns {Promise<Object>} The created card document
 */
export const createLoyaltyCard = async (cardData, cafeUserId) => {
  try {
    const cardDocument = createSafeCardDocument(cardData, cafeUserId);

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

    // First, get the existing card to check its structure
    const existingCard = await databases.getDocument(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      cardDocumentId
    );

    // Create safe update data that ensures all required fields are present
    const safeUpdateData = createSafeUpdateData(updateData, existingCard);

    console.log("Updating card with data:", {
      cardId: cardDocumentId,
      updateData: safeUpdateData,
      existingCard: {
        totalRedeemed: existingCard.totalRedeemed,
        availableRewards: existingCard.availableRewards,
        currentStamps: existingCard.currentStamps,
        totalStamps: existingCard.totalStamps,
      },
    });

    const result = await databases.updateDocument(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      cardDocumentId,
      safeUpdateData
    );

    return result;
  } catch (error) {
    console.error("Error updating loyalty card:", error);

    // Provide more specific error information
    if (
      error.code === 404 ||
      (error.message &&
        error.message.includes(
          "Document with the requested ID could not be found"
        ))
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
 * Finds a loyalty card by customer ID and cafe user ID
 * @param {string} customerId - The customer ID to search for
 * @param {string} cafeUserId - The cafe user ID to search for
 * @returns {Promise<Object|null>} The card document or null if not found
 */
export const findLoyaltyCardByCustomerIdAndCafeUserId = async (
  customerId,
  cafeUserId
) => {
  try {
    if (!customerId || !cafeUserId) {
      console.warn(
        "Customer ID and cafe user ID are required for finding loyalty card"
      );
      return null;
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [
        Query.equal("customerId", customerId),
        Query.equal("cafeUserId", cafeUserId),
      ]
    );

    return result.documents.length > 0 ? result.documents[0] : null;
  } catch (error) {
    console.error(
      "Error finding loyalty card by customer and cafe user:",
      error
    );

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
      return [];
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [Query.equal("cafeUserId", cafeUserId)]
    );

    return result.documents || [];
  } catch (error) {
    if (isAuthError(error) || isNotFoundError(error)) {
      return [];
    }
    console.error("Error fetching loyalty cards:", error);
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
      return [];
    }

    const result = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [Query.equal("customerId", customerId)]
    );

    return result.documents || [];
  } catch (error) {
    if (isAuthError(error) || isNotFoundError(error)) {
      return [];
    }
    console.error("Error fetching customer loyalty cards:", error);
    throw error;
  }
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
      (error.message &&
        error.message.includes(
          "Document with the requested ID could not be found"
        ))
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

/**
 * Adds a stamp to a loyalty card
 * @param {string|Object} customerIdOrData - The customer ID or customer data object
 * @param {string} cafeUserId - The cafe user ID adding the stamp
 * @returns {Promise<Object>} The updated card with stamp added
 */
export const addStampToCard = async (customerIdOrData, cafeUserId) => {
  try {
    // Support both old string format and new object format
    let customerId, customerData;
    if (typeof customerIdOrData === "string") {
      customerId = customerIdOrData;
      customerData = {
        customerId: customerId,
        customerName: "Unknown Customer",
        customerEmail: "unknown@example.com",
        cardId: customerId,
      };
    } else {
      customerId = customerIdOrData.id || customerIdOrData.customerId;
      customerData = {
        customerId: customerId,
        customerName: customerIdOrData.name || "Unknown Customer",
        customerEmail: customerIdOrData.email || "unknown@example.com",
        cardId: customerIdOrData.cardId || customerId,
      };
    }

    if (!customerId || !cafeUserId) {
      throw new Error("Customer ID and cafe user ID are required");
    }

    // Find existing card for this customer and cafe combination
    let card = await findLoyaltyCardByCustomerIdAndCafeUserId(
      customerId,
      cafeUserId
    );

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

      // Calculate new totals and rewards
      const newTotalStamps = card.totalStamps + 1;

      const newScanEntry = {
        timestamp: new Date().toISOString(),
        action: "stamp_added",
        cafeUserId: cafeUserId,
      };

      // Check if the card supports new reward fields
      const supportsNewRewards = "availableRewards" in card;

      let updateData;
      if (supportsNewRewards) {
        // Use new reward system
        const { currentStamps, availableRewards } =
          calculateRewards(newTotalStamps);
        updateData = {
          currentStamps: currentStamps,
          totalStamps: newTotalStamps,
          availableRewards: availableRewards,
          lastStampDate: new Date().toISOString(),
          scanHistory: JSON.stringify([...existingScanHistory, newScanEntry]),
        };
      } else {
        // Use old system (currentStamps can go beyond 10)
        updateData = {
          currentStamps: card.currentStamps + 1,
          totalStamps: newTotalStamps,
          lastStampDate: new Date().toISOString(),
          scanHistory: JSON.stringify([...existingScanHistory, newScanEntry]),
        };
      }

      console.log("AddStampToCard - Update data:", updateData);
      console.log("AddStampToCard - Supports new rewards:", supportsNewRewards);

      card = await updateLoyaltyCard(card.$id, updateData);
    } else {
      // Create new card if it doesn't exist for this customer and cafe combination
      const newTotalStamps = 1;
      const { currentStamps, availableRewards } =
        calculateRewards(newTotalStamps);

      const cardData = {
        customerId: customerId,
        customerName: customerData.customerName,
        customerEmail: customerData.customerEmail,
        cardId: customerData.cardId,
        currentStamps: currentStamps,
        totalStamps: newTotalStamps,
        availableRewards: availableRewards,
        totalRedeemed: 0,
      };

      console.log("AddStampToCard - Creating new card:", cardData);
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
 * Redeems a reward for a customer by decreasing available rewards count
 * @param {string} customerId - The customer ID
 * @param {string} cafeUserId - The ID of the cafe user processing the redemption
 * @returns {Promise<Object>} The updated card document
 */
export const redeemReward = async (customerId, cafeUserId) => {
  try {
    if (!customerId || !cafeUserId) {
      throw new Error("Customer ID and cafe user ID are required");
    }

    // Find existing loyalty card for this customer and cafe combination
    let card = await findLoyaltyCardByCustomerIdAndCafeUserId(
      customerId,
      cafeUserId
    );

    if (!card) {
      throw new Error("Loyalty card not found for this customer at this cafe");
    }

    // Check if the card supports new reward fields
    const supportsNewRewards = "availableRewards" in card;

    if (supportsNewRewards) {
      // New reward system: check availableRewards
      if (!card.availableRewards || card.availableRewards <= 0) {
        throw new Error(
          "Customer does not have any available rewards to redeem"
        );
      }
    } else {
      // Old reward system: check if currentStamps is a multiple of 10
      const currentProgress = card.currentStamps % 10;
      if (currentProgress !== 0 || card.currentStamps === 0) {
        throw new Error("Customer does not have a complete reward to redeem");
      }
    }

    // Parse existing scan history
    const existingScanHistory = parseScanHistory(card.scanHistory);

    // Create redemption entry
    const redemptionEntry = {
      timestamp: new Date().toISOString(),
      action: "reward_redeemed",
      cafeUserId: cafeUserId,
    };

    // Update card based on schema support
    let updateData;
    if (supportsNewRewards) {
      // New system: decrease available rewards and increase total redeemed
      updateData = {
        availableRewards: card.availableRewards - 1,
        totalRedeemed: (card.totalRedeemed || 0) + 1,
        lastStampDate: new Date().toISOString(),
        scanHistory: JSON.stringify([...existingScanHistory, redemptionEntry]),
      };
    } else {
      // Old system: reset current stamps to 0
      updateData = {
        currentStamps: 0,
        lastStampDate: new Date().toISOString(),
        scanHistory: JSON.stringify([...existingScanHistory, redemptionEntry]),
      };
    }

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
    } else if (
      error.message?.includes("does not have any available rewards") ||
      error.message?.includes("does not have a complete reward")
    ) {
      throw error; // Re-throw validation errors as-is
    }

    throw new Error("Failed to redeem reward. Please try again.");
  }
};

/**
 * Updates the pinned status of a loyalty card for a customer
 * @param {string} cardId - The ID of the card to update
 * @param {boolean} isPinned - Whether the card should be pinned
 * @returns {Promise<Object>} The updated card document
 */
export const updateCardPinnedStatus = async (cardId, isPinned) => {
  try {
    const updateData = {
      isPinned: isPinned,
      lastStampDate: new Date().toISOString(),
    };

    const result = await databases.updateDocument(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      cardId,
      updateData
    );

    return result;
  } catch (error) {
    console.error("Error updating card pinned status:", error);

    if (
      error.message?.includes(
        "Document with the requested ID could not be found"
      )
    ) {
      throw new Error("Loyalty card not found. Please try again.");
    } else if (error.message?.includes("permission")) {
      throw new Error("You don't have permission to update this card.");
    }

    throw new Error("Failed to update card pin status. Please try again.");
  }
};

/**
 * Gets all pinned loyalty cards for a customer
 * @param {string} customerId - The customer ID
 * @returns {Promise<Array>} Array of pinned loyalty cards
 */
export const getPinnedLoyaltyCards = async (customerId) => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [
        Query.equal("customerId", customerId),
        Query.equal("isPinned", true),
        Query.equal("isActive", true),
        Query.orderDesc("lastStampDate"),
        Query.limit(100),
      ]
    );

    return result.documents;
  } catch (error) {
    console.error("Error fetching pinned loyalty cards:", error);
    throw error;
  }
};

// Helper: check for auth or scope errors
function isAuthError(error) {
  const msg = error.message?.toLowerCase();
  return (
    error.code === 401 ||
    msg?.includes("permission denied") ||
    msg?.includes("missing scope") ||
    msg?.includes("not authorized")
  );
}

// Helper: check for missing collection errors
function isNotFoundError(error) {
  return (
    error.code === 404 ||
    error.message
      ?.toLowerCase()
      .includes("collection with the requested id could not be found")
  );
}

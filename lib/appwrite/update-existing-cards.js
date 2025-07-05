/**
 * Update Existing Records Script
 *
 * This script updates all existing loyalty cards to have isPinned: false
 * Run this after adding the isPinned attribute to the collection
 */

import {
  DATABASE_ID,
  databases,
  LOYALTY_CARDS_COLLECTION_ID,
  Query,
} from "./client.js";

export const updateExistingCardsWithPinnedField = async () => {
  try {
    console.log("Fetching all loyalty cards to update...");

    // Fetch all documents
    const result = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [Query.limit(1000)] // Adjust limit as needed
    );

    console.log(`Found ${result.documents.length} cards to update`);

    // Update each document that doesn't have isPinned field
    const updatePromises = result.documents
      .filter((card) => card.isPinned === undefined)
      .map((card) =>
        databases.updateDocument(
          DATABASE_ID,
          LOYALTY_CARDS_COLLECTION_ID,
          card.$id,
          { isPinned: false }
        )
      );

    if (updatePromises.length === 0) {
      console.log("✅ All cards already have isPinned field");
      return;
    }

    await Promise.all(updatePromises);

    console.log(
      `✅ Updated ${updatePromises.length} cards with isPinned: false`
    );
  } catch (error) {
    console.error("❌ Error updating existing cards:", error);
    throw error;
  }
};

// Uncomment the line below to run the update
// updateExistingCardsWithPinnedField();

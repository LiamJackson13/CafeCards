/**
 * Appwrite Migration Functions
 *
 * Contains database migration functions for loyalty cards.
 */
import {
  DATABASE_ID,
  databases,
  LOYALTY_CARDS_COLLECTION_ID,
  Query,
} from "./client.js";

/**
 * Migrates all existing loyalty cards to the new reward system
 * This can be called from within the app to update legacy cards
 */
export const migrateLoyaltyCards = async () => {
  try {
    console.log("Starting loyalty card migration...");

    // Get all loyalty cards
    const cards = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [Query.limit(1000)] // Adjust if you have more than 1000 cards
    );

    console.log(`Found ${cards.documents.length} cards to migrate`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const card of cards.documents) {
      try {
        // Calculate new values
        const totalStamps = card.totalStamps || 0;
        const availableRewards = Math.floor(totalStamps / 10);
        const currentStamps = totalStamps % 10;

        // Only update if the card needs migration
        const needsMigration =
          card.availableRewards === undefined ||
          card.totalRedeemed === undefined ||
          card.currentStamps !== currentStamps;

        if (needsMigration) {
          const updateData = {
            currentStamps: currentStamps,
            availableRewards: availableRewards,
            totalRedeemed: card.totalRedeemed || 0,
          };

          await databases.updateDocument(
            DATABASE_ID,
            LOYALTY_CARDS_COLLECTION_ID,
            card.$id,
            updateData
          );

          console.log(
            `Migrated card ${card.$id}: ${totalStamps} total stamps -> ${availableRewards} rewards, ${currentStamps} current stamps`
          );
          migratedCount++;
        } else {
          console.log(`Card ${card.$id} already migrated, skipping`);
        }
      } catch (error) {
        console.error(`Error migrating card ${card.$id}:`, error);
        errorCount++;
      }
    }

    console.log(`Migration completed!`);
    console.log(`- Successfully migrated: ${migratedCount} cards`);
    console.log(`- Errors: ${errorCount} cards`);
    console.log(`- Total processed: ${cards.documents.length} cards`);

    return {
      success: true,
      migratedCount,
      errorCount,
      totalCount: cards.documents.length,
    };
  } catch (error) {
    console.error("Migration failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

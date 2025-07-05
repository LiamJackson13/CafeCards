/**
 * Migration Script for Loyalty Card Rewards System
 *
 * This script migrates existing loyalty cards to the new reward system
 * where rewards are properly tracked and can accumulate beyond 10 stamps.
 *
 * NEW FIELDS ADDED:
 * - availableRewards: Number of redeemable rewards (calculated from totalStamps)
 * - totalRedeemed: Total number of rewards ever redeemed
 * - currentStamps: Now represents progress towards next reward (0-9)
 *
 * OLD BEHAVIOR:
 * - currentStamps could go beyond 10 and rewards were lost
 *
 * NEW BEHAVIOR:
 * - availableRewards = Math.floor(totalStamps / 10)
 * - currentStamps = totalStamps % 10
 * - Rewards accumulate and persist until redeemed
 */

import {
  DATABASE_ID,
  databases,
  LOYALTY_CARDS_COLLECTION_ID,
  Query,
} from "./appwrite.js";

/**
 * Migrates all existing loyalty cards to the new reward system
 * This should be run once after updating the database schema
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

/**
 * Validates that all cards have been properly migrated
 */
export const validateMigration = async () => {
  try {
    const cards = await databases.listDocuments(
      DATABASE_ID,
      LOYALTY_CARDS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    let validCount = 0;
    let invalidCount = 0;
    const invalidCards = [];

    for (const card of cards.documents) {
      const totalStamps = card.totalStamps || 0;
      const expectedAvailableRewards = Math.floor(totalStamps / 10);
      const expectedCurrentStamps = totalStamps % 10;

      const isValid =
        card.availableRewards === expectedAvailableRewards &&
        card.currentStamps === expectedCurrentStamps &&
        card.totalRedeemed !== undefined;

      if (isValid) {
        validCount++;
      } else {
        invalidCount++;
        invalidCards.push({
          id: card.$id,
          customerName: card.customerName,
          totalStamps,
          currentStamps: card.currentStamps,
          availableRewards: card.availableRewards,
          expectedCurrentStamps,
          expectedAvailableRewards,
        });
      }
    }

    console.log(`Migration validation results:`);
    console.log(`- Valid cards: ${validCount}`);
    console.log(`- Invalid cards: ${invalidCount}`);

    if (invalidCards.length > 0) {
      console.log("Invalid cards:", invalidCards);
    }

    return {
      valid: invalidCount === 0,
      validCount,
      invalidCount,
      invalidCards,
    };
  } catch (error) {
    console.error("Validation failed:", error);
    return {
      valid: false,
      error: error.message,
    };
  }
};

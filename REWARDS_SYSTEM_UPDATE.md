# Rewards System Update

## Overview

The loyalty card system has been updated to properly handle rewards that accumulate beyond 10 stamps. Previously, if a customer had 11 or more stamps, they couldn't redeem rewards properly. Now, rewards are tracked separately and persist until redeemed.

## What Changed

### Database Schema Changes

The loyalty card collection now includes these new fields:

- `availableRewards` (integer) - Number of redeemable rewards currently available
- `totalRedeemed` (integer) - Total number of rewards ever redeemed
- `currentStamps` (integer) - Current progress towards next reward (0-9 stamps)

### Behavior Changes

#### Before (Broken)

- Customer gets 11 stamps → `currentStamps = 11`
- System checks: `11 % 10 !== 0` → No reward available ❌
- Customer loses their earned reward!

#### After (Fixed)

- Customer gets 11 stamps → `totalStamps = 11`
- System calculates: `availableRewards = Math.floor(11 / 10) = 1`
- System calculates: `currentStamps = 11 % 10 = 1`
- Customer can redeem 1 reward and has 1 stamp towards the next ✅

### Key Features

1. **Accumulated Rewards**: Rewards stack up and don't disappear
2. **Multiple Rewards**: Customers can have multiple rewards ready to redeem
3. **Proper Tracking**: Clear separation between progress and available rewards
4. **Flexible Redemption**: Rewards can be redeemed at any time

## UI Changes

### Customer Card View

- Shows `availableRewards` instead of calculated rewards
- Shows `totalRedeemed` for historical tracking
- "Redeem" button appears when `availableRewards > 0`
- Progress bar shows `currentStamps` out of 10

### Cafe Scanner

- Updated success messages show available rewards
- Redemption reduces `availableRewards` by 1
- Adding stamps properly calculates new rewards earned

## Database Migration

### Required Steps

1. **Add new fields to Appwrite collection**:

   ```
   - availableRewards (integer, default: 0)
   - totalRedeemed (integer, default: 0)
   ```

2. **Run migration script** (optional, for existing data):

   ```javascript
   import { migrateLoyaltyCards } from "./lib/migration.js";
   await migrateLoyaltyCards();
   ```

3. **Validate migration**:

   ```javascript
   import { validateMigration } from "./lib/migration.js";
   await validateMigration();
   ```

### Migration Script

The migration script automatically:

- Calculates `availableRewards` from existing `totalStamps`
- Updates `currentStamps` to proper progress value (0-9)
- Sets `totalRedeemed` to 0 for existing cards
- Preserves all existing data

## Migration Instructions

### Running the Migration

The app includes a temporary migration helper to update existing cards. Follow these steps:

1. **Update Appwrite Schema**:

   - Add `availableRewards` (integer, required, default: 0)
   - Add `totalRedeemed` (integer, required, default: 0)

2. **Run Migration in App**:

   - Open the app and navigate to **Cafe Settings**
   - Scroll down to find the "Database Migration Helper" section
   - Tap "Run Migration" to update all existing cards
   - Wait for the success message

3. **Verify Migration**:

   - The migration will show how many cards were updated
   - Check a few existing cards to ensure they have the new fields

4. **Remove Migration Helper**:
   - After migration is complete, remove the `MigrationHelper` import and component from `cafeSettings.jsx`
   - Delete the `components/debug/MigrationHelper.jsx` file

### Alternative: Manual Migration

If the in-app migration doesn't work, you can manually update cards in the Appwrite console:

1. Go to your Appwrite project dashboard
2. Navigate to the loyalty_cards collection
3. For each document that's missing the new fields, add:
   - `availableRewards`: Calculate as `Math.floor(totalStamps / 10)`
   - `totalRedeemed`: Set to `0` initially
   - `currentStamps`: Calculate as `totalStamps % 10`

### Troubleshooting

- **"Missing required attribute" errors**: Run the migration to add missing fields
- **App crashes**: Check that the schema has the new fields with correct types
- **Cards not updating**: Verify permissions and that the user can update documents

## Examples

### Example 1: Customer with 23 stamps

```
totalStamps: 23
availableRewards: Math.floor(23 / 10) = 2
currentStamps: 23 % 10 = 3
```

→ Customer has 2 rewards ready + 3 stamps towards next reward

### Example 2: After redeeming 1 reward

```
totalStamps: 23 (unchanged)
availableRewards: 2 - 1 = 1
currentStamps: 3 (unchanged)
totalRedeemed: 0 + 1 = 1
```

→ Customer has 1 reward left + 3 stamps towards next reward

### Example 3: Adding 8 more stamps

```
totalStamps: 23 + 8 = 31
availableRewards: Math.floor(31 / 10) = 3
currentStamps: 31 % 10 = 1
```

→ Customer now has 3 rewards ready + 1 stamp towards next reward

## Testing Scenarios

1. **New Customer**: Start with 0, add stamps, verify rewards appear at 10, 20, 30 stamps
2. **Existing Customer**: Verify migration correctly calculates rewards from total stamps
3. **Over 10 Stamps**: Add 15 stamps at once, verify customer gets 1 reward + 5 progress
4. **Multiple Redemptions**: Customer with 3 rewards should be able to redeem them one by one
5. **Mixed Operations**: Add stamps, redeem reward, add more stamps, verify all calculations

## Backward Compatibility

- Existing QR codes continue to work
- Old reward redemption QR codes include new `availableRewards` field
- Migration is optional - new logic works with or without migration
- UI gracefully handles missing fields with sensible defaults

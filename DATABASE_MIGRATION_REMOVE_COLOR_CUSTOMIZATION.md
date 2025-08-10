# Database Migration: Remove Color Customization

## Overview

This migration removes the ability for cafes to customize the background color and text color of their loyalty cards. All cards will now use standardized colors to ensure consistent branding and readability.

## Changes Made

### Theme-Based Color Values

- **Background Color**: Uses theme `uiBackground` (Light: `#DBCBB1`, Dark: `#3A332A`)
- **Text Color**: Uses theme `text` (Light: `#625F57`, Dark: `#F5F5F5`)

These colors are now handled by the app's theme system and automatically adapt to light/dark mode.

## Database Migration Steps

### 1. Update Existing Records (Optional)

Since the application now ignores the `backgroundColor` and `textColor` fields, you can optionally clean up the database by removing these fields from existing records:

```sql
-- For Appwrite Database (via Console or API)
-- Note: This is optional since the app ignores these fields

-- You can either:
-- 1. Leave the fields as-is (they will be ignored)
-- 2. Remove the fields from the collection schema
-- 3. Set all records to the standard values
```

### 2. Collection Schema Updates

#### Cafe Profiles Collection

Remove or deprecate the following attributes:

- `backgroundColor` (String)
- `textColor` (String)

#### Method 1: Remove Fields (Recommended)

1. Go to Appwrite Console
2. Navigate to Databases → Your Database → Cafe Profiles Collection
3. Go to Attributes tab
4. Delete the `backgroundColor` attribute
5. Delete the `textColor` attribute

#### Method 2: Mark as Deprecated (Safe Option)

If you want to keep the data for historical purposes:

1. Rename attributes to `backgroundColor_deprecated` and `textColor_deprecated`
2. Update any existing queries that might still reference these fields

### 3. Application Code Changes

The following changes have been made to the codebase:

#### Frontend Changes

- **cafeDesign.jsx**: Removed UI controls for background and text color customization
- **cafe-profiles.js**: Fixed values are now returned instead of stored values
- **CardItem.jsx**: Uses fixed colors instead of customizable ones
- **useCardsList.js**: Updated fallback designs to use fixed colors
- **cards/[id].jsx**: Updated fallback design to use fixed colors

#### Fixed Values Used

All card designs now use the theme system:

```javascript
// Colors are determined by the app's theme system
const dynamicTheme = {
  primary: cafeDesign.primaryColor, // Still customizable
  background: theme.background, // Theme-based
  text: theme.text, // Theme-based
  card: theme.uiBackground, // Theme-based
  // Other design options remain customizable
};
```

### 4. Testing Checklist

After migration, verify:

- [ ] Existing loyalty cards display with consistent background and text colors
- [ ] Cafe design settings page no longer shows background/text color options
- [ ] New cafe profiles are created with fixed color values
- [ ] Card rendering works correctly in both light and dark themes
- [ ] QR code modals and other card-related components use fixed colors

### 5. Rollback Plan

If you need to rollback these changes:

1. **Restore Database Fields**: Re-add `backgroundColor` and `textColor` attributes to the collection
2. **Restore Application Code**: Revert the code changes in the mentioned files
3. **Data Recovery**: If you removed the data, you'll need to restore from backups or ask cafes to reconfigure their colors

### 6. Communication Plan

#### For Cafe Owners

- Notify existing cafe owners that background and text color customization has been removed
- Explain that this change improves consistency and readability across the platform
- Emphasize that other customization options (primary color, stamp icons, etc.) remain available

#### Sample Notification

```
Dear Cafe Owner,

We've updated our loyalty card system to ensure consistent and accessible design across all cards. As part of this update, background and text colors are now standardized:

- Background: Cream (#FDF3E7)
- Text: Dark Brown (#3B2F2F)

You can still customize:
- Primary/accent colors
- Stamp icons and colors
- Cafe name and descriptions
- Reward descriptions

These changes improve readability and create a more cohesive experience for your customers.

Best regards,
The Cafe Cards Team
```

## Notes

- This migration maintains backward compatibility by ignoring the removed fields rather than breaking existing functionality
- The fixed colors were chosen to maintain good contrast ratios for accessibility
- Primary color customization remains available to allow brand identity expression
- All existing cards will automatically use the new standardized colors without requiring data migration

## Support

If you encounter any issues during this migration, please check:

1. Application logs for any error messages
2. Database connectivity and permissions
3. Frontend console for any JavaScript errors related to missing fields

For technical support, contact the development team with details about any specific errors encountered.

# Code Refactoring Plan

## Overview

This document outlines the refactoring plan to improve code organization, maintainability, and readability.

## Large Files to Refactor

### 1. `cafeCamera.jsx` (1091 lines)

**Extract to:**

- `components/camera/CameraView.jsx` - Core camera component
- `components/camera/ScanResults.jsx` - Scan results display
- `components/camera/ScanHistory.jsx` - History list component
- `components/camera/StampModal.jsx` - Stamp confirmation modal
- `components/camera/RedeemModal.jsx` - Reward redemption modal
- `lib/scanner.js` - QR parsing and validation logic
- `hooks/useCamera.js` - Camera state management
- `hooks/useScanner.js` - Scanner logic

### 2. `lib/appwrite.js` (793 lines)

**Split into:**

- `lib/appwrite/client.js` - Client configuration
- `lib/appwrite/auth.js` - Authentication functions
- `lib/appwrite/loyalty-cards.js` - Loyalty card operations
- `lib/appwrite/migration.js` - Migration functions
- `lib/appwrite/utils.js` - Helper utilities
- `lib/appwrite/index.js` - Main exports

### 3. `cards/[id].jsx` (751 lines)

**Extract to:**

- `components/cards/CardHeader.jsx` - Card header with customer info
- `components/cards/StampProgress.jsx` - Progress bar and stamps display
- `components/cards/RewardActions.jsx` - Redeem/action buttons
- `components/cards/ScanHistory.jsx` - History timeline
- `components/cards/CardStats.jsx` - Statistics display
- `hooks/useCardDetails.js` - Card data management

### 4. `cards.jsx` (515 lines)

**Extract to:**

- `components/cards/CardsList.jsx` - Main cards list
- `components/cards/CardItem.jsx` - Individual card item
- `components/cards/EmptyState.jsx` - Empty state component
- `components/cards/LoadingState.jsx` - Loading skeleton
- `hooks/useCardsList.js` - List state management

### 5. `profile.jsx` (425 lines)

**Extract to:**

- `components/profile/ProfileHeader.jsx` - User info and avatar
- `components/profile/SettingsSection.jsx` - Settings group
- `components/profile/StatsSection.jsx` - Statistics display
- Already extracted: `StatCard`, `ProfileOption`, `DebugToggle`, `PasswordModal`, `NameModal`

## Directory Structure Changes

### New Directories

```
components/
├── camera/
├── cards/
├── profile/ (existing)
├── auth/ (existing)
├── debug/ (existing)
├── ui/ (for general UI components)
└── forms/ (for form components)

lib/
├── appwrite/
├── utils/
└── constants/

hooks/
├── camera/
├── cards/
└── auth/
```

### Files to Clean Up/Remove

- `contexts/BooksContext.jsx` - Unused book context
- `hooks/useBooks.js` - Unused book hooks
- `hooks/useCafeUser.js` - Very small, can be merged
- `lib/migration.js` - Move to `lib/appwrite/migration.js`
- `components/debug/MigrationHelper.jsx` - Temporary, remove after migration

## Implementation Order

### Phase 1: Clean up unused files

1. Remove books-related files
2. Remove temporary migration helper
3. Consolidate small hooks

### Phase 2: Extract appwrite functions

1. Split `lib/appwrite.js` into modules
2. Update imports throughout the app

### Phase 3: Refactor large components

1. Start with `cafeCamera.jsx` (most complex)
2. Refactor `cards/[id].jsx`
3. Refactor `cards.jsx`
4. Polish `profile.jsx`

### Phase 4: Create reusable UI components

1. Form components
2. Loading states
3. Error states
4. Common layouts

## Benefits

- **Maintainability**: Smaller, focused files
- **Reusability**: Extract common components
- **Testing**: Easier to test individual components
- **Performance**: Better tree-shaking and code splitting
- **Developer Experience**: Easier to navigate and understand

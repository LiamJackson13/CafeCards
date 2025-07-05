# Error Handling Guide - "Document with the requested ID could not be found"

## What was causing the error?

The "Document with the requested ID could not be found" error was happening randomly because of several issues:

### 1. Real-time Updates for Deleted Documents

- When documents were deleted in Appwrite, the real-time subscription would still receive events
- The app would try to process these events for documents that no longer existed
- This caused crashes when trying to access properties of null/undefined documents

### 2. Insufficient Error Handling in Appwrite Functions

- The original Appwrite functions would throw errors immediately without graceful handling
- Missing documents would bubble up as crashes instead of being handled gracefully
- No validation for required fields (customerId, cafeUserId, etc.)

### 3. State Corruption from Invalid Documents

- Cards array could contain null, undefined, or incomplete documents
- Real-time updates could introduce invalid data into the state
- No validation was performed on documents before adding them to state

### 4. Real-time Subscription Failures

- If the real-time subscription failed to establish, it would fail silently
- No retry mechanism for failed subscriptions
- Subscription cleanup errors weren't handled properly

## How we fixed it:

### 1. Enhanced Real-time Update Handling

```javascript
// Added comprehensive validation
if (!response || !events || !Array.isArray(events)) {
  console.warn("Invalid response structure in real-time update:", response);
  return;
}

if (!payload || !payload.$id || !payload.customerId || !payload.cafeUserId) {
  console.warn("Invalid payload received in real-time update:", payload);
  return;
}
```

### 2. Improved Appwrite Function Error Handling

```javascript
// Instead of throwing immediately, we provide specific error messages
if (
  error.code === 404 ||
  error.message?.includes("Document with the requested ID could not be found")
) {
  throw new Error(
    `Loyalty card not found (ID: ${cardDocumentId}). It may have been deleted.`
  );
}
```

### 3. State Validation and Cleanup

```javascript
// Filter out invalid cards before setting state
const validCards = cardDocuments.filter((card) => {
  if (!card || !card.$id || !card.customerId || !card.cafeUserId) {
    console.warn("Found invalid card document:", card);
    return false;
  }
  return true;
});
```

### 4. Robust Subscription Management

```javascript
// Added retry logic for failed subscriptions
const setupSubscription = async () => {
  try {
    unsubscribe = client.subscribe(channel, handleRealtimeUpdate);
  } catch (error) {
    console.error("Failed to set up real-time subscription:", error);
    // Retry in 5 seconds
    setTimeout(() => setupSubscription(), 5000);
  }
};
```

## Debugging Tools Added:

### 1. Debug Function in CardsContext

You can now call `debugCards()` from the CardsContext to inspect the current state:

```javascript
const { debugCards } = useContext(CardsContext);
debugCards(); // Will log detailed information about all cards
```

### 2. Document Accessibility Checker

```javascript
import { isDocumentAccessible } from "../lib/appwrite";
const isAccessible = await isDocumentAccessible(documentId);
```

### 3. Card Validation Utility

```javascript
import { validateAndCleanCards } from "../lib/appwrite";
const cleanCards = await validateAndCleanCards(dirtyCards);
```

## How to prevent similar issues:

### 1. Always validate data before using it

```javascript
if (!document || !document.$id) {
  console.warn("Invalid document:", document);
  return;
}
```

### 2. Use try-catch blocks for all Appwrite operations

```javascript
try {
  const result = await databases.getDocument(db, collection, id);
  return result;
} catch (error) {
  if (error.code === 404) {
    return null; // Handle gracefully
  }
  throw error; // Re-throw unexpected errors
}
```

### 3. Implement defensive programming in real-time handlers

```javascript
const handleUpdate = (response) => {
  try {
    // Validate all fields before processing
    if (!response?.payload?.$id) return;

    // Process update...
  } catch (error) {
    console.error("Real-time update error:", error);
    // Don't crash the app
  }
};
```

### 4. Regular state cleanup

```javascript
// Periodically validate and clean up state
useEffect(() => {
  const cleanup = setInterval(async () => {
    const cleanCards = await validateAndCleanCards(cards);
    if (cleanCards.length !== cards.length) {
      setCards(cleanCards);
    }
  }, 60000); // Every minute

  return () => clearInterval(cleanup);
}, [cards]);
```

## Testing your fixes:

1. **Create and delete documents rapidly** - Test real-time handling
2. **Disconnect and reconnect network** - Test subscription resilience
3. **Use invalid document IDs** - Test error handling
4. **Call debugCards()** in console - Inspect state
5. **Check browser console** - Look for warnings about invalid documents

The app should now handle all these scenarios gracefully without crashing.

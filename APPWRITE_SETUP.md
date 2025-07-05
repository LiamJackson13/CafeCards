# Appwrite Database Setup for Loyalty Cards

## Creating the Loyalty Cards Collection

You need to create a new collection in your Appwrite console for storing loyalty card data.

### Steps:

1. Open your Appwrite console (https://cloud.appwrite.io)
2. Navigate to your project
3. Go to Databases → Your Database
4. Click "Create Collection"
5. Name it: `loyalty_cards`
6. Copy the generated Collection ID and replace `LOYALTY_CARDS_COLLECTION_ID` in `lib/appwrite.js`

### Required Attributes:

Create these attributes in the collection:

1. **customerId**

   - Type: String
   - Size: 255
   - Required: Yes
   - Array: No

2. **customerName**

   - Type: String
   - Size: 255
   - Required: Yes
   - Array: No

3. **customerEmail**

   - Type: String
   - Size: 255
   - Required: Yes
   - Array: No

4. **cardId**

   - Type: String
   - Size: 255
   - Required: Yes
   - Array: No

5. **currentStamps**

   - Type: Integer
   - Required: Yes
   - Array: No
   - Default: 0

6. **totalStamps**

   - Type: Integer
   - Required: Yes
   - Array: No
   - Default: 0

7. **issueDate**

   - Type: DateTime
   - Required: Yes
   - Array: No

8. **lastStampDate**

   - Type: DateTime
   - Required: Yes
   - Array: No

9. **cafeUserId**

   - Type: String
   - Size: 255
   - Required: Yes
   - Array: No

10. **isActive**

    - Type: Boolean
    - Required: Yes
    - Array: No
    - Default: true

11. **scanHistory**
    - Type: String (JSON)
    - Size: 65535
    - Required: No
    - Array: No

### Permissions:

**IMPORTANT**: You need to configure collection-level permissions to allow customers to read their own cards. Here's how:

#### Collection Permissions (in Appwrite Console):

1. **Create Documents**:

   - Add specific cafe user IDs (e.g., `user:68678aaa002cdc721bfa`)
   - Only cafe users should be able to create loyalty cards

2. **Read Documents**:

   - `Any authenticated user` OR
   - Add both cafe user IDs and customer user IDs individually

3. **Update Documents**:

   - Add specific cafe user IDs (e.g., `user:68678aaa002cdc721bfa`)
   - Only cafe users should be able to update stamps

4. **Delete Documents**:
   - Add specific cafe user IDs (e.g., `user:68678aaa002cdc721bfa`)
   - Only cafe users should be able to delete cards

#### Alternative Approach (Recommended):

If you want to use document-level permissions instead of collection-level:

1. Set collection permissions to:
   - **Create**: Add your cafe user ID (e.g., `user:68678aaa002cdc721bfa`)
   - **Read**: `Any authenticated user`
   - **Update**: `Any authenticated user`
   - **Delete**: `Any authenticated user`

This allows the app to set specific permissions on each document when created.

### Indexes:

Create these indexes for better query performance:

1. **customerId_index**

   - Type: Key
   - Attributes: customerId
   - Orders: ASC

2. **cafeUserId_index**

   - Type: Key
   - Attributes: cafeUserId
   - Orders: ASC

3. **customerEmail_index**
   - Type: Key
   - Attributes: customerEmail
   - Orders: ASC

### After Setup:

1. Update the `LOYALTY_CARDS_COLLECTION_ID` in `lib/appwrite.js` with your actual collection ID
2. Test the scanner functionality to ensure cards are being saved properly
3. Check the cards screen to see if loyalty cards are displaying correctly

## Current Implementation

The app now includes:

✅ **Scanner Integration**: When cafe users scan QR codes, loyalty cards are automatically created/updated in Appwrite

✅ **Cards Management**: The cards screen displays real loyalty cards from the database

✅ **Real-time Updates**: Cards context supports real-time updates when cards are modified

✅ **Role-based Display**: Different views for cafe users vs customers

✅ **Error Handling**: Proper error handling for database operations

## Next Steps

- Create the collection using the instructions above
- Update the collection ID in the code
- Test the scanning and card management functionality

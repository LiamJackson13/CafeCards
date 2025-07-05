# Custom Cafe Card Design Setup Guide

This guide walks you through setting up custom card designs for each cafe in your Cafe Cards app using Appwrite.

## Overview

The custom card design system allows each cafe to have:

- **Custom Colors**: Primary, secondary, background, and text colors
- **Custom Background Images**: Hero images displayed on cards
- **Custom Stamp Icons**: Unique stamp icons (⭐, ☕, 💎, etc.)
- **Custom Branding**: Logo, cafe name, and location
- **Card Styling**: Border radius, shadows, and other visual properties

## Step 1: Create the Cafe Profiles Collection

### 1.1 In Appwrite Console

1. **Go to your Appwrite Console**

   - Navigate to your project
   - Go to **Databases** → Select your database → **Collections**

2. **Create new collection**
   - Click **"Create Collection"**
   - **Collection ID**: `cafe_profiles` (save this for later)
   - **Name**: "Cafe Profiles"

### 1.2 Add Required Attributes

Create these attributes in the `cafe_profiles` collection:

#### Basic Information

1. **cafeUserId**

   - Type: String
   - Size: 255
   - Required: Yes
   - Array: No

2. **cafeName**

   - Type: String
   - Size: 255
   - Required: Yes
   - Array: No

3. **location**

   - Type: String
   - Size: 255
   - Required: No
   - Array: No

4. **description**
   - Type: String
   - Size: 1000
   - Required: No
   - Array: No

#### Design Colors

5. **primaryColor**

   - Type: String
   - Size: 10
   - Required: Yes
   - Array: No
   - Default: "#AA7C48"

6. **secondaryColor**

   - Type: String
   - Size: 10
   - Required: Yes
   - Array: No
   - Default: "#7B6F63"

7. **backgroundColor**

   - Type: String
   - Size: 10
   - Required: Yes
   - Array: No
   - Default: "#FDF3E7"

8. **textColor**
   - Type: String
   - Size: 10
   - Required: Yes
   - Array: No
   - Default: "#3B2F2F"

#### Images

9. **backgroundImageUrl**

   - Type: String
   - Size: 500
   - Required: No
   - Array: No

10. **backgroundImageOpacity**

    - Type: Float
    - Required: No
    - Array: No
    - Default: 0.1

11. **logoUrl**

    - Type: String
    - Size: 500
    - Required: No
    - Array: No

12. **logoSize**
    - Type: Integer
    - Required: No
    - Array: No
    - Default: 40

#### Stamp Icon

13. **stampIcon**

    - Type: String
    - Size: 10
    - Required: Yes
    - Array: No
    - Default: "⭐"

14. **stampIconColor**
    - Type: String
    - Size: 10
    - Required: Yes
    - Array: No
    - Default: "#FFD700"

#### Card Styling

15. **borderRadius**

    - Type: Integer
    - Required: No
    - Array: No
    - Default: 15

16. **borderWidth**

    - Type: Integer
    - Required: No
    - Array: No
    - Default: 0

17. **borderColor**

    - Type: String
    - Size: 10
    - Required: No
    - Array: No
    - Default: "#E0E0E0"

18. **shadowEnabled**

    - Type: Boolean
    - Required: No
    - Array: No
    - Default: true

#### Business Information

19. **contactEmail**

    - Type: String
    - Size: 255
    - Required: No
    - Array: No

20. **contactPhone**

    - Type: String
    - Size: 50
    - Required: No
    - Array: No

21. **website**

    - Type: String
    - Size: 255
    - Required: No
    - Array: No

22. **socialMedia**
    - Type: String (JSON object)
    - Size: 500
    - Required: No
    - Array: No

#### Card Settings

23. **maxStampsPerCard**

    - Type: Integer
    - Required: No
    - Array: No
    - Default: 10

24. **rewardDescription**
    - Type: String
    - Size: 100
    - Required: No
    - Array: No
    - Default: "Free Coffee"

#### Status Fields

25. **isActive**

    - Type: Boolean
    - Required: Yes
    - Array: No
    - Default: true

26. **createdAt**

    - Type: DateTime
    - Required: Yes
    - Array: No

27. **updatedAt**
    - Type: DateTime
    - Required: Yes
    - Array: No

### 1.3 Set Collection Permissions

Configure these permissions in the Appwrite Console:

#### Create Documents

- **Who can create**: Only cafe users
- Add specific cafe user IDs: `user:YOUR_CAFE_USER_ID`

#### Read Documents

- **Who can read**: Any authenticated user
- This allows customers to see cafe designs when viewing cards

#### Update Documents

- **Who can update**: Only the cafe owner
- Add specific cafe user IDs: `user:YOUR_CAFE_USER_ID`

#### Delete Documents

- **Who can delete**: Only the cafe owner
- Add specific cafe user IDs: `user:YOUR_CAFE_USER_ID`

### 1.4 Create Indexes

For better performance, create these indexes:

1. **cafeUserId_index**

   - Type: Key
   - Attributes: cafeUserId
   - Orders: ASC

2. **isActive_index**

   - Type: Key
   - Attributes: isActive
   - Orders: ASC

3. **cafeName_index**
   - Type: Key
   - Attributes: cafeName
   - Orders: ASC

## Step 2: Update Your App Configuration

### 2.1 Update Collection ID

In your app, update the collection ID in:
`lib/appwrite/cafe-profiles.js`

```javascript
// Replace this line:
export const CAFE_PROFILES_COLLECTION_ID = "YOUR_CAFE_PROFILES_COLLECTION_ID";

// With your actual collection ID:
export const CAFE_PROFILES_COLLECTION_ID = "your_actual_collection_id_here";
```

### 2.2 Update Client Configuration

Make sure your `lib/appwrite/client.js` exports the new collection ID:

```javascript
// Add this line:
export const CAFE_PROFILES_COLLECTION_ID = "your_actual_collection_id_here";
```

## Step 3: Set Up Image Storage (Optional)

For background images and logos, you'll need to set up image storage:

### 3.1 Create Storage Bucket

1. In Appwrite Console, go to **Storage**
2. Create a new bucket called "cafe-images"
3. Set appropriate permissions:
   - **Read**: Any authenticated user
   - **Create**: Cafe users only
   - **Update**: Cafe users only
   - **Delete**: Cafe users only

### 3.2 Configure File Limits

- **Maximum file size**: 5MB
- **Allowed file extensions**: jpg, jpeg, png, webp
- **Encryption**: Enabled
- **Antivirus**: Enabled

## Step 4: Test the Setup

### 4.1 Create a Test Cafe Profile

1. **Open your app as a cafe user**
2. **Navigate to the "Design" tab**
3. **Fill in the cafe information**:
   - Cafe Name: "Test Cafe"
   - Location: "Test Location"
   - Choose colors and stamp icon
4. **Save the settings**

### 4.2 Verify Card Appearance

1. **Create a test loyalty card** (scan a customer QR code)
2. **Check the Cards tab** - the card should show your custom design
3. **Open the card details** - should show custom colors and styling

### 4.3 Test Customer View

1. **Log in as a customer**
2. **View your loyalty cards**
3. **Verify custom design appears** for the test cafe

## Step 5: Customize Individual Cafes

Each cafe can now customize their cards by:

1. **Going to the Design tab** in the cafe app
2. **Choosing their brand colors**
3. **Selecting a stamp icon** that represents their business
4. **Adding their logo and background image**
5. **Setting their reward description** (e.g., "Free Coffee", "10% Off", "Free Pastry")
6. **Adjusting the number of stamps** required for a reward

## Common Design Examples

### Coffee Shop

- **Primary Color**: #8B4513 (Brown)
- **Secondary Color**: #D2691E (Chocolate)
- **Background**: #FFF8DC (Cornsilk)
- **Stamp Icon**: ☕
- **Reward**: "Free Coffee"

### Bakery

- **Primary Color**: #FFB6C1 (Light Pink)
- **Secondary Color**: #DDA0DD (Plum)
- **Background**: #FFF0F5 (Lavender Blush)
- **Stamp Icon**: 🥐
- **Reward**: "Free Pastry"

### Tea House

- **Primary Color**: #228B22 (Forest Green)
- **Secondary Color**: #9ACD32 (Yellow Green)
- **Background**: #F0FFF0 (Honeydew)
- **Stamp Icon**: 🍵
- **Reward**: "Free Tea"

### Ice Cream Shop

- **Primary Color**: #FF69B4 (Hot Pink)
- **Secondary Color**: #87CEEB (Sky Blue)
- **Background**: #F0F8FF (Alice Blue)
- **Stamp Icon**: 🍦
- **Reward**: "Free Scoop"

## Troubleshooting

### Cards Not Showing Custom Design

1. **Check collection ID** in `cafe-profiles.js`
2. **Verify permissions** are set correctly
3. **Ensure cafe profile exists** for the cafe user
4. **Check console for errors** during design loading

### Design Settings Not Saving

1. **Verify cafe user permissions** in the collection
2. **Check required fields** are filled (cafeName, primaryColor, etc.)
3. **Ensure user is authenticated** as a cafe user

### Images Not Displaying

1. **Check image URLs** are accessible
2. **Verify storage bucket permissions** if using Appwrite storage
3. **Ensure image URLs use HTTPS**

## Security Considerations

1. **Always validate user permissions** before allowing design changes
2. **Sanitize color values** to prevent injection attacks
3. **Limit image file sizes** to prevent storage abuse
4. **Use content delivery networks** for better image performance

## Performance Tips

1. **Cache cafe designs** locally when possible
2. **Preload designs** for frequently accessed cafes
3. **Optimize image sizes** for mobile displays
4. **Use progressive image loading** for backgrounds

## Next Steps

Once set up, you can extend the system with:

1. **Seasonal themes** - Allow cafes to change designs for holidays
2. **A/B testing** - Test different designs for engagement
3. **Analytics** - Track which designs perform best
4. **Templates** - Provide pre-made design templates
5. **Brand guidelines** - Enforce brand consistency across locations

---

**Need help?** Check the console logs for detailed error messages, and ensure all permissions are configured correctly in Appwrite.

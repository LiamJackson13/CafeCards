/**
 * Cafe Profiles Functions
 * Contains all cafe profile CRUD operations for handling the cafe design.
 */

import {
  account,
  CAFE_PROFILES_COLLECTION_ID,
  DATABASE_ID,
  databases,
  ID,
  Permission,
  Query,
  Role,
} from "./client.js"; // Consolidate imports

/**
 * Creates a new cafe profile with custom design settings
 * @param {Object} profileData - The cafe profile data
 * @param {string} cafeUserId - The ID of the cafe user
 * @returns {Promise<Object>} The created profile document
 */
export const createCafeProfile = async (profileData, cafeUserId) => {
  try {
    const profileDocument = {
      cafeUserId: cafeUserId,
      cafeName: profileData.cafeName,
      address: profileData.address || "",
      description: profileData.description || "",

      // Card Design Settings - Uses theme colors instead of custom values
      primaryColor: profileData.primaryColor || "#AA7C48",
      // backgroundColor and textColor are now handled by the theme system

      // Stamp Icon
      stampIcon: profileData.stampIcon || "⭐",
      stampIconColor: profileData.stampIconColor || "#FFD700",

      // Card Settings
      maxStampsPerCard: profileData.maxStampsPerCard || 10,
      rewardDescription: profileData.rewardDescription || "Free Coffee",

      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await databases.createDocument(
      DATABASE_ID,
      CAFE_PROFILES_COLLECTION_ID,
      ID.unique(),
      profileDocument,
      [
        Permission.read(Role.user(cafeUserId)),
        Permission.update(Role.user(cafeUserId)),
        Permission.delete(Role.user(cafeUserId)),
      ]
    );

    // Update the user's name in Appwrite Auth
    await account.updateName(profileData.cafeName);

    return result;
  } catch (error) {
    console.error("Error creating cafe profile:", error);
    throw error;
  }
};

/**
 * Gets cafe profile by cafe user ID
 * @param {string} cafeUserId - The ID of the cafe user
 * @returns {Promise<Object|null>} The cafe profile document or null
 */
export const getCafeProfile = async (cafeUserId) => {
  try {
    if (!cafeUserId) {
      console.warn("Cafe user ID is required for fetching cafe profile");
      return null;
    }

    // console.log(
    //   "Querying cafe profile with filter:",
    //   Query.equal("cafeUserId", cafeUserId)
    // );

    const result = await databases.listDocuments(
      DATABASE_ID,
      CAFE_PROFILES_COLLECTION_ID,
      [Query.equal("cafeUserId", cafeUserId)]
    );

    if (result.documents.length > 0) {
      const profile = result.documents[0];
      return profile;
    }

    return null;
  } catch (error) {
    console.error("Error fetching cafe profile:", error);

    if (error.code === 404) {
      console.warn("Cafe profile not found, returning null");
      return null;
    }

    throw error;
  }
};

/**
 * Updates an existing cafe profile
 * @param {string} profileId - The profile document ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} The updated profile document
 */
export const updateCafeProfile = async (profileId, updateData) => {
  try {
    if (!profileId) {
      throw new Error("Profile ID is required");
    }

    const updatedData = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const result = await databases.updateDocument(
      DATABASE_ID,
      CAFE_PROFILES_COLLECTION_ID,
      profileId,
      updatedData
    );

    return result;
  } catch (error) {
    console.error("Error updating cafe profile:", error);
    throw error;
  }
};

/**
 * Gets all active cafe profiles (for public directory)
 * @returns {Promise<Array>} Array of active cafe profiles
 */
export const getAllActiveCafeProfiles = async () => {
  try {
    const result = await databases.listDocuments(
      DATABASE_ID,
      CAFE_PROFILES_COLLECTION_ID,
      [Query.equal("isActive", true)]
    );

    return result.documents || [];
  } catch (error) {
    console.error("Error fetching active cafe profiles:", error);
    return [];
  }
};

/**
 * Deletes a cafe profile
 * @param {string} profileId - The profile document ID
 * @returns {Promise<void>}
 */
export const deleteCafeProfile = async (profileId) => {
  try {
    if (!profileId) {
      throw new Error("Profile ID is required");
    }

    await databases.deleteDocument(
      DATABASE_ID,
      CAFE_PROFILES_COLLECTION_ID,
      profileId
    );
  } catch (error) {
    console.error("Error deleting cafe profile:", error);
    throw error;
  }
};

/**
 * Gets cafe design data for a specific cafe user (for card styling)
 * @param {string} cafeUserId - The ID of the cafe user
 * @returns {Promise<Object>} Design configuration object
 */
export const getCafeDesign = async (cafeUserId) => {
  try {
    const profile = await getCafeProfile(cafeUserId);

    if (!profile) {
      // Return design using theme system for colors
      return {
        primaryColor: "#AA7C48",
        // backgroundColor and textColor are handled by theme system
        stampIcon: "⭐",
        stampIconColor: "#FFD700",
        borderRadius: 15,
        shadowEnabled: true,
        cafeName: "Local Cafe",
        rewardDescription: "Free Coffee",
        maxStampsPerCard: 10,
      };
    }

    return {
      primaryColor: profile.primaryColor,
      // backgroundColor and textColor are handled by theme system
      stampIcon: profile.stampIcon,
      stampIconColor: profile.stampIconColor,
      borderRadius: profile.borderRadius,
      borderWidth: profile.borderWidth,
      borderColor: profile.borderColor,
      shadowEnabled: profile.shadowEnabled,
      cafeName: profile.cafeName,
      address: profile.address,
      rewardDescription: profile.rewardDescription,
      maxStampsPerCard: profile.maxStampsPerCard,
    };
  } catch (error) {
    console.error("Error getting cafe design:", error);
    // Return design using theme system
    return {
      primaryColor: "#AA7C48",
      // backgroundColor and textColor are handled by theme system
      stampIcon: "⭐",
      stampIconColor: "#FFD700",
      cafeName: "Local Cafe",
      rewardDescription: "Free Coffee",
      maxStampsPerCard: 10,
    };
  }
};

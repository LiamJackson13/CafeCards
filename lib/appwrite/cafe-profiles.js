/**
 * Cafe Profiles Functions
 *
 * Contains all cafe profile CRUD operations for managing cafe design customizations.
 * Used for storing and retrieving cafe-specific branding and card design settings.
 */

import {
  DATABASE_ID,
  databases,
  ID,
  Permission,
  Query,
  Role,
} from "./client.js";

// Collection ID for cafe profiles (update as needed)
export const CAFE_PROFILES_COLLECTION_ID = "6868e4650032e76edb25";

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
      location: profileData.location || "",
      description: profileData.description || "",

      // Card Design Settings
      primaryColor: profileData.primaryColor || "#AA7C48",
      secondaryColor: profileData.secondaryColor || "#7B6F63",
      backgroundColor: profileData.backgroundColor || "#FDF3E7",
      textColor: profileData.textColor || "#3B2F2F",

      // Stamp Icon
      stampIcon: profileData.stampIcon || "⭐",
      stampIconColor: profileData.stampIconColor || "#FFD700",

      // Card Style
      borderRadius: profileData.borderRadius || 15,
      borderWidth: profileData.borderWidth || 0,
      borderColor: profileData.borderColor || "#E0E0E0",
      shadowEnabled: profileData.shadowEnabled !== false,

      // Business Info
      contactEmail: profileData.contactEmail || "",
      contactPhone: profileData.contactPhone || "",
      website: profileData.website || "",
      socialMedia: JSON.stringify(profileData.socialMedia || {}),

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

    const result = await databases.listDocuments(
      DATABASE_ID,
      CAFE_PROFILES_COLLECTION_ID,
      [Query.equal("cafeUserId", cafeUserId)]
    );

    if (result.documents.length > 0) {
      const profile = result.documents[0];
      // Parse socialMedia JSON string back to object
      if (profile.socialMedia && typeof profile.socialMedia === "string") {
        try {
          profile.socialMedia = JSON.parse(profile.socialMedia);
        } catch (_e) {
          console.warn("Failed to parse socialMedia JSON, using empty object");
          profile.socialMedia = {};
        }
      }
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
      // Return default design if no profile exists
      return {
        primaryColor: "#AA7C48",
        secondaryColor: "#7B6F63",
        backgroundColor: "#FDF3E7",
        textColor: "#3B2F2F",
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
      secondaryColor: profile.secondaryColor,
      backgroundColor: profile.backgroundColor,
      textColor: profile.textColor,
      stampIcon: profile.stampIcon,
      stampIconColor: profile.stampIconColor,
      borderRadius: profile.borderRadius,
      borderWidth: profile.borderWidth,
      borderColor: profile.borderColor,
      shadowEnabled: profile.shadowEnabled,
      cafeName: profile.cafeName,
      location: profile.location,
      rewardDescription: profile.rewardDescription,
      maxStampsPerCard: profile.maxStampsPerCard,
    };
  } catch (error) {
    console.error("Error getting cafe design:", error);
    // Return default design on error
    return {
      primaryColor: "#AA7C48",
      secondaryColor: "#7B6F63",
      backgroundColor: "#FDF3E7",
      textColor: "#3B2F2F",
      stampIcon: "⭐",
      stampIconColor: "#FFD700",
      borderRadius: 15,
      shadowEnabled: true,
      cafeName: "Local Cafe",
      rewardDescription: "Free Coffee",
      maxStampsPerCard: 10,
    };
  }
};

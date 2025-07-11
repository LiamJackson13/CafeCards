/**
 * Appwrite Storage Functions
 *
 * Handles file upload, deletion, and URL generation for profile pictures
 * and other media assets in the Cafe Cards app.
 */

import { ID, InputFile } from "react-native-appwrite";
import { BUCKET_PROFILE_PICTURES, storage } from "./client.js";

/**
 * Upload a profile picture to Appwrite storage
 * @param {string} uri - Local file URI
 * @param {string} fileName - File name with extension
 * @param {string} mimeType - MIME type of the file (optional, defaults to image/jpeg)
 * @returns {Promise<string>} - File ID of uploaded image
 */
export async function uploadProfilePicture(
  uri,
  fileName,
  mimeType = "image/jpeg"
) {
  try {
    console.log("Uploading profile picture:", {
      uri,
      fileName,
      bucketId: BUCKET_PROFILE_PICTURES,
    });

    // Check if bucket ID is defined
    if (!BUCKET_PROFILE_PICTURES) {
      throw new Error("Profile pictures bucket ID is not configured");
    }

    // Check if URI is valid
    if (!uri || typeof uri !== "string") {
      throw new Error("Invalid file URI provided");
    }

    // Create InputFile - try different methods based on the platform
    let file;
    const fileId = ID.unique();

    try {
      // Primary method: fromURI
      file = InputFile.fromURI(uri, fileName, mimeType);
      console.log("File created with fromURI:", file);
    } catch (uriError) {
      console.warn("fromURI failed, trying alternative:", uriError.message);

      try {
        // Alternative: fromPath
        file = InputFile.fromPath(uri, fileName, mimeType);
        console.log("File created with fromPath:", file);
      } catch (pathError) {
        console.warn("fromPath failed, trying blob method:", pathError.message);

        // Last resort: Create a blob-like object (for web compatibility)
        file = {
          name: fileName,
          type: mimeType,
          uri: uri,
          size: 0, // We don't know the size, but it might be required
        };
        console.log("File created as object:", file);
      }
    }

    console.log("Uploading with file ID:", fileId);

    const response = await storage.createFile(
      BUCKET_PROFILE_PICTURES,
      fileId,
      file
    );

    console.log("Upload response:", response);

    if (!response) {
      throw new Error("Upload response is null or undefined");
    }

    if (!response.$id) {
      console.error("Response object:", JSON.stringify(response, null, 2));
      throw new Error("Upload response is missing $id property");
    }

    return response.$id;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Bucket ID:", BUCKET_PROFILE_PICTURES);
    throw new Error(`Failed to upload profile picture: ${error.message}`);
  }
}

/**
 * Delete a profile picture from Appwrite storage
 * @param {string} fileId - File ID to delete
 */
export async function deleteProfilePicture(fileId) {
  try {
    await storage.deleteFile(BUCKET_PROFILE_PICTURES, fileId);
  } catch (error) {
    console.error("Error deleting profile picture:", error);
    throw new Error("Failed to delete profile picture");
  }
}

/**
 * Get the download URL for a profile picture
 * @param {string} fileId - File ID
 * @returns {string} - Download URL
 */
export function getProfilePictureUrl(fileId) {
  try {
    const urlResult = storage.getFileView(BUCKET_PROFILE_PICTURES, fileId);

    // Convert URL object to string if needed
    if (typeof urlResult === "object" && urlResult.href) {
      return urlResult.href;
    } else if (typeof urlResult === "string") {
      return urlResult;
    } else {
      console.error("Unexpected URL result type:", typeof urlResult, urlResult);
      return null;
    }
  } catch (error) {
    console.error("Error getting profile picture URL:", error);
    return null;
  }
}

/**
 * Get the preview URL for a profile picture (optimized for display)
 * @param {string} fileId - File ID
 * @param {number} width - Desired width (optional)
 * @param {number} height - Desired height (optional)
 * @returns {string} - Preview URL
 */
export function getProfilePicturePreview(fileId, width = 200, height = 200) {
  try {
    const urlResult = storage.getFilePreview(
      BUCKET_PROFILE_PICTURES,
      fileId,
      width,
      height,
      "center",
      100,
      0,
      "ffffff",
      0,
      1,
      0,
      "ffffff"
    );

    // Convert URL object to string if needed
    if (typeof urlResult === "object" && urlResult.href) {
      return urlResult.href;
    } else if (typeof urlResult === "string") {
      return urlResult;
    } else {
      console.error(
        "Unexpected preview URL result type:",
        typeof urlResult,
        urlResult
      );
      return null;
    }
  } catch (error) {
    console.error("Error getting profile picture preview:", error);
    return null;
  }
}

/**
 * Test storage connection and bucket access
 * @returns {Promise<boolean>} - True if storage is accessible
 */
export async function testStorageAccess() {
  try {
    console.log("Testing storage access...");
    console.log("Bucket ID:", BUCKET_PROFILE_PICTURES);

    if (!BUCKET_PROFILE_PICTURES) {
      throw new Error("Profile pictures bucket ID is not configured");
    }

    // Try to list files in the bucket (this tests permissions)
    const result = await storage.listFiles(BUCKET_PROFILE_PICTURES);
    console.log("Storage access test successful:", result);
    return true;
  } catch (error) {
    console.error("Storage access test failed:", error);
    console.error("Error details:", error.message);
    return false;
  }
}

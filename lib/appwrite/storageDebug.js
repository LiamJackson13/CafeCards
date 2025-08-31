import { ID, Permission, Role } from "react-native-appwrite";
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

    // Create a blob-like object (for web compatibility)
    const file = {
      name: fileName,
      type: mimeType,
      uri: uri,
      size: 0, // We don't know the size, but it might be required
    };

    console.log("File created as object:", file);

    const fileId = ID.unique();
    console.log("Uploading with file ID:", fileId);

    const response = await storage.createFile(
      BUCKET_PROFILE_PICTURES,
      fileId,
      file,
      [Permission.read(Role.any())],
      []
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
export async function getProfilePictureUrl(fileId) {
  try {
    const urlResult = await storage.getFileView(
      BUCKET_PROFILE_PICTURES,
      fileId
    );
    if (Array.isArray(urlResult) && urlResult.length > 0) {
      if (typeof urlResult[0] === "object" && urlResult[0].href) {
        return urlResult[0].href;
      } else if (typeof urlResult[0] === "string") {
        return urlResult[0];
      }
    }
    if (typeof urlResult === "object" && urlResult.href) {
      return urlResult.href;
    } else if (typeof urlResult === "string") {
      return urlResult;
    } else {
      // console.error("Unexpected URL result type:", typeof urlResult, urlResult);
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
export async function getProfilePicturePreview(
  fileId,
  width = 200,
  height = 200
) {
  try {
    console.log("Fetching preview URL for file ID:", fileId);

    if (!fileId) {
      console.error("Invalid file ID provided:", fileId);
      return null;
    }

    // Verify if the file exists in the bucket
    const fileList = await storage.listFiles(BUCKET_PROFILE_PICTURES);
    const fileExists = fileList.files.some((file) => file.$id === fileId);

    if (!fileExists) {
      console.error("File ID does not exist in the bucket:", fileId);
      return null;
    }

    const urlResult = await storage.getFilePreview(
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

    console.log("Raw preview URL result:", urlResult);

    // Handle empty array or unexpected result (including array-like objects)
    if (
      urlResult &&
      typeof urlResult === "object" &&
      "length" in urlResult &&
      urlResult.length === 0
    ) {
      console.error(
        "Preview URL result is an empty array or array-like. File ID:",
        fileId
      );
      return null;
    }

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
    console.error("File ID:", fileId, "Bucket ID:", BUCKET_PROFILE_PICTURES);
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

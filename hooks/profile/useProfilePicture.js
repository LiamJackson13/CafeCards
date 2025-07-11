/**
 * Profile Picture Hook
 *
 * Provides functionality for managing user profile pictures including
 * image selection, upload, and removal.
 */

import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { testStorageAccess } from "../../lib/appwrite";
import { useUser } from "../useUser.js";

export function useProfilePicture() {
  const { updateProfilePicture, removeProfilePicture, getProfilePictureUrl } =
    useUser();

  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get current profile picture URL
  const profilePictureUrl = getProfilePictureUrl();

  /**
   * Request camera and media library permissions
   */
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Sorry, we need camera and photo library permissions to change your profile picture.",
          [{ text: "OK" }]
        );
        return false;
      }
    }
    return true;
  };

  /**
   * Show options for selecting profile picture
   */
  const showImagePicker = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setIsModalVisible(true);
  };

  /**
   * Take a photo with camera
   */
  const takePhoto = async () => {
    try {
      setIsModalVisible(false);
      setUploading(true);

      // Test storage access first
      console.log("Testing storage access before upload...");
      const storageAccessible = await testStorageAccess();
      if (!storageAccessible) {
        throw new Error(
          "Storage access failed. Please check your connection and try again."
        );
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageUri = asset.uri;
        const mimeType = asset.mimeType || "image/jpeg";

        console.log("Camera image URI:", imageUri);
        console.log("Image details:", asset);
        console.log("MIME type:", mimeType);

        await updateProfilePicture(imageUri);
        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert(
        "Error",
        `Failed to update profile picture: ${error.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  /**
   * Pick image from gallery
   */
  const pickImage = async () => {
    try {
      setIsModalVisible(false);
      setUploading(true);

      // Test storage access first
      console.log("Testing storage access before upload...");
      const storageAccessible = await testStorageAccess();
      if (!storageAccessible) {
        throw new Error(
          "Storage access failed. Please check your connection and try again."
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageUri = asset.uri;
        const mimeType = asset.mimeType || "image/jpeg";

        console.log("Selected image URI:", imageUri);
        console.log("Image details:", asset);
        console.log("MIME type:", mimeType);

        await updateProfilePicture(imageUri);
        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        `Failed to update profile picture: ${error.message}`
      );
    } finally {
      setUploading(false);
    }
  };

  /**
   * Remove current profile picture
   */
  const handleRemovePhoto = async () => {
    try {
      setIsModalVisible(false);
      setUploading(true);

      await removeProfilePicture();
      Alert.alert("Success", "Profile picture removed successfully!");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      Alert.alert(
        "Error",
        "Failed to remove profile picture. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  /**
   * Show confirmation dialog for removing profile picture
   */
  const confirmRemovePhoto = () => {
    Alert.alert(
      "Remove Profile Picture",
      "Are you sure you want to remove your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: handleRemovePhoto },
      ]
    );
  };

  return {
    profilePictureUrl,
    uploading,
    isModalVisible,
    setIsModalVisible,
    showImagePicker,
    takePhoto,
    pickImage,
    confirmRemovePhoto,
  };
}

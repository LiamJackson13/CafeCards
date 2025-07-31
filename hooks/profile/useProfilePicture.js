/**
 * Profile Picture Hook
 *
 * Provides functionality for managing user profile pictures including
 * image selection, upload, and removal.
 */

import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { useUser } from "../useUser.js";

export function useProfilePicture() {
  // Indicates initial loading state while fetching existing profile picture
  const [loading, setLoading] = useState(true);
  // Provides methods to update, remove, and retrieve the profile picture URL from user context
  const { updateProfilePicture, removeProfilePicture, getProfilePictureUrl } =
    useUser();

  // Flag for ongoing upload process (camera or gallery)
  const [uploading, setUploading] = useState(false);
  // Controls visibility of the modal offering camera/gallery options
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Local URI for the profile picture, either cached or remote
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  // On mount: fetch remote profile picture URL and cache it locally
  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount
    getProfilePictureUrl()
      .then(async (remoteUrl) => {
        if (!isMounted || !remoteUrl) return;
        try {
          // Download and cache the remote image to local filesystem
          const cachePath =
            FileSystem.cacheDirectory + `profile_${Date.now()}.jpg`;
          const { uri: localUri } = await FileSystem.downloadAsync(
            remoteUrl,
            cachePath,
            {
              headers: {
                // Provide Appwrite project header if required by backend
                "X-Appwrite-Project":
                  process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
              },
            }
          );
          if (isMounted) setProfilePictureUrl(localUri);
        } catch (err) {
          console.error("Error downloading profile picture:", err);
        }
      })
      .catch((err) =>
        console.error("Error fetching profile picture URL in hook:", err)
      )
      .finally(() => {
        if (isMounted) setLoading(false); // Loading complete
      });
    return () => {
      isMounted = false;
    };
  }, [getProfilePictureUrl]);

  /**
   * Request necessary permissions for camera and media library access
   * Returns true if both permissions granted (or running on web), else false
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
        return false; // Abort if permissions denied
      }
    }
    return true; // Permissions OK or running on web
  };

  /**
   * Opens the modal to let user choose camera or gallery
   * First ensures proper permissions are in place
   */
  const showImagePicker = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;
    setIsModalVisible(true);
  };

  /**
   * Launch camera interface to take a photo:
   * - Hides modal, enters uploading state
   * - Launches camera with square crop and medium quality
   * - On success, uploads image and caches updated remote URL locally
   */
  const takePhoto = async () => {
    try {
      setIsModalVisible(false);
      setUploading(true);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square crop
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const imageUri = asset.uri;
        const mimeType = asset.mimeType || "image/jpeg";

        // Log details for debugging if needed
        console.log("Camera image URI:", imageUri);
        console.log("Image MIME type:", mimeType);

        // Upload to backend and get new remote URL
        const remoteUrl = await updateProfilePicture(imageUri);
        // Cache the new remote URL locally for immediate display
        if (remoteUrl) {
          try {
            const cachePath =
              FileSystem.cacheDirectory + `profile_${Date.now()}.jpg`;
            const { uri: localUri } = await FileSystem.downloadAsync(
              remoteUrl,
              cachePath
            );
            setProfilePictureUrl(localUri);
          } catch (err) {
            console.error("Error caching new profile picture:", err);
            // Fallback to direct remote URL
            setProfilePictureUrl(remoteUrl);
          }
        } else {
          console.warn(
            "No profile URL returned from update, using previous URL"
          );
        }
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
   * Launch gallery picker to select an existing image
   * Similar flow to takePhoto: hides modal, enters uploading, uploads and caches
   */
  const pickImage = async () => {
    try {
      setIsModalVisible(false);
      setUploading(true);

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
        console.log("Image MIME type:", mimeType);

        const remoteUrl = await updateProfilePicture(imageUri);
        if (remoteUrl) {
          try {
            const cachePath =
              FileSystem.cacheDirectory + `profile_${Date.now()}.jpg`;
            const { uri: localUri } = await FileSystem.downloadAsync(
              remoteUrl,
              cachePath
            );
            setProfilePictureUrl(localUri);
          } catch (err) {
            console.error("Error caching new profile picture:", err);
            setProfilePictureUrl(remoteUrl);
          }
        }
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
   * Remove the current profile picture:
   * - Calls backend removal
   * - Clears local state
   */
  const handleRemovePhoto = async () => {
    try {
      setIsModalVisible(false);
      setUploading(true);

      await removeProfilePicture();
      setProfilePictureUrl(null); // Clear local reference
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
   * Prompt the user to confirm removal of their profile picture
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
    loading,
    uploading,
    isModalVisible,
    setIsModalVisible,
    showImagePicker,
    takePhoto,
    pickImage,
    confirmRemovePhoto,
  };
}

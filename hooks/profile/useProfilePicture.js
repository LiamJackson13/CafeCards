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
  const [loading, setLoading] = useState(true); // loading initial image
  const { updateProfilePicture, removeProfilePicture, getProfilePictureUrl } =
    useUser();

  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // Local file URI for profile picture
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  // On mount: fetch remote URL and cache locally for Image
  useEffect(() => {
    let isMounted = true;
    getProfilePictureUrl()
      .then(async (remoteUrl) => {
        if (!isMounted || !remoteUrl) return;
        try {
          const cachePath =
            FileSystem.cacheDirectory + `profile_${Date.now()}.jpg`;
          const { uri: localUri } = await FileSystem.downloadAsync(
            remoteUrl,
            cachePath,
            {
              headers: {
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
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [getProfilePictureUrl]);

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

        const remoteUrl = await updateProfilePicture(imageUri);
        // Cache new image locally
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
        } else {
          console.warn("No profile URL returned, skipping cache");
          setProfilePictureUrl(remoteUrl);
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
   * Pick image from gallery
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
        console.log("Image details:", asset);
        console.log("MIME type:", mimeType);

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
        } else {
          console.warn("No profile URL returned, skipping cache");
          setProfilePictureUrl(remoteUrl);
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
   * Remove current profile picture
   */
  const handleRemovePhoto = async () => {
    try {
      setIsModalVisible(false);
      setUploading(true);

      await removeProfilePicture();
      setProfilePictureUrl(null);
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

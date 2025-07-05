/**
 * Camera Management Hook
 *
 * Handles camera permissions, state, and refresh logic with improved error recovery.
 */
import { useFocusEffect } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraKey, setCameraKey] = useState(0); // Force camera refresh
  const [isLoading, setIsLoading] = useState(true);
  const cameraReadyRef = useRef(false);
  const lastRefreshTime = useRef(0);
  const healthCheckActive = useRef(false);
  const healthCheckTimer = useRef(null);
  const refreshCount = useRef(0);
  const MAX_REFRESHES = 3; // Maximum number of health check refreshes

  // Request camera permissions
  useEffect(() => {
    const getCameraPermissions = async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
        setIsLoading(false);
      } catch (error) {
        console.error("Error requesting camera permissions:", error);
        setHasPermission(false);
        setIsLoading(false);
      }
    };

    getCameraPermissions();
  }, []);

  // Debounced refresh function to prevent excessive refreshes
  const debouncedRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 1000) {
      return; // Don't refresh more than once per second
    }
    lastRefreshTime.current = now;

    // Clear any existing health check
    if (healthCheckTimer.current) {
      clearTimeout(healthCheckTimer.current);
      healthCheckTimer.current = null;
    }
    healthCheckActive.current = false;

    setCameraReady(false);
    cameraReadyRef.current = false;
    setCameraKey((prev) => prev + 1);
  }, []);

  // Automatically refresh camera when component mounts
  useEffect(() => {
    if (hasPermission === true) {
      const initializeCamera = () => {
        setTimeout(debouncedRefresh, 300);
      };
      initializeCamera();
    }
  }, [hasPermission, debouncedRefresh]);

  // Refresh camera when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (hasPermission === true) {
        const timer = setTimeout(debouncedRefresh, 100);
        return () => clearTimeout(timer);
      }
    }, [hasPermission, debouncedRefresh])
  );

  // Handle app state changes to refresh camera
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active" && hasPermission === true) {
        setTimeout(debouncedRefresh, 200);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, [hasPermission, debouncedRefresh]);

  // Camera health check - only start if not already active and camera isn't ready
  useEffect(() => {
    if (hasPermission === true && !isLoading && !healthCheckActive.current) {
      console.log(
        `Camera: Starting health check... (attempt ${
          refreshCount.current + 1
        }/${MAX_REFRESHES})`
      );
      healthCheckActive.current = true;

      healthCheckTimer.current = setTimeout(() => {
        if (!cameraReadyRef.current) {
          refreshCount.current += 1;

          if (refreshCount.current >= MAX_REFRESHES) {
            console.error(
              `Camera health check failed ${MAX_REFRESHES} times - stopping automatic refreshes`
            );
            healthCheckActive.current = false;
            // Don't refresh anymore, let user manually refresh if needed
          } else {
            console.warn(
              `Camera health check failed - camera not ready after 8 seconds (attempt ${refreshCount.current}/${MAX_REFRESHES})`
            );
            healthCheckActive.current = false;
            debouncedRefresh();
          }
        } else {
          console.log("Camera health check passed - camera is ready");
          healthCheckActive.current = false;
          refreshCount.current = 0; // Reset count on success
        }
      }, 8000); // Increased timeout to 8 seconds

      return () => {
        if (healthCheckTimer.current) {
          clearTimeout(healthCheckTimer.current);
          healthCheckTimer.current = null;
        }
        healthCheckActive.current = false;
      };
    }
  }, [hasPermission, isLoading, debouncedRefresh]);

  // Periodic camera refresh to prevent long-term black screen issues (disabled for now)
  // This was causing issues, so commenting out until needed
  /*
  useEffect(() => {
    if (hasPermission === true && cameraReady) {
      const refreshInterval = setInterval(() => {
        console.log("Periodic camera refresh to prevent issues");
        debouncedRefresh();
      }, 300000); // Refresh every 5 minutes instead of 1 minute

      return () => clearInterval(refreshInterval);
    }
  }, [hasPermission, cameraReady, debouncedRefresh]);
  */

  const refreshCamera = useCallback(() => {
    refreshCount.current = 0; // Reset count on manual refresh
    debouncedRefresh();
  }, [debouncedRefresh]);

  const handleCameraReady = useCallback(() => {
    console.log("Camera: Camera ready callback triggered");
    setCameraReady(true);
    cameraReadyRef.current = true;
    setIsLoading(false);
    refreshCount.current = 0; // Reset count on successful camera ready

    // Clear health check when camera becomes ready
    if (healthCheckTimer.current) {
      clearTimeout(healthCheckTimer.current);
      healthCheckTimer.current = null;
    }
    healthCheckActive.current = false;
  }, []);

  return {
    hasPermission,
    cameraReady,
    cameraKey,
    isLoading,
    refreshCamera,
    handleCameraReady,
  };
};

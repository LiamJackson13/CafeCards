/**
 * useCamera
 *
 * Custom React hook for managing camera permissions, state, and refresh logic.
 * Handles permission requests, camera readiness, health checks, and automatic/manual refreshes.
 * Designed for use with Expo Camera and React Navigation.
 */

import { useFocusEffect } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null); // Camera permission state
  const [cameraReady, setCameraReady] = useState(false); // Camera ready state
  const [cameraKey, setCameraKey] = useState(0); // Used to force camera refresh
  const [isLoading, setIsLoading] = useState(true); // Loading state for camera
  const cameraReadyRef = useRef(false); // Ref to track camera ready status
  const lastRefreshTime = useRef(0); // Timestamp of last refresh
  const healthCheckActive = useRef(false); // Prevents multiple health checks
  const healthCheckTimer = useRef(null); // Timer for health check
  const refreshCount = useRef(0); // Number of health check refreshes
  const MAX_REFRESHES = 3; // Max health check attempts

  // Request camera permissions on mount
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

  // Debounced refresh to avoid excessive camera restarts
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

  // Refresh camera when permission is granted
  useEffect(() => {
    if (hasPermission === true) {
      setTimeout(debouncedRefresh, 300);
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

  // Refresh camera when app returns to foreground
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

  // Camera health check: auto-refresh if camera doesn't become ready
  useEffect(() => {
    if (hasPermission === true && !isLoading && !healthCheckActive.current) {
      healthCheckActive.current = true;

      healthCheckTimer.current = setTimeout(() => {
        if (!cameraReadyRef.current) {
          refreshCount.current += 1;

          if (refreshCount.current >= MAX_REFRESHES) {
            console.error(
              `Camera health check failed ${MAX_REFRESHES} times - stopping automatic refreshes`
            );
            healthCheckActive.current = false;
            // Stop auto-refresh, let user manually refresh if needed
          } else {
            console.warn(
              `Camera health check failed - camera not ready after 8 seconds (attempt ${refreshCount.current}/${MAX_REFRESHES})`
            );
            healthCheckActive.current = false;
            debouncedRefresh();
          }
        } else {
          healthCheckActive.current = false;
          refreshCount.current = 0; // Reset on success
        }
      }, 8000); // 8 second timeout

      return () => {
        if (healthCheckTimer.current) {
          clearTimeout(healthCheckTimer.current);
          healthCheckTimer.current = null;
        }
        healthCheckActive.current = false;
      };
    }
  }, [hasPermission, isLoading, debouncedRefresh]);

  // Manual camera refresh (resets health check count)
  const refreshCamera = useCallback(() => {
    refreshCount.current = 0;
    debouncedRefresh();
  }, [debouncedRefresh]);

  // Camera ready callback
  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
    cameraReadyRef.current = true;
    setIsLoading(false);
    refreshCount.current = 0;

    // Clear health check timer if camera becomes ready
    if (healthCheckTimer.current) {
      clearTimeout(healthCheckTimer.current);
      healthCheckTimer.current = null;
    }
    healthCheckActive.current = false;
  }, []);

  return {
    hasPermission, // Camera permission status
    cameraReady, // Camera ready state
    cameraKey, // Key to force camera re-mount
    isLoading, // Loading state
    refreshCamera, // Manual refresh function
    handleCameraReady, // Callback for camera ready event
  };
};

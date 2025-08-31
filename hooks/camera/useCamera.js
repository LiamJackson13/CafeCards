/**
 * useCamera
 *
 * Hook for managing camera permissions, state, and refresh logic.
 * Handles permission requests, camera readiness, health checks, and automatic/manual refreshes.
 */

import { useFocusEffect } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

export const useCamera = () => {
  // Camera state
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraKey, setCameraKey] = useState(0); // Used to force camera refresh
  const cameraReadyRef = useRef(false); // Ref to track camera ready status
  const lastRefreshTime = useRef(0); // Timestamp of last refresh
  const healthCheckActive = useRef(false);
  const healthCheckTimer = useRef(null);
  const refreshCount = useRef(0);
  const MAX_REFRESHES = 3;

  // Request camera permissions on component mount
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

  // Debounced camera refresh:
  // - Ensures at least 1 second between refreshes to avoid rapid remounts
  // - Clears any ongoing health check timers before forcing a new mount via cameraKey
  const debouncedRefresh = useCallback(() => {
    const now = Date.now();
    if (now - lastRefreshTime.current < 1000) {
      return; // Prevent refresh if called too soon
    }
    lastRefreshTime.current = now;

    // Clear existing health check timer
    if (healthCheckTimer.current) {
      clearTimeout(healthCheckTimer.current);
      healthCheckTimer.current = null;
    }
    healthCheckActive.current = false;

    // Reset camera readiness flags and bump the key to remount Camera component
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

  // Refresh camera when app returns to foreground:
  // - Listens to AppState changes, triggers a refresh if app becomes active
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

  // Camera health check:
  // - After each refresh or permission grant, waits up to 8 seconds for camera to become ready
  // - Retries up to MAX_REFRESHES times before giving up and requiring manual refresh
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
            // Auto-refresh stops; user must manually refresh
          } else {
            console.warn(
              `Camera health check failed - camera not ready after 8 seconds (attempt ${refreshCount.current}/${MAX_REFRESHES})`
            );
            healthCheckActive.current = false;
            debouncedRefresh();
          }
        } else {
          // Camera ready, reset counters and timers
          healthCheckActive.current = false;
          refreshCount.current = 0;
        }
      }, 8000); // Timeout duration in ms

      return () => {
        if (healthCheckTimer.current) {
          clearTimeout(healthCheckTimer.current);
          healthCheckTimer.current = null;
        }
        healthCheckActive.current = false;
      };
    }
  }, [hasPermission, isLoading, debouncedRefresh]);

  // Manual camera refresh:
  // - Resets health check attempt count and invokes debounced refresh
  const refreshCamera = useCallback(() => {
    refreshCount.current = 0;
    debouncedRefresh();
  }, [debouncedRefresh]);

  // Callback invoked when the Camera component signals it's ready:
  // - Updates ready states, stops loading, resets health checks, and clears timers
  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
    cameraReadyRef.current = true;
    setIsLoading(false);
    refreshCount.current = 0;

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

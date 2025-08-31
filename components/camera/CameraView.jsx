// Imports
import { CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

/**
 * CameraScanner
 */
const CameraScanner = ({
  // Props:
  hasPermission,
  cameraReady,
  setCameraReady,
  cameraKey, // cameraKey: unique key for remounting camera component
  onBarCodeScanned,
  scanned,
  showStampModal,
  isLoading,
  refreshCamera,
}) => {
  const [cameraError, setCameraError] = useState(false);

  // Reset error flag whenever cameraKey changes (new camera instance)
  useEffect(() => {
    setCameraError(false);
  }, [cameraKey]);

  // Handler: mark error state when camera fails to mount
  const handleCameraError = () => {
    setCameraError(true);
  };

  // Handler: retry camera initialization by clearing error and invoking refresh
  const handleRefresh = () => {
    setCameraError(false);
    refreshCamera?.();
  };

  // UI State: requesting permission or initial loading
  if (hasPermission === null || isLoading) {
    return (
      <ThemedView style={styles.scannerContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.centerText}>
            Requesting camera permission...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // UI State: permission denied error
  if (hasPermission === false) {
    return (
      <ThemedView style={styles.scannerContainer}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.centerText}>No access to camera</ThemedText>
          <ThemedText style={styles.subText}>
            Please enable camera permissions in Settings
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // UI State: camera component mounting error
  if (cameraError) {
    return (
      <ThemedView style={styles.scannerContainer}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.centerText}>Camera Error</ThemedText>
          <ThemedText style={styles.subText}>
            The camera encountered an issue
          </ThemedText>
          <ThemedButton onPress={handleRefresh} style={styles.refreshButton}>
            <ThemedText style={styles.refreshButtonText}>
              Retry Camera
            </ThemedText>
          </ThemedButton>
        </View>
      </ThemedView>
    );
  }

  // Main UI: camera preview with overlays for loading and scanning frame
  return (
    <View style={styles.scannerContainer}>
      <CameraView
        key={cameraKey}
        style={styles.camera}
        facing="back"
        onCameraReady={() => {
          setCameraReady();
          setCameraError(false);
        }}
        onBarcodeScanned={
          scanned || showStampModal
            ? () => {} // block scanning when modal is open or already scanned
            : onBarCodeScanned
        }
        onMountError={handleCameraError}
      />

      {/* Overlay loader until cameraReady */}
      {!cameraReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <ThemedText style={styles.loadingText}>Loading camera...</ThemedText>
        </View>
      )}

      {/* Scanning frame overlay when ready: corners highlight scan area */}
      {cameraReady && (
        <View style={styles.scanningFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Wrapper for camera and overlays with fixed height and rounded corners
  scannerContainer: {
    height: 300,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
  },
  // Camera preview takes full container
  camera: {
    flex: 1,
  },
  // Centered text styling for loading/error messages
  centerText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    padding: 20,
  },
  // Styling for scanning frame container positioning
  scanningFrame: {
    position: "absolute",
    top: "20%",
    left: "15%",
    width: "70%",
    height: "60%",
    backgroundColor: "transparent",
  },
  // Corner element styling for scanning frame outline
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#007AFF",
    borderWidth: 3,
  },
  // Top-left corner adjustments
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  // Top-right corner adjustments
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  // Bottom-left corner adjustments
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  // Bottom-right corner adjustments
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  // Loading container centering
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Subtext styling under centerText
  subText: {
    textAlign: "center",
    fontSize: 14,
    opacity: 0.7,
    marginHorizontal: 20,
  },
  // Overlay shown while camera is initializing
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // Text style for loading overlay
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  // Retry button styling in error state
  refreshButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  // Text for retry button
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default CameraScanner;

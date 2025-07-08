import { CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

/**
 * CameraScanner
 *
 * Handles camera permissions, loading, error states, and barcode scanning.
 * - Shows loading or error UI as needed.
 * - Displays a scanning frame overlay when camera is ready.
 * - Calls onBarCodeScanned when a barcode is detected (unless blocked).
 */
const CameraScanner = ({
  hasPermission,
  cameraReady,
  setCameraReady,
  cameraKey,
  onBarCodeScanned,
  scanned,
  showStampModal,
  isLoading,
  refreshCamera,
}) => {
  const [cameraError, setCameraError] = useState(false);

  // Reset error state when camera key changes
  useEffect(() => {
    setCameraError(false);
  }, [cameraKey]);

  // Handle camera mount error
  const handleCameraError = () => {
    setCameraError(true);
  };

  // Retry camera initialization
  const handleRefresh = () => {
    setCameraError(false);
    refreshCamera?.();
  };

  // Show loading indicator while requesting permission or loading
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

  // Show error if no camera permission
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

  // Show error UI if camera fails to load
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

  // Main camera view
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
            ? () => {} // Ignore scans if blocked
            : onBarCodeScanned
        }
        onMountError={handleCameraError}
      />

      {/* Loading overlay when camera is not ready */}
      {!cameraReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <ThemedText style={styles.loadingText}>Loading camera...</ThemedText>
        </View>
      )}

      {/* Scanning Frame Overlay */}
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
  scannerContainer: {
    height: 300,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  centerText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
    padding: 20,
  },
  scanningFrame: {
    position: "absolute",
    top: "20%",
    left: "15%",
    width: "70%",
    height: "60%",
    backgroundColor: "transparent",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#007AFF",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});

export default CameraScanner;

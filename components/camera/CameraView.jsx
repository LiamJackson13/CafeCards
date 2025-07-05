import { CameraView } from "expo-camera";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";
import ThemedView from "../ThemedView";

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
  const [showRefreshButton, setShowRefreshButton] = useState(false);

  // Show refresh button if camera doesn't load after 8 seconds
  useEffect(() => {
    if (hasPermission === true && !cameraReady) {
      const timer = setTimeout(() => {
        setShowRefreshButton(true);
      }, 8000);

      return () => clearTimeout(timer);
    } else {
      setShowRefreshButton(false);
    }
  }, [hasPermission, cameraReady, cameraKey]);

  // Reset error state when camera key changes
  useEffect(() => {
    setCameraError(false);
    setShowRefreshButton(false);
  }, [cameraKey]);

  const handleCameraError = () => {
    console.log("Camera error detected");
    setCameraError(true);
    setShowRefreshButton(true);
  };

  const handleRefresh = () => {
    setCameraError(false);
    setShowRefreshButton(false);
    refreshCamera?.();
  };

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

  return (
    <View style={styles.scannerContainer}>
      <CameraView
        key={cameraKey}
        style={styles.camera}
        facing="back"
        onCameraReady={() => {
          console.log("Camera: Camera ready");
          setCameraReady(); // Use the passed callback instead of direct state update
          setCameraError(false);
        }}
        onBarcodeScanned={
          scanned || showStampModal
            ? (scan) => {
                console.log("Scanner blocked - ignoring scan:", {
                  scanned,
                  showStampModal,
                });
              }
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

      {/* Scanning Frame */}
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
    top: "25%",
    left: "15%",
    width: "70%",
    height: "50%",
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

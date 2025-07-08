/**
 * Cafe Scanner Screen
 *
 * Allows cafe staff to scan customer QR codes to add stamps or redeem rewards.
 * Features:
 * - Camera QR scanning and manual entry fallback
 * - Stamp confirmation and redemption modals
 * - Recent scan history
 * - Access control (cafe users only)
 * - Themed, responsive layout
 */
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import CameraView from "../../components/camera/CameraView";
import ManualEntryModal from "../../components/camera/ManualEntryModal";
import RedemptionSuccessModal from "../../components/camera/RedemptionSuccessModal";
import ScanHistory from "../../components/camera/ScanHistory";
import StampModal from "../../components/camera/StampModal";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useCamera } from "../../hooks/camera/useCamera";
import { useScanner } from "../../hooks/camera/useScanner";
import { useCafeUser, useUser } from "../../hooks/useUser";

const CafeScannerScreen = () => {
  const { actualTheme } = useTheme();
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const theme = Colors[actualTheme] ?? Colors.light;

  // Camera logic
  const {
    hasPermission,
    cameraReady,
    cameraKey,
    isLoading,
    refreshCamera,
    handleCameraReady,
  } = useCamera();

  // Scanner logic
  const {
    scanned,
    scanHistory,
    isProcessing,
    showStampModal,
    pendingCustomer,
    stampsToAdd,
    showRedemptionSuccess,
    redeemedCustomer,
    isManualEntryVisible,
    manualCardId,
    handleBarCodeScanned,
    confirmStampAddition,
    cancelStampAddition,
    handleManualEntry,
    dismissRedemptionSuccess,
    setStampsToAdd,
    setIsManualEntryVisible,
    setManualCardId,
    resetScanner,
  } = useScanner(user, isCafeUser);

  // Refresh camera when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshCamera();
    }, [refreshCamera])
  );

  // Restrict access to cafe users only
  if (!isCafeUser) {
    return (
      <ThemedView style={styles.container} safe>
        <ThemedText type="title" style={styles.title}>
          Access Denied
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Only cafe staff can access the scanner
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safe>
      <ThemedText type="title" style={styles.title}>
        Loyalty Card Scanner
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Scan customer QR codes to add stamps or redeem rewards
      </ThemedText>

      <Spacer height={20} />

      <CameraView
        hasPermission={hasPermission}
        cameraReady={cameraReady}
        setCameraReady={handleCameraReady}
        cameraKey={cameraKey}
        onBarCodeScanned={handleBarCodeScanned}
        scanned={scanned}
        showStampModal={showStampModal}
        isLoading={isLoading}
        refreshCamera={refreshCamera}
      />

      <Spacer height={20} />

      <ThemedButton
        title="Manual Entry"
        onPress={() => setIsManualEntryVisible(true)}
        style={styles.manualButton}
        disabled={isProcessing}
      >
        <ThemedText style={styles.manualButtonText}>Manual Entry</ThemedText>
      </ThemedButton>

      <Spacer height={10} />

      <ThemedButton
        title="Reset Scanner"
        onPress={() => {
          resetScanner();
          refreshCamera();
        }}
        style={[styles.manualButton, styles.resetButton]}
        disabled={isProcessing}
      >
        <ThemedText style={styles.manualButtonText}>Reset Scanner</ThemedText>
      </ThemedButton>

      <Spacer height={20} />

      {scanHistory.length > 0 && (
        <>
          <ThemedText type="subtitle" style={styles.historyTitle}>
            Recent Scans
          </ThemedText>
          <Spacer height={10} />
          <ScanHistory scanHistory={scanHistory} theme={theme} />
        </>
      )}

      {/* Manual Entry Modal */}
      <ManualEntryModal
        visible={isManualEntryVisible}
        onClose={() => setIsManualEntryVisible(false)}
        cardId={manualCardId}
        setCardId={setManualCardId}
        onSubmit={handleManualEntry}
        isProcessing={isProcessing}
      />

      {/* Stamp Confirmation Modal */}
      <StampModal
        visible={showStampModal}
        onClose={cancelStampAddition}
        pendingCustomer={pendingCustomer}
        stampsToAdd={stampsToAdd}
        setStampsToAdd={setStampsToAdd}
        onConfirm={confirmStampAddition}
        isProcessing={isProcessing}
      />

      {/* Redemption Success Modal */}
      <RedemptionSuccessModal
        visible={showRedemptionSuccess}
        customer={redeemedCustomer}
        onDismiss={dismissRedemptionSuccess}
        theme={theme}
      />
    </ThemedView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    fontSize: 16,
  },
  manualButton: {
    backgroundColor: "#666",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  manualButtonText: {
    color: "#fff",
  },
  resetButton: {
    backgroundColor: "#ff6b6b",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});

export default CafeScannerScreen;

/**
 * Cafe Scanner Screen
 *
 * Allows cafe staff to scan customer QR codes to add stamps or redeem rewards.
 * Features:
 * - Camera QR scanning and manual entry fallback
 * - Stamp confirmation and redemption modals
 * - Recent scan history
 * - Access control (cafe users only)
 * - Themed layout
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
  // Theme/User Context: determine current theme and authenticated user
  const { actualTheme } = useTheme();
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const theme = Colors[actualTheme] ?? Colors.light;

  // Camera Hook: handles permissions, readiness, and camera key
  const {
    hasPermission,
    cameraReady,
    cameraKey,
    isLoading,
    refreshCamera,
    handleCameraReady,
  } = useCamera();

  // Scanner Hook: scanning logic, history, processing flags, and control handlers
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
  } = useScanner(user, isCafeUser);

  // Effect: refresh camera whenever this screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshCamera();
    }, [refreshCamera])
  );

  // Access Control: only allow cafe users to view scanner screen
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

  // Main UI rendering
  return (
    <ThemedView style={styles.container} safe>
      {/* Page Title */}
      <ThemedText type="title" style={styles.title}>
        Loyalty Card Scanner
      </ThemedText>
      {/* Instruction Subtitle */}
      <ThemedText style={styles.subtitle}>
        Scan customer QR codes to add stamps or redeem rewards
      </ThemedText>

      {/* Spacer before camera view */}
      <Spacer height={20} />

      {/* Camera Preview and Scanner Component */}
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

      {/* Spacer before manual entry button */}
      <Spacer height={20} />

      {/* Manual Entry Fallback Button */}
      <ThemedButton
        title="Manual Entry"
        onPress={() => setIsManualEntryVisible(true)}
        style={styles.manualButton}
        disabled={isProcessing}
      >
        <ThemedText style={styles.manualButtonText}>Manual Entry</ThemedText>
      </ThemedButton>

      {/* Spacer before scan history list */}
      <Spacer height={20} />

      {/* Recent Scans List */}
      {scanHistory.length > 0 && (
        <>
          <ThemedText type="subtitle" style={styles.historyTitle}>
            Recent Scans
          </ThemedText>
          <Spacer height={10} />
          <ScanHistory scanHistory={scanHistory} theme={theme} />
        </>
      )}

      {/* Manual Entry Modal: allows entering card ID manually */}
      <ManualEntryModal
        visible={isManualEntryVisible}
        onClose={() => setIsManualEntryVisible(false)}
        cardId={manualCardId}
        setCardId={setManualCardId}
        onSubmit={handleManualEntry}
        isProcessing={isProcessing}
      />

      {/* Stamp Confirmation Modal: confirm adding stamps to a customer */}
      <StampModal
        visible={showStampModal}
        onClose={cancelStampAddition}
        pendingCustomer={pendingCustomer}
        stampsToAdd={stampsToAdd}
        setStampsToAdd={setStampsToAdd}
        onConfirm={confirmStampAddition}
        isProcessing={isProcessing}
      />

      {/* Redemption Success Modal: show QR code for redeemed reward */}
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
  // Screen container: full flex layout with padding
  container: {
    flex: 1,
    padding: 20,
  },
  // Title text: centered heading at top of screen
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  // Subtitle text: descriptive subtitle under title
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    fontSize: 16,
  },
  // Manual entry button: fallback action button styling
  manualButton: {
    backgroundColor: "#666",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  // Manual entry button text: white text color
  manualButtonText: {
    color: "#fff",
  },
  // Reset button: styling for manual reset action
  resetButton: {
    backgroundColor: "#ff6b6b",
  },
  // History title: header text for recent scans list
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
});

export default CafeScannerScreen;

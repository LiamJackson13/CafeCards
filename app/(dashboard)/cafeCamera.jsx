import { useFocusEffect } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  AppState,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useCafeUser } from "../../hooks/useCafeUser";
import { useUser } from "../../hooks/useUser";
import {
  addStampToCard,
  createLoyaltyCard,
  findLoyaltyCardByCustomerId,
  redeemReward,
} from "../../lib/appwrite";

const CafeScannerScreen = () => {
  const { actualTheme } = useTheme();
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const theme = Colors[actualTheme] ?? Colors.light;

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isManualEntryVisible, setIsManualEntryVisible] = useState(false);
  const [manualCardId, setManualCardId] = useState("");
  const [scanHistory, setScanHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraKey, setCameraKey] = useState(0); // Force camera refresh

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  // Automatically refresh camera when component mounts
  useEffect(() => {
    const initializeCamera = async () => {
      // Small delay to ensure component is fully mounted
      setTimeout(() => {
        setCameraKey((prev) => prev + 1);
      }, 500);
    };

    initializeCamera();
  }, []); // Only run on mount

  // Refresh camera when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Refresh camera when navigating to this screen
      const timer = setTimeout(() => {
        setCameraKey((prev) => prev + 1);
      }, 200);

      return () => clearTimeout(timer);
    }, [])
  );

  // Handle app state changes to refresh camera
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        // Refresh camera when app becomes active
        setTimeout(() => {
          setCameraKey((prev) => prev + 1);
        }, 100);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, []);

  // Re-check permissions if camera is not ready after a delay
  useEffect(() => {
    if (hasPermission === true && !cameraReady) {
      const timer = setTimeout(async () => {
        const { status } = await Camera.getCameraPermissionsAsync();
        if (status !== "granted") {
          setHasPermission(false);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasPermission, cameraReady]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      await processCardScan(data);
    } catch (error) {
      console.error("Scan processing error:", error);
      Alert.alert("Error", "Failed to process card scan. Please try again.");
    } finally {
      setIsProcessing(false);
      // Allow scanning again after 2 seconds
      setTimeout(() => setScanned(false), 2000);
    }
  };

  const processCardScan = async (cardData) => {
    let customer;
    let isValidQRFormat = false;
    let isRedemptionQR = false;

    try {
      // Try to parse as JSON (new format)
      const parsedData = JSON.parse(cardData);

      if (
        parsedData.type === "loyalty_card" &&
        parsedData.app === "cafe-cards"
      ) {
        // New QR format from our app for adding stamps
        isValidQRFormat = true;
        customer = {
          id: parsedData.userId,
          name: parsedData.customerName,
          email: parsedData.email,
          cardId: parsedData.cardId,
          issueDate: parsedData.issueDate,
        };
      } else if (
        parsedData.type === "reward_redemption" &&
        parsedData.app === "cafe-cards"
      ) {
        // Redemption QR format
        isValidQRFormat = true;
        isRedemptionQR = true;
        customer = {
          id: parsedData.customerId,
          name: parsedData.customerName,
          email: parsedData.email,
          cardId: parsedData.cardId,
          currentStamps: parsedData.currentStamps,
        };
      } else {
        throw new Error("Invalid QR format");
      }
    } catch (_error) {
      // Fallback for old format or plain text
      customer = {
        id: "customer_" + Math.random().toString(36).substr(2, 9),
        name: "Unknown Customer",
        email: "unknown@example.com",
        cardId:
          cardData.length > 20 ? cardData.substring(0, 20) + "..." : cardData,
      };
    }

    try {
      // Only proceed with Appwrite operations for cafe users
      if (!isCafeUser) {
        Alert.alert(
          "Access Denied",
          "Only cafe staff can process loyalty cards."
        );
        return;
      }

      let loyaltyCard;
      let actionType = "stamp_added";

      if (isRedemptionQR) {
        // Handle reward redemption
        try {
          loyaltyCard = await redeemReward(customer.id, user.$id);
          actionType = "reward_redeemed";

          // Update customer data with actual stored values
          customer.currentStamps = loyaltyCard.currentStamps;
          customer.totalStamps = loyaltyCard.totalStamps;

          // Add to scan history
          const scanEntry = {
            id: Date.now().toString(),
            timestamp: new Date(),
            customer: customer,
            action: actionType,
            savedToDatabase: true,
          };

          setScanHistory((prev) => [scanEntry, ...prev.slice(0, 4)]);

          Alert.alert(
            "🎉 Reward Redeemed! 🎉",
            `Customer: ${customer.name}\nEmail: ${customer.email}\n\n✅ Free coffee reward has been redeemed!\nStamps reset to: ${loyaltyCard.currentStamps}`,
            [{ text: "OK" }]
          );

          return;
        } catch (error) {
          console.error("Redemption error:", error);
          Alert.alert(
            "Redemption Error",
            error.message || "Failed to redeem reward. Please try again.",
            [{ text: "OK" }]
          );
          return;
        }
      } else {
        // Handle stamp addition (existing logic)
        if (isValidQRFormat) {
          // For valid QR codes, try to find or create the card
          loyaltyCard = await findLoyaltyCardByCustomerId(customer.id);

          if (loyaltyCard) {
            // Update existing card by adding a stamp
            const updatedCard = await addStampToCard(customer.id, user.$id);
            loyaltyCard = updatedCard;
          } else {
            // Create new card with customer data from QR
            const cardData = {
              customerId: customer.id,
              customerName: customer.name,
              customerEmail: customer.email,
              cardId: customer.cardId,
              currentStamps: 1,
              totalStamps: 1,
              issueDate: customer.issueDate,
            };

            loyaltyCard = await createLoyaltyCard(cardData, user.$id);
          }
        } else {
          // For legacy/unknown format, create a basic entry
          const cardData = {
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            cardId: customer.cardId,
            currentStamps: 1,
            totalStamps: 1,
          };

          loyaltyCard = await createLoyaltyCard(cardData, user.$id);
        }

        // Update customer data with actual stored values
        customer.currentStamps = loyaltyCard.currentStamps;
        customer.totalStamps = loyaltyCard.totalStamps;

        // Add to scan history
        const scanEntry = {
          id: Date.now().toString(),
          timestamp: new Date(),
          customer: customer,
          action: actionType,
          savedToDatabase: true,
        };

        setScanHistory((prev) => [scanEntry, ...prev.slice(0, 4)]); // Keep last 5 scans

        // Show success feedback with actual data
        const stampsUntilReward = 10 - (loyaltyCard.currentStamps % 10);
        const isRewardEarned =
          loyaltyCard.currentStamps % 10 === 0 && loyaltyCard.currentStamps > 0;

        Alert.alert(
          isRewardEarned ? "🎉 Reward Earned! 🎉" : "Stamp Added! ✅",
          `Customer: ${customer.name}\nEmail: ${customer.email}\nStamps: ${
            loyaltyCard.currentStamps
          }${
            isRewardEarned
              ? "\n\n🎁 Customer has earned a free coffee!"
              : `\nNext reward in: ${stampsUntilReward} stamps`
          }\nCard: ${customer.cardId}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Database error:", error);

      // Still add to local scan history even if database fails
      const scanEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        customer: customer,
        action: isRedemptionQR ? "reward_redeemed" : "stamp_added",
        savedToDatabase: false,
        error: error.message,
      };

      setScanHistory((prev) => [scanEntry, ...prev.slice(0, 4)]);

      Alert.alert(
        "Database Error",
        `Failed to save card data to database: ${error.message}\n\nThe scan was recorded locally but may need to be synced later.`,
        [{ text: "OK" }]
      );
    }
  };

  const handleManualEntry = async () => {
    if (!manualCardId.trim()) {
      Alert.alert("Error", "Please enter a card ID");
      return;
    }

    setIsProcessing(true);
    try {
      await processCardScan(manualCardId);
      setManualCardId("");
      setIsManualEntryVisible(false);
    } catch (_error) {
      Alert.alert("Error", "Failed to process manual entry");
    } finally {
      setIsProcessing(false);
    }
  };

  const refreshCamera = async () => {
    setCameraReady(false);
    setCameraKey((prev) => prev + 1);

    // Re-check permissions
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleCameraReady = () => {
    setCameraReady(true);
  };

  const handleCameraError = (error) => {
    console.error("Camera error:", error);
    setCameraReady(false);
    Alert.alert(
      "Camera Error",
      "The camera encountered an issue. Try refreshing or use manual entry.",
      [
        { text: "Refresh Camera", onPress: refreshCamera },
        { text: "Manual Entry", onPress: () => setIsManualEntryVisible(true) },
      ]
    );
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container} safe>
        <ThemedText style={styles.centerText}>
          Requesting camera permission...
        </ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container} safe>
        <ThemedText style={styles.centerText}>No access to camera</ThemedText>
        <ThemedText style={styles.subtitle}>
          Please enable camera permissions in your device settings to use the
          scanner.
        </ThemedText>
        <Spacer size={20} />
        <View style={styles.actionButtons}>
          <ThemedButton
            title="Retry Camera"
            onPress={refreshCamera}
            style={[styles.actionButton, { backgroundColor: Colors.primary }]}
          />
          <ThemedButton
            title="Manual Entry"
            onPress={() => setIsManualEntryVisible(true)}
            style={[styles.actionButton, { backgroundColor: theme.iconColor }]}
          />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safe>
      <ThemedText type="title" style={styles.title}>
        Scan Customer Card
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Point camera at customer&apos;s QR code to add stamps or redeem rewards
        (supports QR, Code128, EAN, UPC, and more)
      </ThemedText>

      <Spacer size={20} />

      {/* Camera Scanner */}
      <View style={styles.scannerContainer}>
        <CameraView
          key={cameraKey} // Force refresh when cameraKey changes
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          onCameraReady={handleCameraReady}
          onCameraMountError={handleCameraError}
          barcodeScannerSettings={{
            barcodeTypes: [
              "qr",
              "pdf417",
              "aztec",
              "ean13",
              "ean8",
              "upc_e",
              "code128",
              "code39",
              "code93",
              "codabar",
              "datamatrix",
            ],
          }}
        />

        {/* Camera Not Ready Overlay */}
        {!cameraReady && (
          <View style={styles.cameraNotReadyOverlay}>
            <ThemedText style={styles.cameraNotReadyText}>
              Initializing Camera...
            </ThemedText>
          </View>
        )}

        {/* Scanning Frame Overlay */}
        <View style={styles.scanningFrame}>
          <View style={styles.corner} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        {/* Scanning Status Overlay */}
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ThemedText style={styles.processingText}>Processing...</ThemedText>
          </View>
        )}

        {scanned && !isProcessing && (
          <View style={styles.scannedOverlay}>
            <ThemedText style={styles.scannedText}>✅ Scanned!</ThemedText>
          </View>
        )}
      </View>

      <Spacer size={20} />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <ThemedButton
          title="Manual Entry"
          onPress={() => setIsManualEntryVisible(true)}
          style={[styles.actionButton, { backgroundColor: theme.iconColor }]}
        />
        <ThemedButton
          title="Refresh Camera"
          onPress={refreshCamera}
          style={[
            styles.actionButton,
            {
              backgroundColor: "#FF9500",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ThemedText style={{}}>Refresh</ThemedText>
        </ThemedButton>
        <ThemedButton
          title={scanned ? "Tap to Scan Again" : "Scanner Ready"}
          onPress={() => setScanned(false)}
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
          disabled={isProcessing}
        />
      </View>

      <Spacer size={20} />

      {/* Recent Scans */}
      {scanHistory.length > 0 && (
        <>
          <ThemedText type="subtitle" style={styles.historyTitle}>
            Recent Scans
          </ThemedText>
          <ScrollView style={styles.historyContainer}>
            {scanHistory.map((scan) => (
              <ThemedCard key={scan.id} style={styles.historyCard}>
                <View style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <ThemedText style={styles.customerName}>
                      {scan.customer.name}
                    </ThemedText>
                    <ThemedText style={styles.scanTime}>
                      {scan.timestamp.toLocaleTimeString()}
                    </ThemedText>
                  </View>
                  <View style={styles.historyRight}>
                    <ThemedText style={styles.stampCount}>
                      {scan.action === "reward_redeemed"
                        ? "🎁 Redeemed"
                        : `${scan.customer.currentStamps}/10 ⭐`}
                    </ThemedText>
                  </View>
                </View>
              </ThemedCard>
            ))}
          </ScrollView>
        </>
      )}
      <Modal
        visible={isManualEntryVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsManualEntryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedCard style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Manual Card Entry
            </ThemedText>

            <ThemedText style={styles.modalSubtitle}>
              Enter the customer&apos;s card ID or QR code data
            </ThemedText>

            <TextInput
              style={styles.textInput}
              value={manualCardId}
              onChangeText={setManualCardId}
              placeholder="Enter card ID..."
              placeholderTextColor="#999"
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <ThemedButton
                title="Cancel"
                onPress={() => {
                  setIsManualEntryVisible(false);
                  setManualCardId("");
                }}
                style={[styles.modalButton, styles.cancelButton]}
              />

              <ThemedButton
                title={isProcessing ? "Processing..." : "Add Stamp"}
                onPress={handleManualEntry}
                style={[styles.modalButton, styles.submitButton]}
                disabled={isProcessing || !manualCardId.trim()}
              />
            </View>
          </ThemedCard>
        </View>
      </Modal>
    </ThemedView>
  );
};

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
  centerText: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
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
    width: 20,
    height: 20,
    borderColor: "#fff",
    borderWidth: 3,
    borderTopLeftRadius: 5,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: "auto",
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: "auto",
    left: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: "auto",
    left: "auto",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 0,
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  scannedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(76, 175, 80, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannedText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  cameraNotReadyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraNotReadyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  historyContainer: {
    maxHeight: 200,
  },
  historyCard: {
    marginBottom: 8,
    padding: 12,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyLeft: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  scanTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  stampCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  manualButton: {
    marginTop: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    padding: 25,
    borderRadius: 15,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 20,
  },
  modalSubtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 20,
    fontSize: 14,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    color: "#333",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
});

export default CafeScannerScreen;

import Slider from "@react-native-community/slider";
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
  const [showStampModal, setShowStampModal] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState(null);
  const [stampsToAdd, setStampsToAdd] = useState(1);

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
    let isRedemptionQR = false;

    try {
      // Try to parse as JSON (new format)
      const parsedData = JSON.parse(cardData);

      if (
        parsedData.type === "loyalty_card" &&
        parsedData.app === "cafe-cards"
      ) {
        // New QR format from our app for adding stamps
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
        isRedemptionQR = true;
        customer = {
          id: parsedData.customerId,
          name: parsedData.customerName,
          email: parsedData.email,
          cardId: parsedData.cardId,
          currentStamps: parsedData.currentStamps,
          availableRewards: parsedData.availableRewards || 0,
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
        // Handle reward redemption immediately (no confirmation needed)
        try {
          loyaltyCard = await redeemReward(customer.id, user.$id);
          actionType = "reward_redeemed";

          // Update customer data with actual stored values
          customer.currentStamps = loyaltyCard.currentStamps;
          customer.totalStamps = loyaltyCard.totalStamps;
          customer.availableRewards = loyaltyCard.availableRewards || 0;
          customer.totalRedeemed = loyaltyCard.totalRedeemed || 0;

          // Add to scan history
          const scanEntry = {
            id: Date.now().toString(),
            timestamp: new Date(),
            customer: customer,
            action: actionType,
            savedToDatabase: true,
          };

          setScanHistory((prev) => [scanEntry, ...prev.slice(0, 4)]);

          // Generate message based on schema support
          const supportsNewRewards = loyaltyCard.availableRewards !== undefined;
          let redeemMessage;

          if (supportsNewRewards) {
            redeemMessage = `Customer: ${customer.name}\nEmail: ${customer.email}\n\n✅ Free coffee reward has been redeemed!\nRemaining rewards: ${loyaltyCard.availableRewards}\nCurrent progress: ${loyaltyCard.currentStamps}/10\nTotal redeemed: ${loyaltyCard.totalRedeemed}`;
          } else {
            redeemMessage = `Customer: ${customer.name}\nEmail: ${customer.email}\n\n✅ Free coffee reward has been redeemed!\nStamps reset to: ${loyaltyCard.currentStamps}`;
          }

          Alert.alert("🎉 Reward Redeemed! 🎉", redeemMessage, [
            { text: "OK" },
          ]);

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
        // For stamp addition, show confirmation modal
        setPendingCustomer(customer);
        setStampsToAdd(1);
        setShowStampModal(true);
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

  const confirmAddStamps = async () => {
    if (!pendingCustomer || !stampsToAdd || stampsToAdd < 1) {
      Alert.alert("Error", "Please enter a valid number of stamps to add");
      return;
    }

    const stampsCount = stampsToAdd;
    setIsProcessing(true);

    try {
      let loyaltyCard;
      const customer = pendingCustomer;

      // Find existing card or create new one
      loyaltyCard = await findLoyaltyCardByCustomerId(customer.id);

      if (loyaltyCard) {
        // Update existing card by adding multiple stamps
        for (let i = 0; i < stampsCount; i++) {
          loyaltyCard = await addStampToCard(customer.id, user.$id);
        }
      } else {
        // Create new card with specified stamps
        const newTotalStamps = stampsCount;

        // Calculate currentStamps and availableRewards based on total
        const availableRewards = Math.floor(newTotalStamps / 10);
        const currentStamps = newTotalStamps % 10;

        const cardData = {
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          cardId: customer.cardId,
          currentStamps: currentStamps,
          totalStamps: newTotalStamps,
          availableRewards: availableRewards,
          totalRedeemed: 0,
          issueDate: customer.issueDate,
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
        action: `${stampsCount}_stamps_added`,
        savedToDatabase: true,
        stampsAdded: stampsCount,
      };

      setScanHistory((prev) => [scanEntry, ...prev.slice(0, 4)]);

      // Close modal
      setShowStampModal(false);
      setPendingCustomer(null);
      setStampsToAdd("1");

      // Show success feedback
      const supportsNewRewards = loyaltyCard.availableRewards !== undefined;

      let successMessage;
      if (supportsNewRewards) {
        // New reward system
        const stampsUntilNextReward = 10 - loyaltyCard.currentStamps;
        const newRewardsEarned = loyaltyCard.availableRewards || 0;
        const previousRewards = Math.floor(
          (loyaltyCard.totalStamps - stampsCount) / 10
        );
        const earnedNewReward = newRewardsEarned > previousRewards;

        successMessage = `Customer: ${customer.name}\nEmail: ${
          customer.email
        }\n\n${stampsCount} stamp${
          stampsCount > 1 ? "s" : ""
        } added!\nTotal stamps: ${loyaltyCard.totalStamps}\nCurrent progress: ${
          loyaltyCard.currentStamps
        }/10${
          loyaltyCard.availableRewards > 0
            ? `\n\n🎁 Available rewards: ${loyaltyCard.availableRewards}`
            : ""
        }${
          earnedNewReward
            ? `\n✨ Customer earned ${
                newRewardsEarned - previousRewards
              } new reward${newRewardsEarned - previousRewards > 1 ? "s" : ""}!`
            : loyaltyCard.currentStamps === 0
            ? ""
            : `\nNext reward in: ${stampsUntilNextReward} stamps`
        }\nCard: ${customer.cardId}`;

        Alert.alert(
          earnedNewReward ? "🎉 Reward Earned! 🎉" : "Stamps Added! ✅",
          successMessage,
          [{ text: "OK" }]
        );
      } else {
        // Old reward system
        const rewardsEarned = Math.floor(loyaltyCard.currentStamps / 10);
        const stampsUntilReward = 10 - (loyaltyCard.currentStamps % 10);
        const earnedNewReward =
          rewardsEarned >
          Math.floor((loyaltyCard.currentStamps - stampsCount) / 10);

        successMessage = `Customer: ${customer.name}\nEmail: ${
          customer.email
        }\n\n${stampsCount} stamp${
          stampsCount > 1 ? "s" : ""
        } added!\nTotal stamps: ${loyaltyCard.currentStamps}${
          earnedNewReward
            ? "\n\n🎁 Customer has earned a free coffee!"
            : stampsUntilReward === 10
            ? ""
            : `\nNext reward in: ${stampsUntilReward} stamps`
        }\nCard: ${customer.cardId}`;

        Alert.alert(
          earnedNewReward ? "🎉 Reward Earned! 🎉" : "Stamps Added! ✅",
          successMessage,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error adding stamps:", error);

      // Still add to local scan history even if database fails
      const scanEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        customer: pendingCustomer,
        action: `${stampsCount}_stamps_added`,
        savedToDatabase: false,
        error: error.message,
        stampsAdded: stampsCount,
      };

      setScanHistory((prev) => [scanEntry, ...prev.slice(0, 4)]);

      Alert.alert(
        "Database Error",
        `Failed to save stamp data: ${error.message}\n\nThe scan was recorded locally but may need to be synced later.`,
        [{ text: "OK" }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelAddStamps = () => {
    setShowStampModal(false);
    setPendingCustomer(null);
    setStampsToAdd(1);
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
          >
            <ThemedText style={{ color: "#fff" }}>Retry Camera</ThemedText>
          </ThemedButton>
          <ThemedButton
            title="Manual Entry"
            onPress={() => setIsManualEntryVisible(true)}
            style={[styles.actionButton, { backgroundColor: theme.iconColor }]}
          >
            <ThemedText style={{ color: "#fff" }}>Manual Entry</ThemedText>
          </ThemedButton>
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
          onBarcodeScanned={
            scanned || showStampModal ? undefined : handleBarCodeScanned
          }
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
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.iconColor,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ThemedText style={{ color: "#fff" }}>Manual Entry</ThemedText>
        </ThemedButton>
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
          <ThemedText style={{ color: "#fff" }}>Refresh</ThemedText>
        </ThemedButton>
        <ThemedButton
          title={scanned ? "Tap to Scan Again" : "Scanner Ready"}
          onPress={() => setScanned(false)}
          style={[
            styles.actionButton,
            {
              backgroundColor: Colors.primary,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
          disabled={isProcessing}
        >
          <ThemedText style={{ color: "#fff" }}>
            {scanned ? "Scan Again" : "Scanner Ready"}
          </ThemedText>
        </ThemedButton>
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
                        : scan.action.includes("_stamps_added")
                        ? `+${scan.stampsAdded || 1} ⭐`
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
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <ThemedText style={{ color: "#fff" }}>Cancel</ThemedText>
              </ThemedButton>

              <ThemedButton
                title={isProcessing ? "Processing..." : "Add Stamp"}
                onPress={handleManualEntry}
                style={[
                  styles.modalButton,
                  styles.submitButton,
                  { justifyContent: "center", alignItems: "center" },
                ]}
                disabled={isProcessing || !manualCardId.trim()}
              >
                <ThemedText style={{ color: "#fff" }}>
                  {isProcessing ? "Processing..." : "Add Stamp"}
                </ThemedText>
              </ThemedButton>
            </View>
          </ThemedCard>
        </View>
      </Modal>

      {/* Stamp Confirmation Modal */}
      <Modal
        visible={showStampModal}
        animationType="slide"
        transparent={true}
        onRequestClose={cancelAddStamps}
      >
        <View style={styles.modalOverlay}>
          <ThemedCard style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Add Stamps
            </ThemedText>

            {pendingCustomer && (
              <>
                <ThemedText style={styles.customerInfoText}>
                  Customer: {pendingCustomer.name}
                </ThemedText>
                <ThemedText style={styles.customerEmailText}>
                  {pendingCustomer.email}
                </ThemedText>
              </>
            )}

            <ThemedText style={styles.modalSubtitle}>
              How many stamps would you like to add?
            </ThemedText>

            <View style={styles.sliderContainer}>
              <ThemedText style={styles.stampCountLabel}>
                {stampsToAdd} stamp{stampsToAdd !== 1 ? "s" : ""}
              </ThemedText>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                value={stampsToAdd}
                onValueChange={(value) => setStampsToAdd(Math.round(value))}
                step={1}
                minimumTrackTintColor="#007AFF"
                maximumTrackTintColor="#E5E5E5"
                thumbStyle={styles.sliderThumb}
              />
              <View style={styles.sliderLabels}>
                <ThemedText style={styles.sliderLabel}>1</ThemedText>
                <ThemedText style={styles.sliderLabel}>10</ThemedText>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <ThemedButton
                title="Cancel"
                onPress={cancelAddStamps}
                style={[styles.modalButton, styles.cancelButton]}
                disabled={isProcessing}
              >
                <ThemedText style={{ color: "#fff" }}>Cancel</ThemedText>
              </ThemedButton>

              <ThemedButton
                title={
                  isProcessing
                    ? "Adding..."
                    : `Add ${stampsToAdd} Stamp${stampsToAdd !== 1 ? "s" : ""}`
                }
                onPress={confirmAddStamps}
                style={[styles.modalButton, styles.submitButton]}
                disabled={isProcessing || stampsToAdd < 1}
              >
                <ThemedText style={{ color: "#fff" }}>
                  {isProcessing
                    ? "Adding..."
                    : `Add ${stampsToAdd} Stamp${stampsToAdd !== 1 ? "s" : ""}`}
                </ThemedText>
              </ThemedButton>
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
  customerInfoText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  customerEmailText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 15,
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
  sliderContainer: {
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  stampCountLabel: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#007AFF",
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 10,
  },
  sliderThumb: {
    backgroundColor: "#007AFF",
    width: 24,
    height: 24,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  stampConfirmationContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  stampConfirmationText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
});

export default CafeScannerScreen;

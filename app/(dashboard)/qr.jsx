/**
 * QR Code Display Screen
 *
 * Shows the user's loyalty card QR code for scanning by cafe staff.
 * Features:
 * - Generates QR code with user/card data
 * - Themed QR code (dark/light)
 * - User info and card ID (copyable)
 * - Refresh QR code
 * - Instructions for use
 * - Responsive, modern UI
 */
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../hooks/useUser";

const QRDisplayScreen = () => {
  const { user } = useUser();
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;
  const [qrKey, setQrKey] = useState(0);
  const router = useRouter();

  const screenWidth = Dimensions.get("window").width;
  const qrSize = Math.min(screenWidth * 0.7, 300);

  // Generate loyalty card data for QR code
  const generateCardData = () => {
    const userId = user?.$id || `guest_${Date.now()}`;
    const cardData = {
      userId: userId,
      email: user?.email || "guest@example.com",
      cardId: `CARD_${userId.slice(-8)}`,
      type: "loyalty_card",
      customerName: user?.name || user?.email?.split("@")[0] || "Guest User",
      issueDate: new Date().toISOString().split("T")[0],
      version: "1.0",
      app: "cafe-cards",
    };
    return JSON.stringify(cardData);
  };

  const cardData = generateCardData();

  // Copy card ID to clipboard
  const copyCardId = async () => {
    const data = JSON.parse(cardData);
    try {
      await Clipboard.setStringAsync(data.cardId);
      Alert.alert("Copied!", `Card ID "${data.cardId}" copied to clipboard`);
    } catch (error) {
      console.error("Failed to copy:", error);
      Alert.alert("Copy Failed", "Unable to copy card ID to clipboard");
    }
  };

  // Refresh QR code
  const refreshQR = () => {
    setQrKey((prev) => prev + 1);
    Alert.alert("QR Code Refreshed", "Your QR code has been updated");
  };

  return (
    <ThemedView style={styles.container} safe>
      <ThemedText type="title" style={styles.heading}>
        Your Loyalty Card
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Show this QR code to cafe staff to earn stamps
      </ThemedText>

      <Spacer size={30} />

      {/* QR Code Card */}
      <ThemedCard style={styles.qrCard}>
        <View
          style={[
            styles.qrContainer,
            { backgroundColor: actualTheme === "dark" ? "#000" : "#fff" },
          ]}
        >
          <QRCode
            key={qrKey}
            value={cardData}
            size={qrSize}
            color={actualTheme === "dark" ? "#fff" : "#000"}
            backgroundColor={actualTheme === "dark" ? "#000" : "#fff"}
            logoSize={60}
            logoBackgroundColor="transparent"
            quietZone={10}
          />
        </View>

        <Spacer size={20} />

        {/* User Info */}
        <View style={styles.userInfo}>
          <ThemedText style={styles.userName}>
            {user?.name || user?.email?.split("@")[0] || "Guest User"}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {user?.email || "guest@example.com"}
          </ThemedText>
          <TouchableOpacity onPress={copyCardId} style={styles.cardIdContainer}>
            <ThemedText style={styles.cardIdLabel}>Card ID:</ThemedText>
            <ThemedText style={styles.cardId}>
              {JSON.parse(cardData).cardId}
            </ThemedText>
            <ThemedText style={styles.copyHint}>📋 Tap to copy</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.issueDate}>
            Issued: {JSON.parse(cardData).issueDate}
          </ThemedText>
        </View>
      </ThemedCard>

      <Spacer size={30} />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <ThemedButton
          onPress={refreshQR}
          style={[styles.actionButton, { backgroundColor: theme.iconColor }]}
        >
          <ThemedText style={styles.buttonText}>🔄 Refresh QR</ThemedText>
        </ThemedButton>

        <ThemedButton
          onPress={() => router.push("/cards")}
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
        >
          <ThemedText style={[styles.buttonText, { color: "#fff" }]}>
            View Cards
          </ThemedText>
        </ThemedButton>
      </View>

      <Spacer size={20} />

      {/* Instructions */}
      <ThemedCard style={styles.instructionsCard}>
        <ThemedText style={styles.instructionsTitle}>How to use:</ThemedText>
        <ThemedText style={styles.instructionText}>
          1. Show this QR code to cafe staff
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          2. They&apos;ll scan it to add stamps to your card
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          3. Collect stamps to earn rewards!
        </ThemedText>
      </ThemedCard>
    </ThemedView>
  );
};

export default QRDisplayScreen;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  qrCard: {
    padding: 30,
    alignItems: "center",
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qrContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  cardIdContainer: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 8,
  },
  cardIdLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  cardId: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  copyHint: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 4,
  },
  issueDate: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    maxWidth: 400,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  instructionsCard: {
    padding: 20,
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});

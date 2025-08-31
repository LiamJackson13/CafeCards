/**
 * QR Code Display Screen
 */

// imports
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
  // Import user and theme contexts
  const { user } = useUser();
  const { userTheme } = useTheme();

  const router = useRouter();

  const isDark = userTheme === "dark";

  // Dimensions: calculate QR code size (70% of width, max 300)
  const screenWidth = Dimensions.get("window").width;
  const qrSize = Math.min(screenWidth * 0.7, 300);

  // Palette helpers
  const accentGradient = isDark
    ? ["#5C3B1E", Colors.primary]
    : ["#DBCBB1", Colors.primary];
  const qrBg = isDark ? "#000" : "#fff";
  
  // Generate loyalty card data for QR code
  const generateCardData = () => {
    // Create JSON payload with user ID, email, card ID, name, and metadata
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
    // Parse cardData JSON and copy cardId string to clipboard with feedback
    const data = JSON.parse(cardData);
    try {
      await Clipboard.setStringAsync(data.cardId);
      Alert.alert("Copied!", `Card ID "${data.cardId}" copied to clipboard`);
    } catch (error) {
      console.error("Failed to copy:", error);
      Alert.alert("Copy Failed", "Unable to copy card ID to clipboard");
    }
  };

  return (
    <ThemedView style={styles.container} safe>
      {/* Header */}
      <View style={styles.headerWrap}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>☕ Loyalty QR</ThemedText>
        </View>
        <ThemedText type="title" style={styles.heading}>
          Your QR Code
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Show this to cafe staff to earn stamps
        </ThemedText>
      </View>

      <Spacer size={20} />

      {/* QR Code display card with modern gradient border */}
      <ThemedCard style={styles.qrCard}>
        <LinearGradient colors={accentGradient} style={styles.qrGradientBorder}>
          <View style={[styles.qrInner, { backgroundColor: qrBg }]}>
            <QRCode
              value={cardData}
              size={qrSize}
              color={isDark ? "#fff" : "#000"}
              backgroundColor={qrBg}
              logoSize={60}
              logoBackgroundColor="transparent"
              quietZone={10}
            />
          </View>
        </LinearGradient>

        <Spacer size={16} />

        {/* User Info */}
        <View style={styles.userInfo}>
          <ThemedText style={styles.userName}>
            {user?.name || user?.email?.split("@")[0] || "Guest User"}
          </ThemedText>
          <ThemedText style={styles.userEmail}>
            {user?.email || "guest@example.com"}
          </ThemedText>

          <TouchableOpacity onPress={copyCardId} style={styles.cardIdContainer}>
            <ThemedText style={styles.cardIdLabel}>Card ID</ThemedText>
            <ThemedText style={styles.cardId}>
              {JSON.parse(cardData).cardId}
            </ThemedText>
            <ThemedText style={styles.copyHint}>Tap to copy</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedCard>

      <Spacer size={12} />

      {/* Actions */}
      <View style={styles.actionButtons}>
        <ThemedButton
          onPress={() => router.push("/cards")}
          style={[styles.actionButton, { backgroundColor: Colors.primary }]}
        >
          <ThemedText style={[styles.buttonText, { color: "#fff" }]}>
            View Cards
          </ThemedText>
        </ThemedButton>
      </View>
    </ThemedView>
  );
};

export default QRDisplayScreen;

// Styles
const styles = StyleSheet.create({
  // Main container: centers content with padding
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  // Ambient background accents
  bgAccentTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    opacity: 0.9,
  },
  bgAccentBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 260,
    opacity: 1,
  },
  // Header area
  headerWrap: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(170,124,72,0.15)",
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  // Heading text style for main title
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  // Subtitle text under heading
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  // Style for QR code card container
  qrCard: {
    padding: 22,
    alignItems: "center",
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  // Modern gradient border around QR
  qrGradientBorder: {
    padding: 2,
    borderRadius: 18,
  },
  qrInner: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  // User info section styling beneath QR code
  userInfo: {
    alignItems: "center",
  },
  // User name text style
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  // User email text style
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  // Container for card ID display and copy hint
  cardIdContainer: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginBottom: 8,
  },
  // Label for card ID field
  cardIdLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  // Card ID text style (monospace)
  cardId: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  // Hint text for copying card ID
  copyHint: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 4,
  },
  // Container for action buttons row
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    maxWidth: 400,
  },
  // Individual action button styling
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(170,124,72,0.4)",
  },
  secondaryBtnText: {
    color: Colors.primary,
  },
  // Button text style for action buttons
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  // Instructions card wrapper style
  instructionsCard: {
    padding: 20,
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
  },
  // Title for instructions section
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  // Individual instruction text style
  instructionText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});

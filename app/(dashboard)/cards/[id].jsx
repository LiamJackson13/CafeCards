/**
 * Individual Loyalty Card Details Screen
 *
 * This screen displays detailed information for a specific loyalty card.
 * Features include:
 * - Dynamic routing based on card ID parameter
 * - Display of card progress, stamps, and customer info
 * - Scan history and activity log
 * - Role-based views (customer vs cafe owner)
 * - Add stamp functionality for cafe users
 * - Loading states while fetching card data
 * - Error handling for missing or invalid cards
 * - Themed card layout with action buttons
 */

import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Spacer from "../../../components/Spacer";
import ThemedButton from "../../../components/ThemedButton";
import ThemedCard from "../../../components/ThemedCard";
import ThemedLoader from "../../../components/ThemedLoader";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import { Colors } from "../../../constants/Colors";
import { CardsContext } from "../../../contexts/CardsContext";
import { useTheme } from "../../../contexts/ThemeContext";
import { useCafeUser } from "../../../hooks/useCafeUser";
import { useUser } from "../../../hooks/useUser";
import { addStampToCard, parseScanHistory } from "../../../lib/appwrite";

const CardDetails = () => {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingStamp, setAddingStamp] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);

  const { id } = useLocalSearchParams();
  const { fetchCardById } = useContext(CardsContext);
  const { actualTheme } = useTheme();
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const router = useRouter();

  const theme = Colors[actualTheme] ?? Colors.light;

  const handleAddStamp = async () => {
    if (!isCafeUser || !user) {
      Alert.alert("Error", "Only cafe staff can add stamps");
      return;
    }

    try {
      setAddingStamp(true);
      const updatedCard = await addStampToCard(card.customerId, user.$id);
      setCard(updatedCard);
      Alert.alert("Success", "Stamp added successfully!");
    } catch (error) {
      console.error("Error adding stamp:", error);
      Alert.alert("Error", error.message || "Failed to add stamp");
    } finally {
      setAddingStamp(false);
    }
  };

  useEffect(() => {
    async function loadCard() {
      try {
        console.log("Loading card with ID:", id);
        setLoading(true);
        const cardData = await fetchCardById(id);
        console.log("Received card data:", cardData);
        setCard(cardData);
      } catch (error) {
        console.error("Error loading card:", error);
        Alert.alert("Error", "Failed to load card details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadCard();
    }
  }, [id, fetchCardById]);

  // Format card data for display
  const formatCardData = (cardData) => {
    if (!cardData) return null;

    const scanHistory = parseScanHistory(cardData.scanHistory);

    // Check if this card uses new reward system
    const supportsNewRewards = "availableRewards" in cardData;

    if (supportsNewRewards) {
      // New system: use availableRewards field
      return {
        ...cardData,
        availableRewards: cardData.availableRewards || 0,
        totalRedeemed: cardData.totalRedeemed || 0,
        scanHistory,
        hasAvailableRewards: (cardData.availableRewards || 0) > 0,
        supportsNewRewards: true,
      };
    } else {
      // Old system: calculate rewards from currentStamps
      const rewardsEarned = Math.floor(cardData.currentStamps / 10);
      const currentProgress = cardData.currentStamps % 10;

      return {
        ...cardData,
        availableRewards: rewardsEarned,
        totalRedeemed: 0, // Unknown in old system
        currentStamps: currentProgress, // Override to show progress only
        scanHistory,
        hasAvailableRewards: rewardsEarned > 0,
        supportsNewRewards: false,
      };
    }
  };

  const formattedCard = formatCardData(card);

  // Generate QR code data for redemption
  const generateRedemptionQRData = () => {
    if (!card || !user) return "";

    return JSON.stringify({
      type: "reward_redemption",
      app: "cafe-cards",
      customerId: card.customerId,
      customerName: card.customerName,
      email: card.customerEmail,
      cardId: card.cardId,
      currentStamps: card.currentStamps,
      availableRewards: card.availableRewards || 0,
      timestamp: new Date().toISOString(),
    });
  };

  if (loading) {
    return (
      <ThemedView safe style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedLoader size="large" />
          <ThemedText style={styles.loadingText}>
            Loading card details...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!card || !formattedCard) {
    return (
      <ThemedView safe style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          <ThemedText style={styles.errorTitle}>Card Not Found</ThemedText>
          <ThemedText style={styles.errorMessage}>
            The loyalty card you&apos;re looking for could not be found.
          </ThemedText>
          <ThemedButton
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: theme.primary }]}
          >
            <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
          </ThemedButton>
        </View>
      </ThemedView>
    );
  }

  // Progress components
  const ProgressRing = ({ current, max, size = 120 }) => {
    return (
      <View style={[styles.progressRing, { width: size, height: size }]}>
        <View style={styles.progressContent}>
          <ThemedText style={styles.progressNumber}>{current}</ThemedText>
          <ThemedText style={styles.progressMax}>/ {max}</ThemedText>
          <ThemedText style={styles.progressLabel}>stamps</ThemedText>
        </View>
      </View>
    );
  };

  const StampGrid = ({ current, max }) => {
    return (
      <View style={styles.stampGrid}>
        {Array.from({ length: max }, (_, index) => (
          <View
            key={index}
            style={[
              styles.stampItem,
              {
                backgroundColor: index < current ? "#4CAF50" : "transparent",
                borderColor: index < current ? "#4CAF50" : theme.border,
              },
            ]}
          >
            {index < current && (
              <ThemedText style={styles.stampCheck}>✓</ThemedText>
            )}
          </View>
        ))}
      </View>
    );
  };

  const ScanHistoryItem = ({ scan, index }) => {
    const date = new Date(scan.timestamp);
    const timeAgo = getTimeAgo(date);

    return (
      <View style={styles.historyItem}>
        <View style={styles.historyIcon}>
          <ThemedText style={styles.historyIconText}>
            {scan.action === "stamp_added" ? "+" : "🎁"}
          </ThemedText>
        </View>
        <View style={styles.historyContent}>
          <ThemedText style={styles.historyAction}>
            {scan.action === "stamp_added" ? "Stamp Added" : "Reward Redeemed"}
          </ThemedText>
          <ThemedText style={styles.historyTime}>{timeAgo}</ThemedText>
        </View>
      </View>
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <ThemedCard style={styles.headerCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIcon}>
              <ThemedText style={styles.cardIconText}>
                {formattedCard.isComplete ? "🎉" : "☕"}
              </ThemedText>
            </View>
            <View style={styles.cardInfo}>
              <ThemedText style={styles.customerName}>
                {isCafeUser ? formattedCard.customerName : "Local Cafe"}
              </ThemedText>
              <ThemedText style={styles.customerEmail}>
                {isCafeUser ? formattedCard.customerEmail : "Your loyalty card"}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>

        <Spacer size={20} />

        {/* Progress Card */}
        <ThemedCard style={styles.progressCard}>
          <ThemedText style={styles.sectionTitle}>Current Progress</ThemedText>
          <Spacer size={20} />

          <View style={styles.progressSection}>
            <ProgressRing current={formattedCard.currentStamps} max={10} />
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {formattedCard.totalStamps}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Total Stamps</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {formattedCard.availableRewards}
                </ThemedText>
                <ThemedText style={styles.statLabel}>
                  Available Rewards
                </ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statNumber}>
                  {formattedCard.totalRedeemed}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Total Redeemed</ThemedText>
              </View>
            </View>
          </View>

          <Spacer size={20} />
          <StampGrid current={formattedCard.currentStamps} max={10} />

          {/* Customer Redeem Button */}
          {!isCafeUser && formattedCard.hasAvailableRewards && (
            <ThemedCard style={styles.actionsCard}>
              <ThemedText style={styles.sectionTitle}>
                {formattedCard.availableRewards > 1
                  ? "Rewards Ready!"
                  : "Reward Ready!"}
              </ThemedText>
              <ThemedText style={styles.rewardCount}>
                You have {formattedCard.availableRewards} free coffee
                {formattedCard.availableRewards > 1 ? "s" : ""} available!
              </ThemedText>
              <Spacer size={15} />
              <ThemedButton
                onPress={() => setShowRedeemModal(true)}
                style={[styles.redeemButton, { backgroundColor: "#4CAF50" }]}
              >
                <ThemedText style={styles.redeemButtonText}>
                  🎁 Redeem Free Coffee
                </ThemedText>
              </ThemedButton>
            </ThemedCard>
          )}
        </ThemedCard>

        <Spacer size={20} />

        {/* Actions */}
        {isCafeUser && (
          <ThemedCard style={styles.actionsCard}>
            <ThemedText style={styles.sectionTitle}>Actions</ThemedText>
            <Spacer size={15} />
            <ThemedButton
              onPress={handleAddStamp}
              disabled={addingStamp}
              style={[
                styles.addStampButton,
                { backgroundColor: theme.primary },
              ]}
            >
              <ThemedText style={styles.addStampText}>
                {addingStamp ? "Adding..." : "Add Stamp"}
              </ThemedText>
            </ThemedButton>
          </ThemedCard>
        )}

        {isCafeUser && <Spacer size={20} />}

        {/* Scan History */}
        <ThemedCard style={styles.historyCard}>
          <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
          <Spacer size={15} />

          {formattedCard.scanHistory.length > 0 ? (
            <View style={styles.historyList}>
              {formattedCard.scanHistory
                .slice(-5) // Show last 5 scans
                .reverse() // Show most recent first
                .map((scan, index) => (
                  <ScanHistoryItem key={index} scan={scan} index={index} />
                ))}
            </View>
          ) : (
            <View style={styles.emptyHistory}>
              <ThemedText style={styles.emptyHistoryText}>
                No activity yet
              </ThemedText>
            </View>
          )}
        </ThemedCard>

        <Spacer size={30} />
      </ScrollView>

      {/* Redemption QR Code Modal */}
      <Modal
        visible={showRedeemModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRedeemModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedCard style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>
              🎉 Redeem Your Free Coffee!
            </ThemedText>

            <ThemedText style={styles.modalSubtitle}>
              Show this QR code to the cafe staff to redeem one of your{" "}
              {formattedCard?.availableRewards || 1} available reward
              {(formattedCard?.availableRewards || 1) > 1 ? "s" : ""}
            </ThemedText>

            <View style={styles.qrContainer}>
              <QRCode
                value={generateRedemptionQRData()}
                size={200}
                color="#000"
                backgroundColor="#fff"
              />
            </View>

            <ThemedText style={styles.qrInstructions}>
              Have cafe staff scan this QR code with their scanner to complete
              redemption
            </ThemedText>

            <View style={styles.modalButtons}>
              <ThemedButton
                onPress={() => setShowRedeemModal(false)}
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
              >
                <ThemedText style={styles.modalButtonText}>Close</ThemedText>
              </ThemedButton>
            </View>
          </ThemedCard>
        </View>
      </Modal>
    </ThemedView>
  );
};

export default CardDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Header Card
  headerCard: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardIconText: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    opacity: 0.7,
  },

  // Progress Card
  progressCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressRing: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: "#E5E5E5",
    borderRadius: 60,
    backgroundColor: Colors.primary + "10",
  },
  progressContent: {
    alignItems: "center",
  },
  progressNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
  },
  progressMax: {
    fontSize: 16,
    opacity: 0.7,
  },
  progressLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  progressStats: {
    flex: 1,
    paddingLeft: 20,
    gap: 16,
  },
  statItem: {
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.primary + "05",
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },

  // Stamp Grid
  stampGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  stampItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stampCheck: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Reward Banner
  rewardBanner: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  rewardText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Actions
  actionsCard: {
    padding: 20,
  },
  addStampButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addStampText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rewardCount: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    fontWeight: "500",
  },

  // Redeem Button
  redeemButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
    maxWidth: 350,
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrInstructions: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 16,
  },
  modalButtons: {
    width: "100%",
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // History
  historyCard: {
    padding: 20,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyIconText: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  emptyHistory: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyHistoryText: {
    fontSize: 14,
    opacity: 0.6,
  },
});

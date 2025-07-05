/**
 * Individual Loyalty Card Details Screen (Refactored)
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
import { ScrollView, StyleSheet, View } from "react-native";
import Spacer from "../../../components/Spacer";
import ThemedButton from "../../../components/ThemedButton";
import ThemedLoader from "../../../components/ThemedLoader";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ActivityHistory from "../../../components/cards/ActivityHistory";
import CardActions from "../../../components/cards/CardActions";
import CardHeader from "../../../components/cards/CardHeader";
import QRCodeModal from "../../../components/cards/QRCodeModal";
import StampProgress from "../../../components/cards/StampProgress";
import { Colors } from "../../../constants/Colors";
import { useTheme } from "../../../contexts/ThemeContext";
import { useCardDetails } from "../../../hooks/cards/useCardDetails";
import { useCafeUser, useUser } from "../../../hooks/useUser";

const CardDetails = () => {
  const { id } = useLocalSearchParams();
  const { actualTheme } = useTheme();
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const router = useRouter();

  const theme = Colors[actualTheme] ?? Colors.light;

  const {
    formattedCard,
    loading,
    addingStamp,
    showRedeemModal,
    handleAddStamp,
    setShowRedeemModal,
    generateRedemptionQRData,
  } = useCardDetails(id, user, isCafeUser);

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

  if (!formattedCard) {
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

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <CardHeader formattedCard={formattedCard} isCafeUser={isCafeUser} />

        <Spacer height={20} />

        {/* Progress Card */}
        <StampProgress formattedCard={formattedCard} theme={theme} />

        <Spacer height={20} />

        {/* Actions */}
        <CardActions
          formattedCard={formattedCard}
          isCafeUser={isCafeUser}
          onRedeem={() => setShowRedeemModal(true)}
          onAddStamp={handleAddStamp}
          addingStamp={addingStamp}
          theme={theme}
        />

        {(isCafeUser || formattedCard.hasAvailableRewards) && <Spacer height={20} />}

        {/* Activity History */}
        <ActivityHistory scanHistory={formattedCard.scanHistory} />

        <Spacer height={30} />
      </ScrollView>

      {/* Redemption QR Code Modal */}
      <QRCodeModal
        visible={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        qrData={generateRedemptionQRData()}
        availableRewards={formattedCard.availableRewards}
        theme={theme}
      />
    </ThemedView>
  );
};

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
});

export default CardDetails;

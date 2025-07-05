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
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Spacer from "../../../components/Spacer";
import ThemedButton from "../../../components/ThemedButton";
import ThemedLoader from "../../../components/ThemedLoader";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ActivityHistory from "../../../components/cards/ActivityHistory";
import CardActions from "../../../components/cards/CardActions";
import CustomCardHeader from "../../../components/cards/CustomCardHeader";
import CustomStampProgress from "../../../components/cards/CustomStampProgress";
import QRCodeModal from "../../../components/cards/QRCodeModal";
import { Colors } from "../../../constants/Colors";
import { useTheme } from "../../../contexts/ThemeContext";
import { useCardDetails } from "../../../hooks/cards/useCardDetails";
import { useCafeUser, useUser } from "../../../hooks/useUser";
import { getCafeDesign } from "../../../lib/appwrite/cafe-profiles";

const CardDetails = () => {
  const { id } = useLocalSearchParams();
  const { actualTheme } = useTheme();
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const router = useRouter();

  const [cafeDesign, setCafeDesign] = useState(null);
  const [designLoading, setDesignLoading] = useState(true);

  const theme = Colors[actualTheme] ?? Colors.light;

  // Handle successful redemption by navigating to success page
  const handleRedemptionSuccess = useCallback(
    (rewardInfo) => {
      router.push({
        pathname: "/reward-success",
        params: {
          cafeName: rewardInfo?.cafeName || "your favorite cafe",
          rewardType: rewardInfo?.rewardType || "free coffee",
        },
      });
    },
    [router]
  );

  const {
    formattedCard,
    loading,
    addingStamp,
    showRedeemModal,
    handleAddStamp,
    setShowRedeemModal,
    generateRedemptionQRData,
  } = useCardDetails(id, user, isCafeUser, handleRedemptionSuccess);

  // Load cafe design when card is loaded
  useEffect(() => {
    const loadCafeDesign = async () => {
      if (!formattedCard?.cafeUserId) {
        setDesignLoading(false);
        return;
      }

      try {
        const design = await getCafeDesign(formattedCard.cafeUserId);
        setCafeDesign(design);
      } catch (error) {
        console.error("Error loading cafe design:", error);
        // Use default design
        setCafeDesign({
          primaryColor: "#AA7C48",
          secondaryColor: "#7B6F63",
          backgroundColor: "#FDF3E7",
          textColor: "#3B2F2F",
          borderRadius: 15,
          shadowEnabled: true,
        });
      } finally {
        setDesignLoading(false);
      }
    };

    loadCafeDesign();
  }, [formattedCard]);

  // Create dynamic theme based on cafe design and user's theme preference
  const dynamicTheme = cafeDesign
    ? {
        ...theme,
        primary: cafeDesign.primaryColor,
        secondary: cafeDesign.secondaryColor,
        background:
          actualTheme === "dark"
            ? "#1a1a1a" // Dark background
            : cafeDesign.backgroundColor, // Cafe's light background
        text:
          actualTheme === "dark"
            ? "#ffffff" // White text for dark mode
            : cafeDesign.textColor, // Cafe's text color for light mode
        card:
          actualTheme === "dark"
            ? "#2a2a2a" // Dark card background
            : cafeDesign.backgroundColor, // Cafe's card background for light mode
        border:
          actualTheme === "dark"
            ? cafeDesign.primaryColor + "40" // Subtle primary color border in dark mode
            : cafeDesign.borderColor || cafeDesign.secondaryColor,
        // Keep cafe's brand colors regardless of theme
        accent: cafeDesign.primaryColor,
        brandSecondary: cafeDesign.secondaryColor,
      }
    : theme;

  if (loading || designLoading) {
    return (
      <ThemedView
        safe
        style={[styles.container, { backgroundColor: dynamicTheme.background }]}
      >
        <View style={styles.loadingContainer}>
          <ThemedLoader size="large" />
          <ThemedText
            style={[styles.loadingText, { color: dynamicTheme.text }]}
          >
            Loading card details...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!formattedCard) {
    return (
      <ThemedView
        safe
        style={[styles.container, { backgroundColor: dynamicTheme.background }]}
      >
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
          <ThemedText style={[styles.errorTitle, { color: dynamicTheme.text }]}>
            Card Not Found
          </ThemedText>
          <ThemedText
            style={[styles.errorMessage, { color: dynamicTheme.text }]}
          >
            The loyalty card you&apos;re looking for could not be found.
          </ThemedText>
          <ThemedButton
            onPress={() => router.back()}
            style={[
              styles.backButton,
              { backgroundColor: dynamicTheme.primary },
            ]}
          >
            <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
          </ThemedButton>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: dynamicTheme.background }]}
      safe
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: dynamicTheme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View
          style={[
            styles.cardSection,
            {
              backgroundColor: dynamicTheme.card,
              borderRadius: cafeDesign?.borderRadius || 15,
              borderWidth: actualTheme === "dark" ? 1 : 0,
              borderColor:
                actualTheme === "dark" ? dynamicTheme.border : "transparent",
              shadowColor: cafeDesign?.shadowEnabled
                ? dynamicTheme.text
                : "transparent",
              shadowOpacity: actualTheme === "dark" ? 0.3 : 0.1,
            },
          ]}
        >
          <CustomCardHeader
            formattedCard={formattedCard}
            isCafeUser={isCafeUser}
            theme={dynamicTheme}
            cafeDesign={cafeDesign}
          />
        </View>

        <Spacer height={24} />

        {/* Progress Card */}
        <View
          style={[
            styles.cardSection,
            {
              backgroundColor: dynamicTheme.card,
              borderRadius: cafeDesign?.borderRadius || 15,
              borderWidth: actualTheme === "dark" ? 1 : 0,
              borderColor:
                actualTheme === "dark" ? dynamicTheme.border : "transparent",
              shadowColor: cafeDesign?.shadowEnabled
                ? dynamicTheme.text
                : "transparent",
              shadowOpacity: actualTheme === "dark" ? 0.3 : 0.1,
            },
          ]}
        >
          <CustomStampProgress
            formattedCard={formattedCard}
            theme={dynamicTheme}
            cafeDesign={cafeDesign}
          />
        </View>

        <Spacer height={24} />

        {/* Actions - Only show if cafe user or customer has available rewards */}
        {(isCafeUser || formattedCard.hasAvailableRewards) && (
          <View
            style={[
              styles.cardSection,
              {
                backgroundColor: dynamicTheme.card,
                borderRadius: cafeDesign?.borderRadius || 15,
                borderWidth: actualTheme === "dark" ? 1 : 0,
                borderColor:
                  actualTheme === "dark" ? dynamicTheme.border : "transparent",
                shadowColor: cafeDesign?.shadowEnabled
                  ? dynamicTheme.text
                  : "transparent",
                shadowOpacity: actualTheme === "dark" ? 0.3 : 0.1,
              },
            ]}
          >
            <CardActions
              formattedCard={formattedCard}
              isCafeUser={isCafeUser}
              onRedeem={() => setShowRedeemModal(true)}
              onAddStamp={handleAddStamp}
              addingStamp={addingStamp}
              theme={dynamicTheme}
            />
          </View>
        )}

        {(isCafeUser || formattedCard.hasAvailableRewards) && (
          <Spacer height={24} />
        )}

        {/* Activity History */}
        <View
          style={[
            styles.cardSection,
            {
              backgroundColor: dynamicTheme.card,
              borderRadius: cafeDesign?.borderRadius || 15,
              borderWidth: actualTheme === "dark" ? 1 : 0,
              borderColor:
                actualTheme === "dark" ? dynamicTheme.border : "transparent",
              shadowColor: cafeDesign?.shadowEnabled
                ? dynamicTheme.text
                : "transparent",
              shadowOpacity: actualTheme === "dark" ? 0.3 : 0.1,
            },
          ]}
        >
          <ActivityHistory
            scanHistory={formattedCard.scanHistory}
            theme={dynamicTheme}
          />
        </View>

        <Spacer height={40} />
      </ScrollView>

      {/* Redemption QR Code Modal */}
      <QRCodeModal
        visible={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        qrData={generateRedemptionQRData()}
        availableRewards={formattedCard.availableRewards}
        theme={dynamicTheme}
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
    paddingBottom: 40,
  },
  cardSection: {
    padding: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default CardDetails;

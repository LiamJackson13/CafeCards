/**
 * Card Specific Details Screen
 */

// Imports
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
import CustomCardHeader from "../../../components/cards/CardHeader";
import QRCodeModal from "../../../components/cards/QRCodeModal";
import CustomStampProgress from "../../../components/cards/StampProgress";
import { Colors } from "../../../constants/Colors";
import { useTheme } from "../../../contexts/ThemeContext";
import { useCardDetails } from "../../../hooks/cards/useCardDetails";
import { useCafeUser, useUser } from "../../../hooks/useUser";
import { getCafeDesign } from "../../../lib/appwrite/cafe-profiles";

/**
 * Helper to generate card section background style.
 */
const getCardSectionStyle = (dynamicTheme) => ({
  backgroundColor: dynamicTheme.card,
});

const CardDetails = () => {
  // Route param: get card ID from URL for fetching details
  const { id } = useLocalSearchParams();
  const { userTheme } = useTheme();
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const router = useRouter();

  // State to hold cafe design data and loading state
  const [cafeDesign, setCafeDesign] = useState(null);
  const [designLoading, setDesignLoading] = useState(true);

  const theme = Colors[userTheme] ?? Colors.light;

  /**
   * handleRedemptionSuccess: callback invoked after gift redemption
   * navigates to the reward-success screen with relevant params
   */
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
  ); // useCallback is used here to memoize the function, ensuring it is not recreated on every render. This prevents unnecessary re-renders or re-executions of hooks that depend on this function.

  // Hook: loads card details, provides data, loading flags, and action handlers
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
      } catch (_error) {
        // Fallback to theme-based design
        setCafeDesign({
          primaryColor: "#AA7C48",
          // backgroundColor and textColor are handled by theme system
          borderRadius: 15,
          shadowEnabled: true,
        });
      } finally {
        setDesignLoading(false);
      }
    };
    loadCafeDesign();
  }, [formattedCard]);

  // Add this useEffect to reset states when ID changes
  useEffect(() => {
    // Reset local state when card ID changes
    setCafeDesign(null);
    setDesignLoading(true);
  }, [id]); // Dependency on id will trigger reset

  // Merge cafe design with theme
  const dynamicTheme = cafeDesign
    ? {
        ...theme,
        primary: cafeDesign.primaryColor,
        background: theme.background,
        text: theme.text,
        card: theme.uiBackground, // Use theme's uiBackground for cards
        border: cafeDesign.primaryColor,
        accent: cafeDesign.primaryColor,
      }
    : theme;

  // Loading state
  if (
    loading ||
    designLoading ||
    !formattedCard?.id ||
    formattedCard?.id !== id
  ) {
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

  // Error state
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

  // Main card details UI
  return (
    <ThemedView
      style={[styles.container, { backgroundColor: dynamicTheme.background }]}
      safe
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          backgroundColor: dynamicTheme.background,
          padding: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View
          style={[
            styles.cardSection,
            getCardSectionStyle(dynamicTheme, cafeDesign, userTheme),
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
            getCardSectionStyle(dynamicTheme, cafeDesign, userTheme),
          ]}
        >
          <CustomStampProgress
            formattedCard={formattedCard}
            theme={dynamicTheme}
            cafeDesign={cafeDesign}
          />
        </View>

        <Spacer height={24} />

        {/* Actions */}
        {(isCafeUser || formattedCard.hasAvailableRewards) && (
          <>
            <View
              style={[
                styles.cardSection,
                getCardSectionStyle(dynamicTheme, cafeDesign, userTheme),
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
            <Spacer height={24} />
          </>
        )}

        {/* Activity History */}
        <View
          style={[
            styles.cardSection,
            getCardSectionStyle(dynamicTheme, cafeDesign, userTheme),
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

export default CardDetails;

// --- Styles ---
const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
  },
  // Scroll view for card details
  scrollView: {
    flex: 1,
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

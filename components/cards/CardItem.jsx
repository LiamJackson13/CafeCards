import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import { usePinnedCards } from "../../hooks/cards/usePinnedCards";
import { getCafeDesign } from "../../lib/appwrite/cafe-profiles";
import Spacer from "../Spacer";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";
import { ProgressBar } from "./ProgressIndicators";

/**
 * CustomCardItem
 *
 * Displays a loyalty card with custom cafe branding and reward logic.
 * - Shows dynamic design, progress, and reward status.
 * - Cafe users see customer info; customers see cafe info and pin option.
 */
const CustomCardItem = ({
  item,
  onPress,
  isCafeUser,
  theme,
  userTheme,
  onUpdate,
}) => {
  const [cafeDesign, setCafeDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updatingPinStatus, toggleCardPin } = usePinnedCards();

  // Load cafe design on mount or when cafeUserId changes
  useEffect(() => {
    const loadCafeDesign = async () => {
      try {
        const design = await getCafeDesign(item.cafeUserId);
        setCafeDesign(design);
      } catch (_error) {
        // Fallback to theme-based design if error
        setCafeDesign({
          primaryColor: "#AA7C48",
          // backgroundColor and textColor are handled by theme system
          stampIcon: "⭐",
          stampIconColor: "#FFD700",
          cafeName: "Local Cafe",
          rewardDescription: "Free Coffee",
          maxStampsPerCard: 10,
        });
      } finally {
        setLoading(false);
      }
    };
    loadCafeDesign();
  }, [item.cafeUserId]);

  if (loading || !cafeDesign) return null;

  // Ensure all design props have theme-based fallbacks
  const safeDesign = {
    primaryColor: cafeDesign.primaryColor || "#AA7C48",
    // backgroundColor and textColor are handled by theme system
    stampIcon: cafeDesign.stampIcon || "⭐",
    stampIconColor: cafeDesign.stampIconColor || "#FFD700",
    cafeName: cafeDesign.cafeName || "Local Cafe",
    address: cafeDesign.address || "123 Main St, Newport",
    rewardDescription: cafeDesign.rewardDescription || "Free Coffee",
    maxStampsPerCard: cafeDesign.maxStampsPerCard || 10,
  };

  const isComplete = item.stamps >= safeDesign.maxStampsPerCard;

  // Dynamic theme based on cafe design and app theme
  const dynamicTheme = {
    primary: safeDesign.primaryColor,
    background: theme.background,
    text: theme.text,
    card: theme.uiBackground, // Use theme's uiBackground for cards
    border: safeDesign.primaryColor,
  };

  // Card style with dynamic theming and fixed shadow
  const cardStyle = [
    styles.card,
    {
      backgroundColor: dynamicTheme.card,
      borderColor: dynamicTheme.border,
      borderWidth: 1,
      borderRadius: 15,
    },
  ];
  if (userTheme === "dark") {
    cardStyle.push({
      shadowColor: dynamicTheme.text,
      shadowOpacity: 0.3,
    });
  }

  // Card content: header, progress, stamps, rewards, and actions
  const CardContent = () => (
    <View style={styles.cardContent}>
      {/* Header: Icon, Info, Pin, Complete Badge */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <ThemedText
            style={[styles.cardIcon, { color: cafeDesign.stampIconColor }]}
          >
            {safeDesign.stampIcon}
          </ThemedText>
        </View>
        <View style={styles.cardInfo}>
          <ThemedText
            style={[styles.cafeName, { color: dynamicTheme.text }]}
            numberOfLines={1}
          >
            {isCafeUser
              ? item.customerName
              : safeDesign.cafeName || item.cafeName}
          </ThemedText>
          <ThemedText
            style={[styles.address, { color: dynamicTheme.text, opacity: 0.7 }]}
          >
            {isCafeUser
              ? item.customerEmail
              : safeDesign.address || item.address}
          </ThemedText>
        </View>
        {/* Pin Button for customers */}
        {!isCafeUser && (
          <TouchableOpacity
            onPress={() => toggleCardPin(item, onUpdate)}
            disabled={updatingPinStatus}
            style={[
              styles.pinButton,
              {
                backgroundColor: item.isPinned
                  ? dynamicTheme.primary
                  : "transparent",
                borderColor: dynamicTheme.primary,
              },
            ]}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.pinIcon,
                {
                  color: item.isPinned ? "#fff" : dynamicTheme.primary,
                  opacity: updatingPinStatus ? 0.5 : 1,
                },
              ]}
            >
              📌
            </ThemedText>
          </TouchableOpacity>
        )}
        {/* Complete badge for cafe users */}
        {isComplete && !item.isReady && (
          <View
            style={[
              styles.completeBadge,
              {
                backgroundColor: dynamicTheme.primary,
                shadowColor: dynamicTheme.primary,
              },
            ]}
          >
            <ThemedText style={styles.completeText}>✓</ThemedText>
          </View>
        )}
      </View>

      <Spacer height={10} />

      {/* Customer Reward Section - button if reward is available */}
      {!isCafeUser && item.isReady ? (
        <TouchableOpacity
          onPress={() => onPress(item.id, { redeem: true })}
          style={[
            styles.redeemButton,
            styles.customerRedeemButton,
            {
              backgroundColor: safeDesign.primaryColor,
              shadowColor: safeDesign.primaryColor,
              borderColor: safeDesign.primaryColor,
            },
          ]}
          activeOpacity={0.85}
        >
          <ThemedText
            style={[
              styles.redeemText,
              styles.customerRedeemText,
              { color: dynamicTheme.text }, // Use theme text color
            ]}
          >
            🎁 Reward available - Tap to view
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <>
          <ProgressBar
            current={item.stamps}
            max={safeDesign.maxStampsPerCard}
            color={dynamicTheme.primary}
            backgroundColor={dynamicTheme.border}
          />
          <Spacer height={10} />
          <CustomStampsIndicator
            current={item.stamps}
            max={safeDesign.maxStampsPerCard}
            stampIcon={safeDesign.stampIcon}
            stampColor={dynamicTheme.primary}
            emptyColor={dynamicTheme.border}
            theme={dynamicTheme}
          />
        </>
      )}

      <Spacer height={10} />

      {/* Cafe user: show totals and available rewards */}
      {isCafeUser && (
        <>
          <View style={styles.rewardContainer}>
            <ThemedText
              style={[
                styles.rewardLabel,
                { color: dynamicTheme.text, opacity: 0.7 },
              ]}
            >
              Total Stamps:
            </ThemedText>
            <ThemedText
              style={[styles.rewardText, { color: dynamicTheme.primary }]}
            >
              {item.totalStamps}
            </ThemedText>
          </View>
          <Spacer height={5} />
          <View style={styles.rewardContainer}>
            <ThemedText
              style={[
                styles.rewardLabel,
                { color: dynamicTheme.text, opacity: 0.7 },
              ]}
            >
              Available Rewards:
            </ThemedText>
            <ThemedText
              style={[styles.rewardText, { color: dynamicTheme.primary }]}
            >
              {item.rewardsEarned}
            </ThemedText>
          </View>
          {item.isReady && (
            <>
              <Spacer height={15} />
              <View
                style={[
                  styles.redeemButton,
                  styles.redeemButtonEmphasized,
                  {
                    backgroundColor: "#4CAF50",
                    shadowColor: "#4CAF50",
                  },
                ]}
              >
                <ThemedText
                  style={[styles.redeemText, styles.redeemTextEmphasized]}
                >
                  🎁 Ready to redeem {safeDesign.rewardDescription}
                </ThemedText>
              </View>
            </>
          )}
        </>
      )}
    </View>
  );

  return (
    <Pressable onPress={() => onPress(item.id)}>
      <ThemedCard style={cardStyle}>
        <CardContent />
      </ThemedCard>
    </Pressable>
  );
};

/**
 * CustomStampsIndicator
 *
 * Renders a grid of stamp icons for the card.
 */
const CustomStampsIndicator = ({
  current,
  max,
  stampIcon,
  stampColor,
  emptyColor,
  theme,
}) => {
  const stampsPerRow = 5;
  const rows = Math.ceil(max / stampsPerRow);

  return (
    <View style={styles.stampsGrid}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.stampsRow}>
          {Array.from({ length: stampsPerRow }).map((_, colIndex) => {
            const stampIndex = rowIndex * stampsPerRow + colIndex;
            if (stampIndex >= max) return null;
            const isStamped = stampIndex < current;
            return (
              <View
                key={stampIndex}
                style={[
                  styles.stampSlot,
                  {
                    backgroundColor: isStamped
                      ? stampColor + "20"
                      : theme.background,
                    borderColor: isStamped ? stampColor : emptyColor,
                  },
                ]}
              >
                {isStamped && (
                  <ThemedText style={[styles.stampIcon, { color: stampColor }]}>
                    {stampIcon}
                  </ThemedText>
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    // flex: 1,
    // removed flex to allow content to size naturally
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    fontSize: 32,
  },
  cardInfo: {
    flex: 1,
  },
  cafeName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    opacity: 0.8,
  },
  completeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  readyBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  completeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  readyText: {
    fontSize: 18,
  },
  stampsGrid: {
    alignItems: "center",
    gap: 6,
  },
  stampsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  stampSlot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stampIcon: {
    fontSize: 14,
  },
  rewardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  rewardText: {
    fontSize: 14,
    fontWeight: "600",
  },
  redeemButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  redeemButtonEmphasized: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  redeemText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  redeemTextEmphasized: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  customerRedeemButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  customerRedeemText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  pinButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  pinIcon: {
    fontSize: 16,
  },
});

export default CustomCardItem;

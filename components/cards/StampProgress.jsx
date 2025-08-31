import { StyleSheet, View } from "react-native";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

 /**
 * CustomStampProgress
 *
 * Shows progress, stamps grid, and stats for a custom cafe card.
 * - If a reward is available, shows a redeem button instead.
 */
const CustomStampProgress = ({
  formattedCard,
  theme,
  cafeDesign,
  onRedeem,
}) => {
  // formattedCard: computed card data (currentStamps, totalStamps, hasAvailableRewards, etc.)
  // cafeDesign: design settings (stampIcon, primaryColour)
  // onRedeem: callback when redeem button is pressed
  if (!cafeDesign) {
    // Display loading state until design data is available
    return (
      <ThemedCard
        style={[
          styles.progressCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <ThemedText style={{ color: theme.text }}>Loading...</ThemedText>
      </ThemedCard>
    );
  }

  const maxStamps = 10;
  const currentStamps = formattedCard.currentStamps || 0;
  // Number of stamps currently collected (default 0)
  const progressPercentage = (currentStamps / maxStamps) * 100;
  // Calculate percentage for progress bar fill

  // If a reward is available, show redeem button and summary stats
  if (formattedCard.hasAvailableRewards && onRedeem) {
    // Branch: reward redemption view
    return (
      <ThemedCard
        style={[
          styles.progressCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            borderWidth: 1,
          },
        ]}
      >
        <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
          Reward Available!
        </ThemedText>
        <ThemedButton
          onPress={onRedeem}
          style={{ marginVertical: 16, backgroundColor: theme.primary }}
        >
          <ThemedText
            style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
          >
            🎁 Redeem Free Coffee
          </ThemedText>
        </ThemedButton>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>
              {formattedCard.totalStamps || 0}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.text, opacity: 0.7 }]}
            >
              Total Stamps
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>
              {formattedCard.availableRewards || 0}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.text, opacity: 0.7 }]}
            >
              Available Rewards
            </ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={[styles.statNumber, { color: theme.primary }]}>
              {formattedCard.totalRedeemed || 0}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.text, opacity: 0.7 }]}
            >
              Total Redeemed
            </ThemedText>
          </View>
        </View>
      </ThemedCard>
    );
  }

  return (
    // Default view: progress bar, stamps grid, and summary stats
    <ThemedCard
      style={[
        styles.progressCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderWidth: 1,
        },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
        Progress
      </ThemedText>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBackground,
            { backgroundColor: theme.primary + "30" },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: theme.primary,
              },
            ]}
          />
        </View>
        <ThemedText style={[styles.progressText, { color: theme.text }]}>
          {currentStamps}/{maxStamps}
        </ThemedText>
      </View>

      {/* Stamps Grid */}
      <CustomStampsGrid
        current={currentStamps}
        max={maxStamps}
        stampIcon={cafeDesign.stampIcon}
        stampColor={theme.primary}
        emptyColor={theme.border}
        theme={theme}
      />

      {/* Progress Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: theme.primary }]}>
            {formattedCard.totalStamps || 0}
          </ThemedText>
          <ThemedText
            style={[styles.statLabel, { color: theme.text, opacity: 0.7 }]}
          >
            Total Stamps
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: theme.primary }]}>
            {formattedCard.availableRewards || 0}
          </ThemedText>
          <ThemedText
            style={[styles.statLabel, { color: theme.text, opacity: 0.7 }]}
          >
            Available Rewards
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={[styles.statNumber, { color: theme.primary }]}>
            {formattedCard.totalRedeemed || 0}
          </ThemedText>
          <ThemedText
            style={[styles.statLabel, { color: theme.text, opacity: 0.7 }]}
          >
            Total Redeemed
          </ThemedText>
        </View>
      </View>
    </ThemedCard>
  );
};

/**
 * CustomStampsGrid
 *
 * Renders a grid of stamp slots showing filled vs empty stamps.
 */
const CustomStampsGrid = ({
  current,
  max,
  stampIcon,
  stampColor,
  emptyColor,
  theme,
}) => {
  // current: number of filled slots
  // max: total slots in the grid
  // stampIcon: icon to render in filled slots
  // stampColor: color for filled stamps
  // emptyColor: border/background for empty stamps
  // theme: theme colors (used for empty slots)
  const stampsPerRow = 5;
  // Number of stamps per row
  const rows = Math.ceil(max / stampsPerRow);
  // Compute total rows needed

  return (
    // Container for stamp rows
    <View style={styles.stampsGrid}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.stampsRow}>
          {/* Row of up to `stampsPerRow` stamp slots */}
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
                {/* Render icon for filled stamps */}
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
  // Wrapper for the entire progress card
  progressCard: {
    padding: 20,
  },
  // Title text at top of sections (e.g., 'Progress', 'Reward Available!')
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  // Layout for progress bar and numeric text
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  // Background track for progress bar fill
  progressBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  // Inner fill of the progress bar matching height and rounding
  progressFill: {
    height: "100%",
    borderRadius: 4,
    minWidth: 4,
  },
  // Text style for showing current/max stamps
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 40,
  },
  // Container wrapping rows of stamp slots
  stampsGrid: {
    marginBottom: 20,
  },
  // Styles each horizontal row of stamp slots
  stampsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  // Individual slot representing one stamp position
  stampSlot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  // Icon style for stamps inside filled slots
  stampIcon: {
    fontSize: 16,
  },
  // Container for summary stats below UI (Total Stamps, etc.)
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  // Wrapper for each statistic block
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  // Numeric value style for stats
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  // Label text style for stats
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: "center",
  },
});

export default CustomStampProgress;

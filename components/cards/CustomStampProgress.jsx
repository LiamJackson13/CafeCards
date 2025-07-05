import { StyleSheet, View } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const CustomStampProgress = ({ formattedCard, theme, cafeDesign }) => {
  if (!cafeDesign) {
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

  const maxStamps = cafeDesign.maxStampsPerCard || 10;
  const currentStamps = formattedCard.currentStamps || 0;
  const progressPercentage = (currentStamps / maxStamps) * 100;

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

const CustomStampsGrid = ({
  current,
  max,
  stampIcon,
  stampColor,
  emptyColor,
  theme,
}) => {
  // Create a grid layout for stamps
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
  progressCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  progressBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    minWidth: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 40,
  },
  stampsGrid: {
    marginBottom: 20,
  },
  stampsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  stampSlot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stampIcon: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
    textAlign: "center",
  },
});

export default CustomStampProgress;

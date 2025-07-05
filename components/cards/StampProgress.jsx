import { StyleSheet, View } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

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

const StampGrid = ({ current, max, theme }) => {
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
            <ThemedText style={styles.stampIcon}>⭐</ThemedText>
          )}
        </View>
      ))}
    </View>
  );
};

const ProgressStats = ({ formattedCard }) => {
  return (
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
        <ThemedText style={styles.statLabel}>Available Rewards</ThemedText>
      </View>
      <View style={styles.statItem}>
        <ThemedText style={styles.statNumber}>
          {formattedCard.totalRedeemed}
        </ThemedText>
        <ThemedText style={styles.statLabel}>Total Redeemed</ThemedText>
      </View>
    </View>
  );
};

const StampProgress = ({ formattedCard, theme }) => {
  return (
    <ThemedCard style={styles.progressCard}>
      <ThemedText style={styles.sectionTitle}>Current Progress</ThemedText>

      <View style={styles.progressSection}>
        <ProgressRing current={formattedCard.currentStamps} max={10} />
        <ProgressStats formattedCard={formattedCard} />
      </View>

      <View style={styles.stampGridSection}>
        <ThemedText style={styles.sectionSubtitle}>
          Stamp Collection ({formattedCard.currentStamps}/10)
        </ThemedText>
        <StampGrid
          current={formattedCard.currentStamps}
          max={10}
          theme={theme}
        />
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  progressCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
  },
  progressSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  progressRing: {
    borderRadius: 60,
    borderWidth: 8,
    borderColor: "#e0e0e0",
    borderTopColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
  },
  progressContent: {
    alignItems: "center",
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: "bold",
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
  },
  statItem: {
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  stampGridSection: {
    marginTop: 20,
  },
  stampGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  stampItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stampIcon: {
    fontSize: 16,
  },
});

export default StampProgress;

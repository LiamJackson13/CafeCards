import { StyleSheet, View } from "react-native";
import ThemedText from "../ThemedText";

/**
 * ProgressBar
 *
 * Shows a horizontal progress bar with current/max value.
 */
const ProgressBar = ({ current, max, color }) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { backgroundColor: color + "20" }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <ThemedText style={[styles.progressText, { color }]}>
        {current}/{max}
      </ThemedText>
    </View>
  );
};

/**
 * StampsIndicator
 *
 * Shows a row of circles, filled for each earned stamp.
 */
const StampsIndicator = ({ current, max, color }) => (
  <View style={styles.stampsContainer}>
    {Array.from({ length: max }, (_, index) => (
      <View
        key={index}
        style={[
          styles.stampCircle,
          {
            backgroundColor: index < current ? color : "transparent",
            borderColor: color,
          },
        ]}
      >
        {index < current && <ThemedText style={styles.stampText}>✓</ThemedText>}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 30,
  },
  stampsContainer: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  stampCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stampText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
});

export { ProgressBar, StampsIndicator };

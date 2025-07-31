import { StyleSheet, View } from "react-native";
import ThemedText from "../ThemedText";

/**
 * ProgressBar
 *
 * Shows a horizontal progress bar with current/max value.
 */
const ProgressBar = ({ current, max, color }) => {
  // Calculate fill percentage from current/max, capped at 100%
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <View style={styles.progressBarContainer}>
      {/* Wrapper aligning progress bar and text */}
      <View style={[styles.progressBar, { backgroundColor: color + "20" }]}>
        {/* Track background view */}
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`, // fill width based on computed percentage
              backgroundColor: color, // fill color
            },
          ]}
        />
      </View>
      {/* Display numeric progress beside the bar */}
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
    {/* Render `max` circles; fill first `current` slots */}
    {Array.from({ length: max }, (_, index) => (
      <View
        key={index}
        style={[
          styles.stampCircle,
          {
            backgroundColor: index < current ? color : "transparent", // filled vs empty
            borderColor: color, // circle border
          },
        ]}
      >
        {/* Show checkmark in filled circles */}
        {index < current && <ThemedText style={styles.stampText}>✓</ThemedText>}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  // Horizontal container for bar and value text
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // Base track style with rounded edges, hides overflow
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  // Inner fill of progress bar matching height and rounding
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  // Numeric progress text style
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 30,
  },
  // Container for stamp circles aligned in row
  stampsContainer: {
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  // Circle representing a single stamp slot
  stampCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  // Checkmark text style inside filled stamp
  stampText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
});

export { ProgressBar, StampsIndicator };

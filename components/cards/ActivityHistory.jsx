import { StyleSheet, View } from "react-native";
import Spacer from "../Spacer";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * ScanHistoryItem
 *
 * Renders a single scan activity row with an icon, action label, and time ago.
 * Props:
 * - scan: { action, timestamp, ... } record of one scan event
 * - theme: current theme colors (primary, text)
 */
const ScanHistoryItem = ({ scan, theme }) => {
  // Calculate human-readable time difference
  const date = new Date(scan.timestamp);
  const timeAgo = getTimeAgo(date);

  return (
    <View style={styles.historyItem}>
      {/* Icon circle: '+' for stamp added, '🎁' for reward redeemed */}
      <View
        style={[styles.historyIcon, { backgroundColor: theme.primary + "20" }]}
      >
        <ThemedText style={[styles.historyIconText, { color: theme.primary }]}>
          {scan.action === "stamp_added" ? "+" : "🎁"}
        </ThemedText>
      </View>
      {/* Text content: action and relative time */}
      <View style={styles.historyContent}>
        <ThemedText style={[styles.historyAction, { color: theme.text }]}>
          {scan.action === "stamp_added" ? "Stamp Added" : "Reward Redeemed"}
        </ThemedText>
        <ThemedText
          style={[styles.historyTime, { color: theme.text, opacity: 0.6 }]}
        >
          {timeAgo}
        </ThemedText>
      </View>
    </View>
  );
};

/**
 * getTimeAgo
 *
 * Returns a string like "5m ago", "2h ago", or "3d ago" based on the difference from now.
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date; // Difference in milliseconds
  const diffMins = Math.floor(diffMs / 60000); // Convert to minutes
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMs / 3600000); // Convert to hours
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffMs / 86400000); // Convert to days
  return `${diffDays}d ago`;
};

/**
 * ActivityHistory
 *
 * Card displaying up to the last 5 scan activities (most recent first).
 * Props:
 * - scanHistory: array of scan records sorted oldest→newest
 * - theme: current theme colors (card, border, text)
 */
const ActivityHistory = ({ scanHistory, theme }) => (
  <ThemedCard
    style={[
      styles.historyCard,
      { backgroundColor: theme.card, borderColor: theme.border },
    ]}
  >
    {/* Section header */}
    <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
      Recent Activity
    </ThemedText>
    <Spacer height={15} />

    {scanHistory.length > 0 ? (
      <View style={styles.historyList}>
        {scanHistory
          .slice(-5) // Take last 5 entries
          .reverse() // Show most recent at top
          .map((scan, i) => (
            <ScanHistoryItem key={i} scan={scan} theme={theme} />
          ))}
      </View>
    ) : (
      // Fallback when no history exists
      <View style={styles.emptyHistory}>
        <ThemedText
          style={[styles.emptyHistoryText, { color: theme.text, opacity: 0.6 }]}
        >
          No activity yet
        </ThemedText>
      </View>
    )}
  </ThemedCard>
);

const styles = StyleSheet.create({
  historyCard: {
    // Outer card padding and border
    padding: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    // Header text size and weight
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  historyList: {
    // Vertical list gap between items
    gap: 12,
  },
  historyItem: {
    // Row layout for icon + text
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  historyIcon: {
    // Icon container circle
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyIconText: {
    // Icon symbol size
    fontSize: 16,
    fontWeight: "600",
  },
  historyContent: {
    // Text block expands to fill remaining space
    flex: 1,
  },
  historyAction: {
    // Action label styling
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  historyTime: {
    // Timestamp styling
    fontSize: 12,
  },
  emptyHistory: {
    // Centered placeholder for no entries
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyHistoryText: {
    // Placeholder font styling
    fontSize: 14,
  },
});

export default ActivityHistory;

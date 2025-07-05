import { StyleSheet, View } from "react-native";
import Spacer from "../Spacer";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const ScanHistoryItem = ({ scan, index, theme }) => {
  const date = new Date(scan.timestamp);
  const timeAgo = getTimeAgo(date);

  return (
    <View style={styles.historyItem}>
      <View
        style={[styles.historyIcon, { backgroundColor: theme.primary + "20" }]}
      >
        <ThemedText style={[styles.historyIconText, { color: theme.primary }]}>
          {scan.action === "stamp_added" ? "+" : "🎁"}
        </ThemedText>
      </View>
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

const getTimeAgo = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

const ActivityHistory = ({ scanHistory, theme }) => {
  return (
    <ThemedCard
      style={[
        styles.historyCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
        Recent Activity
      </ThemedText>
      <Spacer height={15} />

      {scanHistory.length > 0 ? (
        <View style={styles.historyList}>
          {scanHistory
            .slice(-5) // Show last 5 scans
            .reverse() // Show most recent first
            .map((scan, index) => (
              <ScanHistoryItem
                key={index}
                scan={scan}
                index={index}
                theme={theme}
              />
            ))}
        </View>
      ) : (
        <View style={styles.emptyHistory}>
          <ThemedText
            style={[
              styles.emptyHistoryText,
              { color: theme.text, opacity: 0.6 },
            ]}
          >
            No activity yet
          </ThemedText>
        </View>
      )}
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  historyCard: {
    padding: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyIconText: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyContent: {
    flex: 1,
  },
  historyAction: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  historyTime: {
    fontSize: 12,
  },
  emptyHistory: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyHistoryText: {
    fontSize: 14,
  },
});

export default ActivityHistory;

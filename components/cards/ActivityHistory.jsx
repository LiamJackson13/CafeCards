import { StyleSheet, View } from "react-native";
import Spacer from "../Spacer";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const ScanHistoryItem = ({ scan, index }) => {
  const date = new Date(scan.timestamp);
  const timeAgo = getTimeAgo(date);

  return (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <ThemedText style={styles.historyIconText}>
          {scan.action === "stamp_added" ? "+" : "🎁"}
        </ThemedText>
      </View>
      <View style={styles.historyContent}>
        <ThemedText style={styles.historyAction}>
          {scan.action === "stamp_added" ? "Stamp Added" : "Reward Redeemed"}
        </ThemedText>
        <ThemedText style={styles.historyTime}>{timeAgo}</ThemedText>
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

const ActivityHistory = ({ scanHistory }) => {
  return (
    <ThemedCard style={styles.historyCard}>
      <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
      <Spacer height={15} />

      {scanHistory.length > 0 ? (
        <View style={styles.historyList}>
          {scanHistory
            .slice(-5) // Show last 5 scans
            .reverse() // Show most recent first
            .map((scan, index) => (
              <ScanHistoryItem key={index} scan={scan} index={index} />
            ))}
        </View>
      ) : (
        <View style={styles.emptyHistory}>
          <ThemedText style={styles.emptyHistoryText}>
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
    backgroundColor: "#007AFF20",
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
    opacity: 0.6,
  },
  emptyHistory: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyHistoryText: {
    fontSize: 14,
    opacity: 0.6,
  },
});

export default ActivityHistory;

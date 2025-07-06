import { ScrollView, StyleSheet, View } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const ScanHistory = ({ scanHistory, theme }) => {
  if (scanHistory.length === 0) {
    return <ThemedText style={styles.noHistory}>No recent scans</ThemedText>;
  }

  return (
    <ScrollView
      style={styles.historyContainer}
      showsVerticalScrollIndicator={false}
    >
      {scanHistory.map((scan) => (
        <ThemedCard key={scan.id} style={styles.historyItem}>
          <View style={styles.historyContent}>
            <View style={styles.historyLeft}>
              <ThemedText style={styles.customerName}>
                {scan.customer.name}
              </ThemedText>
              <ThemedText style={styles.customerEmail}>
                {scan.customer.email}
              </ThemedText>
              <ThemedText style={styles.scanTime}>
                {scan.timestamp.toLocaleTimeString()}
              </ThemedText>
            </View>
            <View style={styles.historyRight}>
              <ThemedText style={styles.stampCount}>
                {scan.type === "redemption"
                  ? "🎁 Redeemed"
                  : scan.action?.includes("_stamps_added") ||
                    scan.type === "stamp"
                  ? `+${
                      scan.stampsAdded && scan.stampsAdded > 0
                        ? scan.stampsAdded
                        : scan.customer?.stampsAdded || 1
                    } ⭐`
                  : `${scan.customer?.currentStamps || 0}/10 ⭐`}
              </ThemedText>
            </View>
          </View>
        </ThemedCard>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    maxHeight: 250,
  },
  historyItem: {
    marginBottom: 10,
    padding: 15,
  },
  historyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyLeft: {
    flex: 1,
  },
  historyRight: {
    alignItems: "flex-end",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  scanTime: {
    fontSize: 12,
    opacity: 0.5,
  },
  stampCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noHistory: {
    textAlign: "center",
    opacity: 0.5,
    fontSize: 16,
    marginTop: 20,
  },
});

export default ScanHistory;

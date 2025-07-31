import { ScrollView, StyleSheet, View } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * ScanHistory Component:
 * - Props:
 *   scanHistory: array of scan objects with customer, type, timestamp, etc.
 * Renders recent scan records or a placeholder if none.
 */
const ScanHistory = ({ scanHistory }) => {
  // If there are no scans, show a friendly message
  if (scanHistory.length === 0) {
    return <ThemedText style={styles.noHistory}>No recent scans</ThemedText>;
  }

  // Helper: derive a display name from available customer fields
  const getDisplayName = (customer) => {
    if (customer?.name && customer.name.trim() !== "") {
      return customer.name;
    }
    if (customer?.customerName && customer.customerName.trim() !== "") {
      return customer.customerName;
    }
    return customer?.email?.split("@")[0] || "Unknown Customer";
  };

  return (
    <ScrollView
      // Scrollable list of scan history cards
      style={styles.historyContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Map each scan record to a card */}
      {scanHistory.map((scan) => (
        <ThemedCard key={scan.id} style={styles.historyItem}>
          {/* Row layout for customer info and scan result */}
          <View style={styles.historyContent}>
            {/* Left side: customer details and timestamp */}
            <View style={styles.historyLeft}>
              <ThemedText style={styles.customerName}>
                {getDisplayName(scan.customer)}
              </ThemedText>
              <ThemedText style={styles.customerEmail}>
                {scan.customer?.email || "No email"}
              </ThemedText>
              <ThemedText style={styles.scanTime}>
                {scan.timestamp.toLocaleTimeString()}
              </ThemedText>
            </View>
            {/* Right side: stamp or redemption indicator */}
            <View style={styles.historyRight}>
              <ThemedText style={styles.stampCount}>
                {scan.type === "redemption"
                  ? "🎁 Redeemed"
                  : scan.type === "stamp" && scan.status === "success"
                  ? `+${scan.stampsAdded || 0} ⭐`
                  : scan.type === "stamp" && scan.status === "error"
                  ? "❌ Failed"
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
  // Container for scrollable history, limits height
  historyContainer: {
    maxHeight: 250,
  },
  // Wrapper for each history card
  historyItem: {
    marginBottom: 10,
    padding: 15,
  },
  // Content row: align customer info and result horizontally
  historyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Left section containing customer details
  historyLeft: {
    flex: 1,
  },
  // Right section for scan result indicator
  historyRight: {
    alignItems: "flex-end",
  },
  // Style for customer name text
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  // Style for customer email text
  customerEmail: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  // Style for scan timestamp text
  scanTime: {
    fontSize: 12,
    opacity: 0.5,
  },
  // Style for stamp count or status text
  stampCount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  // Style for 'no history' placeholder text
  noHistory: {
    textAlign: "center",
    opacity: 0.5,
    fontSize: 16,
    marginTop: 20,
  },
});

export default ScanHistory;

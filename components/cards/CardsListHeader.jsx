import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import Spacer from "../Spacer";
import ThemedText from "../ThemedText";

const StatsCard = ({ title, value, label }) => (
  <View style={styles.statItem}>
    <ThemedText style={styles.statNumber}>{value}</ThemedText>
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
  </View>
);

const CardsListHeader = ({ isCafeUser, displayCards }) => {
  const readyToRedeemCount = displayCards.filter(
    (card) => card.stamps >= card.maxStamps || card.isReady
  ).length;

  const totalStamps = displayCards.reduce(
    (sum, card) => sum + (card.totalStamps || card.stamps),
    0
  );

  return (
    <View>
      {isCafeUser && (
        <View style={styles.cafeUserBadge}>
          <ThemedText style={styles.cafeUserText}>🏪 CAFE MANAGER</ThemedText>
        </View>
      )}

      <View style={styles.header}>
        <ThemedText type="title" style={styles.heading}>
          {isCafeUser ? "Customer Loyalty Cards" : "Your Loyalty Cards"}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {isCafeUser
            ? "Manage customer loyalty cards and track rewards"
            : "Collect stamps and earn rewards at your favorite cafes"}
        </ThemedText>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <StatsCard
          value={displayCards.length}
          label={isCafeUser ? "Customer Cards" : "Active Cards"}
        />
        <StatsCard value={readyToRedeemCount} label="Ready to Redeem" />
        <StatsCard value={totalStamps} label="Total Stamps" />
      </View>

      <Spacer height={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  cafeUserBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  cafeUserText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
});

export default CardsListHeader;

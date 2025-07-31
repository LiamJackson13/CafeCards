import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import Spacer from "../Spacer";
import ThemedText from "../ThemedText";

/**
 * StatsCard
 *
 * Displays a single stat value and label.
 */
const StatsCard = ({ value, label }) => (
  <View style={styles.statItem}>
    {/* Numeric value of the statistic */}
    <ThemedText style={styles.statNumber}>{value}</ThemedText>
    {/* Label describing the statistic */}
    <ThemedText style={styles.statLabel}>{label}</ThemedText>
  </View>
);

/**
 * CardsListHeader
 *
 * Header for the cards list, showing quick stats and context info.
 * - Shows different headings and stats for cafe users vs. customers.
 */
const CardsListHeader = ({ isCafeUser, displayCards }) => {
  // isCafeUser: flag indicating manager view (true) vs customer view (false)
  // displayCards: array of card objects used to compute and display stats
  // Count cards ready to redeem (full or flagged as ready)
  const readyToRedeemCount = displayCards.filter(
    (card) => card.stamps >= card.maxStamps || card.isReady
  ).length;

  // Count pinned cards (for customers)
  const pinnedCardsCount = displayCards.filter((card) => card.isPinned).length;

  // Total stamps across all cards (fallback to card.stamps if totalStamps not set)
  const totalStamps = displayCards.reduce(
    (sum, card) => sum + (card.totalStamps || card.stamps),
    0
  );

  return (
    <View>
      {/* Cafe user badge */}
      {isCafeUser && (
        <View style={styles.cafeUserBadge}>
          <ThemedText style={styles.cafeUserText}>🏪 CAFE MANAGER</ThemedText>
        </View>
      )}

      {/* Heading and subtitle */}
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
        {/* Only show pinned cards stat for customers */}
        {!isCafeUser && pinnedCardsCount > 0 && (
          <StatsCard value={pinnedCardsCount} label="Pinned Cards" />
        )}
        <StatsCard value={readyToRedeemCount} label="Ready to Redeem" />
        <StatsCard value={totalStamps} label="Total Stamps" />
      </View>

      <Spacer height={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Container for the cafe manager badge at top
  cafeUserBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 10,
  },
  // Text style inside the manager badge
  cafeUserText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Wrapper for the header section (title and subtitle)
  header: {
    padding: 20,
    alignItems: "center",
  },
  // Main heading text style
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  // Subtitle text style under the heading
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  // Layout for the row of stat cards
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  // Container for each stat item
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  // Style for the numeric value in a stat card
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 4,
  },
  // Style for the label text in a stat card
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
});

export default CardsListHeader;

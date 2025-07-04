/**
 * Loyalty Cards Screen
 *
 * This screen displays the user's collection of cafe loyalty cards.
 * Features include:
 * - Grid/list view of all user's loyalty cards
 * - Beautiful card designs with progress indicators
 * - Individual card details and progress tracking
 * - Empty state handling for users with no cards
 * - Modern UI with themed styling
 */
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useCafeUser } from "../../hooks/useCafeUser";

// Dummy data for loyalty cards
const dummyCards = [
  {
    id: "1",
    cafeName: "Brew & Bean",
    stamps: 8,
    maxStamps: 10,
    reward: "Free Coffee",
    color: "#8B4513",
    icon: "☕",
    location: "Downtown",
  },
  {
    id: "2",
    cafeName: "Sunrise Cafe",
    stamps: 5,
    maxStamps: 8,
    reward: "Free Pastry",
    color: "#FF6B35",
    icon: "🥐",
    location: "City Center",
  },
  {
    id: "3",
    cafeName: "The Grind",
    stamps: 12,
    maxStamps: 12,
    reward: "Free Lunch",
    color: "#4CAF50",
    icon: "🥪",
    location: "West Side",
  },
  {
    id: "4",
    cafeName: "Mocha Magic",
    stamps: 3,
    maxStamps: 15,
    reward: "Free Dessert",
    color: "#9C27B0",
    icon: "🧁",
    location: "East Mall",
  },
  {
    id: "5",
    cafeName: "Bean There",
    stamps: 6,
    maxStamps: 10,
    reward: "Free Drink",
    color: "#2196F3",
    icon: "🥤",
    location: "North Plaza",
  },
];

const CardsScreen = () => {
  const router = useRouter();
  const isCafeUser = useCafeUser();

  const ProgressBar = ({ current, max, color }) => {
    const progress = Math.min(current / max, 1);
    const isComplete = current >= max;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress * 100}%`,
                backgroundColor: isComplete ? "#4CAF50" : color,
              },
            ]}
          />
        </View>
        <ThemedText
          style={[styles.progressText, isComplete && styles.completeText]}
        >
          {current}/{max}
        </ThemedText>
      </View>
    );
  };

  const StampsIndicator = ({ current, max, color }) => {
    return (
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
            {index < current && (
              <ThemedText style={styles.stampText}>✓</ThemedText>
            )}
          </View>
        ))}
      </View>
    );
  };

  const CardItem = ({ item }) => {
    const isComplete = item.stamps >= item.maxStamps;

    return (
      <Pressable onPress={() => router.push(`/books/${item.id}`)}>
        <ThemedCard style={[styles.card, { borderLeftColor: item.color }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardIcon}>{item.icon}</ThemedText>
            <View style={styles.cardInfo}>
              <ThemedText style={styles.cafeName} numberOfLines={1}>
                {item.cafeName}
              </ThemedText>
              <ThemedText style={styles.location}>{item.location}</ThemedText>
            </View>
            {isComplete && (
              <View style={styles.completeBadge}>
                <ThemedText style={styles.completeText}>✓</ThemedText>
              </View>
            )}
          </View>

          <Spacer size={10} />

          <ProgressBar
            current={item.stamps}
            max={item.maxStamps}
            color={item.color}
          />

          <Spacer size={10} />

          <StampsIndicator
            current={Math.min(item.stamps, 5)} // Show max 5 stamps visually
            max={Math.min(item.maxStamps, 5)}
            color={item.color}
          />

          <Spacer size={10} />

          <View style={styles.rewardContainer}>
            <ThemedText style={styles.rewardLabel}>Reward:</ThemedText>
            <ThemedText style={[styles.rewardText, { color: item.color }]}>
              {item.reward}
            </ThemedText>
          </View>

          {isComplete && (
            <View
              style={[styles.redeemButton, { backgroundColor: item.color }]}
            >
              <ThemedText style={styles.redeemText}>
                Ready to Redeem!
              </ThemedText>
            </View>
          )}
        </ThemedCard>
      </Pressable>
    );
  };

  const ListHeader = () => (
    <View>
      {isCafeUser && (
        <View style={styles.cafeUserBadge}>
          <ThemedText style={styles.cafeUserText}>🏪 CAFE OWNER</ThemedText>
        </View>
      )}

      <View style={styles.header}>
        <ThemedText type="title" style={styles.heading}>
          Your Loyalty Cards
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Collect stamps and earn rewards at your favorite cafes
        </ThemedText>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{dummyCards.length}</ThemedText>
          <ThemedText style={styles.statLabel}>Active Cards</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {dummyCards.filter((card) => card.stamps >= card.maxStamps).length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Ready to Redeem</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {dummyCards.reduce((sum, card) => sum + card.stamps, 0)}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Stamps</ThemedText>
        </View>
      </View>

      <Spacer size={20} />
    </View>
  );

  return (
    <ThemedView style={styles.container} safe>
      <FlatList
        data={dummyCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardItem item={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    paddingVertical: 15,
    backgroundColor: "rgba(170, 124, 72, 0.1)",
    marginHorizontal: 20,
    borderRadius: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    width: "100%",
    marginVertical: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    opacity: 0.6,
  },
  completeBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  completeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    minWidth: 30,
  },
  stampsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  stampCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stampText: {
    fontSize: 8,
    color: "#fff",
    fontWeight: "bold",
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rewardLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  rewardText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  redeemButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 8,
    alignItems: "center",
  },
  redeemText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export default CardsScreen;

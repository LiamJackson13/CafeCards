/**
 * Loyalty Cards Screen
 *
 * This screen displays loyalty cards differently based on user type:
 * - For customers: Shows their own loyalty cards from different cafes
 * - For cafe users: Shows all customer loyalty cards they manage
 * Features include:
 * - Grid/list view of loyalty cards
 * - Beautiful card designs with progress indicators
 * - Individual card details and progress tracking
 * - Empty state handling for users with no cards
 * - Modern UI with themed styling
 * - Real-time updates from Appwrite database
 */
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import Spacer from "../../components/Spacer";
import ThemedCard from "../../components/ThemedCard";
import { ThemedLoader } from "../../components/ThemedLoader";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { CardsContext } from "../../contexts/CardsContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCafeUser } from "../../hooks/useCafeUser";

const CardsScreen = () => {
  const router = useRouter();
  const isCafeUser = useCafeUser();
  const { actualTheme } = useTheme();
  const { cards, loading, fetchCards } = useContext(CardsContext);
  const [refreshing, setRefreshing] = useState(false);

  const theme = Colors[actualTheme] ?? Colors.light;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCards();
    } catch (error) {
      console.error("Error refreshing cards:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Convert loyalty card data to display format
  const formatCardForDisplay = (loyaltyCard) => {
    const rewardsEarned = Math.floor(loyaltyCard.currentStamps / 10);

    return {
      id: loyaltyCard.$id,
      cafeName: isCafeUser ? "Local Cafe" : "Local Cafe", // Could be extracted from cafe user data
      customerName: loyaltyCard.customerName,
      customerEmail: loyaltyCard.customerEmail,
      stamps: loyaltyCard.currentStamps % 10, // Current progress toward next reward
      maxStamps: 10,
      totalStamps: loyaltyCard.currentStamps,
      reward: rewardsEarned > 0 ? "Free Coffee Ready!" : "Free Coffee",
      color: rewardsEarned > 0 ? "#4CAF50" : "#8B4513",
      icon: rewardsEarned > 0 ? "🎉" : "☕",
      location: isCafeUser ? "Your Store" : "Downtown", // Different for customer vs cafe view
      isReady:
        loyaltyCard.currentStamps % 10 === 0 && loyaltyCard.currentStamps > 0,
      rewardsEarned: rewardsEarned,
      lastStamp: loyaltyCard.lastStampDate,
    };
  };

  const displayCards = cards.map(formatCardForDisplay); // Now works for both cafe users and customers

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
      <Pressable onPress={() => router.push(`/cards/${item.id}`)}>
        <ThemedCard style={[styles.card, { borderLeftColor: item.color }]}>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardIcon}>{item.icon}</ThemedText>
            <View style={styles.cardInfo}>
              <ThemedText style={styles.cafeName} numberOfLines={1}>
                {isCafeUser ? item.customerName : item.cafeName}
              </ThemedText>
              <ThemedText style={styles.location}>
                {isCafeUser ? item.customerEmail : item.location}
              </ThemedText>
            </View>
            {(isComplete || item.isReady) && (
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

          {isCafeUser && (
            <>
              <View style={styles.rewardContainer}>
                <ThemedText style={styles.rewardLabel}>
                  Total Stamps:
                </ThemedText>
                <ThemedText style={[styles.rewardText, { color: item.color }]}>
                  {item.totalStamps}
                </ThemedText>
              </View>
              <Spacer size={5} />
              <View style={styles.rewardContainer}>
                <ThemedText style={styles.rewardLabel}>
                  Rewards Earned:
                </ThemedText>
                <ThemedText style={[styles.rewardText, { color: item.color }]}>
                  {item.rewardsEarned}
                </ThemedText>
              </View>
              <Spacer size={5} />
            </>
          )}

          <View style={styles.rewardContainer}>
            <ThemedText style={styles.rewardLabel}>Reward:</ThemedText>
            <ThemedText style={[styles.rewardText, { color: item.color }]}>
              {item.reward}
            </ThemedText>
          </View>

          {(isComplete || item.isReady) && (
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
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {displayCards.length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>
            {isCafeUser ? "Customer Cards" : "Active Cards"}
          </ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {
              displayCards.filter(
                (card) => card.stamps >= card.maxStamps || card.isReady
              ).length
            }
          </ThemedText>
          <ThemedText style={styles.statLabel}>Ready to Redeem</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>
            {displayCards.reduce(
              (sum, card) => sum + (card.totalStamps || card.stamps),
              0
            )}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Stamps</ThemedText>
        </View>
      </View>

      <Spacer size={20} />
    </View>
  );

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyIcon}>
        {isCafeUser ? "📋" : "💳"}
      </ThemedText>
      <ThemedText style={styles.emptyTitle}>
        {isCafeUser ? "No Customer Cards Yet" : "No Loyalty Cards Yet"}
      </ThemedText>
      <ThemedText style={styles.emptyMessage}>
        {isCafeUser
          ? "When customers scan their QR codes, their loyalty cards will appear here."
          : "Start collecting loyalty cards by visiting participating cafes."}
      </ThemedText>
    </View>
  );

  if (loading && displayCards.length === 0) {
    return (
      <ThemedView style={styles.container} safe>
        <View style={styles.loadingContainer}>
          <ThemedLoader size="large" />
          <ThemedText style={styles.loadingText}>Loading cards...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safe>
      <FlatList
        data={displayCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardItem item={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.text}
          />
        }
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
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
  },
  // Loading state styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
});

export default CardsScreen;

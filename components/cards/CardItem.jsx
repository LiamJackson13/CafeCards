import { Pressable, StyleSheet, View } from "react-native";
import Spacer from "../Spacer";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";
import { ProgressBar, StampsIndicator } from "./ProgressIndicators";

const CardItem = ({ item, onPress, isCafeUser }) => {
  const isComplete = item.stamps >= item.maxStamps;

  return (
    <Pressable onPress={() => onPress(item.id)}>
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

        <Spacer height={10} />

        <ProgressBar
          current={item.stamps}
          max={item.maxStamps}
          color={item.color}
        />

        <Spacer height={10} />

        <StampsIndicator
          current={Math.min(item.stamps, 5)} // Show max 5 stamps visually
          max={Math.min(item.maxStamps, 5)}
          color={item.color}
        />

        <Spacer height={10} />

        {isCafeUser && (
          <>
            <View style={styles.rewardContainer}>
              <ThemedText style={styles.rewardLabel}>Total Stamps:</ThemedText>
              <ThemedText style={[styles.rewardText, { color: item.color }]}>
                {item.totalStamps}
              </ThemedText>
            </View>
            <Spacer height={5} />
            <View style={styles.rewardContainer}>
              <ThemedText style={styles.rewardLabel}>
                Rewards Earned:
              </ThemedText>
              <ThemedText style={[styles.rewardText, { color: item.color }]}>
                {item.rewardsEarned}
              </ThemedText>
            </View>
            <Spacer height={5} />
          </>
        )}

        <View style={styles.rewardContainer}>
          <ThemedText style={styles.rewardLabel}>Reward:</ThemedText>
          <ThemedText style={[styles.rewardText, { color: item.color }]}>
            {item.reward}
          </ThemedText>
        </View>

        {(isComplete || item.isReady) && (
          <View style={[styles.redeemButton, { backgroundColor: item.color }]}>
            <ThemedText style={styles.redeemText}>Ready to Redeem!</ThemedText>
          </View>
        )}
      </ThemedCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    marginHorizontal: 20,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cafeName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    opacity: 0.7,
  },
  completeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  completeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rewardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  rewardText: {
    fontSize: 14,
    fontWeight: "600",
  },
  redeemButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  redeemText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CardItem;

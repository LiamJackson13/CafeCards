import { StyleSheet } from "react-native";
import Spacer from "../Spacer";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const CustomerRedeemActions = ({ formattedCard, onRedeem }) => {
  if (!formattedCard.hasAvailableRewards) return null;

  return (
    <ThemedCard style={styles.actionsCard}>
      <ThemedText style={styles.sectionTitle}>
        {formattedCard.availableRewards > 1
          ? "Rewards Ready!"
          : "Reward Ready!"}
      </ThemedText>
      <ThemedText style={styles.rewardCount}>
        You have {formattedCard.availableRewards} free coffee
        {formattedCard.availableRewards > 1 ? "s" : ""} available!
      </ThemedText>
      <Spacer height={15} />
      <ThemedButton
        onPress={onRedeem}
        style={[styles.redeemButton, { backgroundColor: "#4CAF50" }]}
      >
        <ThemedText style={styles.redeemButtonText}>
          🎁 Redeem Free Coffee
        </ThemedText>
      </ThemedButton>
    </ThemedCard>
  );
};

const CafeActions = ({ onAddStamp, addingStamp, theme }) => {
  return (
    <ThemedCard style={styles.actionsCard}>
      <ThemedText style={styles.sectionTitle}>Actions</ThemedText>
      <Spacer height={15} />
      <ThemedButton
        onPress={onAddStamp}
        disabled={addingStamp}
        style={[styles.addStampButton, { backgroundColor: theme.primary }]}
      >
        <ThemedText style={styles.addStampText}>
          {addingStamp ? "Adding..." : "Add Stamp"}
        </ThemedText>
      </ThemedButton>
    </ThemedCard>
  );
};

const CardActions = ({
  formattedCard,
  isCafeUser,
  onRedeem,
  onAddStamp,
  addingStamp,
  theme,
}) => {
  if (isCafeUser) {
    return (
      <CafeActions
        onAddStamp={onAddStamp}
        addingStamp={addingStamp}
        theme={theme}
      />
    );
  }

  return (
    <CustomerRedeemActions formattedCard={formattedCard} onRedeem={onRedeem} />
  );
};

const styles = StyleSheet.create({
  actionsCard: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  rewardCount: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
  },
  redeemButton: {
    paddingVertical: 15,
    borderRadius: 12,
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  addStampButton: {
    paddingVertical: 15,
    borderRadius: 8,
  },
  addStampText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CardActions;

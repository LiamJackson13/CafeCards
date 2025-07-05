import { StyleSheet } from "react-native";
import Spacer from "../Spacer";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const CustomerRedeemActions = ({ formattedCard, onRedeem, theme }) => {
  if (!formattedCard.hasAvailableRewards) return null;

  return (
    <ThemedCard
      style={[
        styles.actionsCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
        {formattedCard.availableRewards > 1
          ? "Rewards Ready!"
          : "Reward Ready!"}
      </ThemedText>
      <ThemedText
        style={[styles.rewardCount, { color: theme.text, opacity: 0.8 }]}
      >
        You have {formattedCard.availableRewards} free coffee
        {formattedCard.availableRewards > 1 ? "s" : ""} available!
      </ThemedText>
      <Spacer height={15} />
      <ThemedButton
        onPress={onRedeem}
        style={[
          styles.redeemButton,
          styles.redeemButtonEnhanced,
          {
            backgroundColor: "#4CAF50",
            shadowColor: "#4CAF50",
            borderColor: "#4CAF50",
          },
        ]}
      >
        <ThemedText
          style={[styles.redeemButtonText, styles.redeemButtonTextEnhanced]}
        >
          🎁 Redeem Free Coffee
        </ThemedText>
      </ThemedButton>
    </ThemedCard>
  );
};

const CafeActions = ({ onAddStamp, addingStamp, theme }) => {
  return (
    <ThemedCard
      style={[
        styles.actionsCard,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
        Actions
      </ThemedText>
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
    <CustomerRedeemActions
      formattedCard={formattedCard}
      onRedeem={onRedeem}
      theme={theme}
    />
  );
};

const styles = StyleSheet.create({
  actionsCard: {
    padding: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  rewardCount: {
    fontSize: 14,
    textAlign: "center",
  },
  redeemButton: {
    paddingVertical: 15,
    borderRadius: 12,
  },
  redeemButtonEnhanced: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  redeemButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  redeemButtonTextEnhanced: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
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

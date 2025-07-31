import { StyleSheet } from "react-native";
import Spacer from "../Spacer";
import ThemedButton from "../ThemedButton";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * CustomerRedeemActions
 *
 * Renders reward count and a redeem button for normal users.
 * Props:
 * - formattedCard: object with pre-computed card data (availableRewards, etc.)
 * - onRedeem: callback when redeem button is pressed
 * - theme: current theme colors
 */
const CustomerRedeemActions = ({ formattedCard, onRedeem, theme }) => {
  if (!formattedCard.hasAvailableRewards) return null;

  return (
    <ThemedCard
      style={[
        styles.actionsCard, // Base card container styling
        {
          backgroundColor: theme.card, // Card background from theme
          borderColor: theme.border, // Border color from theme
        },
      ]}
    >
      {/* Section header showing readiness */}
      <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
        {formattedCard.availableRewards > 1
          ? "Rewards Ready!"
          : "Reward Ready!"}
      </ThemedText>
      {/* Info text displaying count of free coffees */}
      <ThemedText
        style={[styles.rewardCount, { color: theme.text, opacity: 0.8 }]}
      >
        You have {formattedCard.availableRewards} free coffee
        {formattedCard.availableRewards > 1 ? "s" : ""} available!
      </ThemedText>

      <Spacer height={15} />

      {/* Redeem button with enhanced styling */}
      <ThemedButton
        onPress={onRedeem}
        style={[
          styles.redeemButton, // button styling

          {
            backgroundColor: theme.primary || theme.accent, // Theme primary
            shadowColor: theme.primary || theme.accent, // Shadow matches theme
            borderColor: theme.primary || theme.accent, // Border matches theme
          },
        ]}
      >
        {/* Button text with extra weight */}
        <ThemedText style={styles.redeemButtonText}>
          🎁 Redeem Free Coffee
        </ThemedText>
      </ThemedButton>
    </ThemedCard>
  );
};

/**
 * CafeActions
 *
 * Renders an "Add Stamp" button for cafe staff.
 * Props:
 * - onAddStamp: callback when adding a stamp
 * - addingStamp: boolean indicating busy state
 * - theme: current theme colors
 */
const CafeActions = ({ onAddStamp, addingStamp, theme }) => (
  <ThemedCard
    style={[
      styles.actionsCard, // Base card container styling
      {
        backgroundColor: theme.card, // Card background from theme
        borderColor: theme.border, // Border color from theme
      },
    ]}
  >
    {/* Section header */}
    <ThemedText style={[styles.sectionTitle, { color: theme.text }]}>
      Actions
    </ThemedText>

    <Spacer height={15} />

    {/* Add Stamp button */}
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

/**
 * CardActions
 *
 * Chooses between CustomerRedeemActions and CafeActions
 * based on user role.
 * Props:
 * - formattedCard, isCafeUser, onRedeem, onAddStamp, addingStamp, theme
 */
const CardActions = ({
  formattedCard,
  isCafeUser,
  onRedeem,
  onAddStamp,
  addingStamp,
  theme,
}) => {
  return isCafeUser ? (
    <CafeActions
      onAddStamp={onAddStamp}
      addingStamp={addingStamp}
      theme={theme}
    />
  ) : (
    <CustomerRedeemActions
      formattedCard={formattedCard}
      onRedeem={onRedeem}
      theme={theme}
    />
  );
};

const styles = StyleSheet.create({
  actionsCard: {
    // Card container for action buttons
    padding: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    // Section header text style
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  rewardCount: {
    // Sub-header text for reward count
    fontSize: 14,
    textAlign: "center",
  },
  redeemButton: {
    // styling for redeem button
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  redeemButtonText: {
    // Text style in redeem button
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  addStampButton: {
    // Button styling for Add Stamp
    paddingVertical: 15,
    borderRadius: 8,
  },
  addStampText: {
    // Text style inside Add Stamp button
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CardActions;

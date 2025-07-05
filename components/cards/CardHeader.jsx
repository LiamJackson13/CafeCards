import { StyleSheet, View } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const CardHeader = ({ formattedCard, isCafeUser }) => {
  return (
    <ThemedCard style={styles.headerCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <ThemedText style={styles.cardIconText}>
            {formattedCard.isComplete ? "🎉" : "☕"}
          </ThemedText>
        </View>
        <View style={styles.cardInfo}>
          <ThemedText style={styles.customerName}>
            {isCafeUser ? formattedCard.customerName : "Local Cafe"}
          </ThemedText>
          <ThemedText style={styles.customerEmail}>
            {isCafeUser ? formattedCard.customerEmail : "Your loyalty card"}
          </ThemedText>
        </View>
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardIconText: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default CardHeader;

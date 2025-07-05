import { StyleSheet, View } from "react-native";
import ThemedText from "../ThemedText";
import StatCard from "./StatCard";

const StatsSection = ({ isCafeUser }) => {
  // Customer Stats
  const customerStats = [
    { title: "Cards Saved", value: "5", icon: "💳" },
    { title: "Scans This Month", value: "12", icon: "📱" },
    { title: "Points Earned", value: "248", icon: "⭐" },
  ];

  // Cafe Owner Stats
  const cafeStats = [
    { title: "Total Customers", value: "1,247", icon: "👥" },
    { title: "Cards Issued", value: "89", icon: "🎫" },
    { title: "Rewards Redeemed", value: "156", icon: "🎁" },
  ];

  const statsToShow = isCafeUser ? cafeStats : customerStats;

  return (
    <>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {isCafeUser ? "Business Analytics" : "Your Stats"}
      </ThemedText>
      <View style={styles.statsContainer}>
        {statsToShow.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});

export default StatsSection;

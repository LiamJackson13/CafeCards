import { StyleSheet, View } from "react-native";
import ThemedText from "../ThemedText";
import StatCard from "./StatCard";

const StatsSection = ({ isCafeUser, stats, loading, error }) => {
  return (
    <>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {isCafeUser ? "Business Analytics" : "Your Stats"}
      </ThemedText>

      {error && (
        <ThemedText style={styles.errorText}>
          Failed to load stats. Please try again later.
        </ThemedText>
      )}

      <View style={styles.statsContainer}>
        {loading
          ? // Show loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <StatCard
                key={index}
                title=""
                value=""
                icon=""
                color="#999"
                loading={true}
              />
            ))
          : stats && stats.length > 0
          ? stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))
          : // Fallback stats
            Array.from({ length: 4 }).map((_, index) => (
              <StatCard
                key={index}
                title="No Data"
                value="0"
                icon="📊"
                color="#999"
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
  errorText: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 15,
    fontSize: 14,
  },
});

export default StatsSection;

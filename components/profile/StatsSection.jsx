// imports
import { StyleSheet, View } from "react-native";
import ThemedText from "../ThemedText";
import StatCard from "./StatCard";

/**
 * StatsSection
 *
 * Displays a row of StatCard components for user or cafe analytics.
 * Handles loading, error, and empty states gracefully.
 */
const StatsSection = ({ isCafeUser, stats, loading, error }) => {
  // isCafeUser: determines if analytics view applies cafe or customer stats
  // stats: array of statistic objects ({ title, value, icon, color }) to render

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Section title with optional navigation for cafe users */}
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {isCafeUser ? "Business Analytics" : "Your Stats"}
          </ThemedText>
        </View>
      </View>

      {/* Error message when stats fail to load */}
      {error && (
        <ThemedText style={styles.errorText}>
          Failed to load stats. Please try again later.
        </ThemedText>
      )}

      {/* Container for stat card components */}
      <View style={styles.statsContainer}>
        {loading
          ? // Loading state: render placeholder StatCards
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
          ? // Render StatCards for each stat object
            stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
              />
            ))
          : // Fallback: show 'No Data' placeholder cards when empty
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
  // Section header text style
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  // Layout for row of StatCard components
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  // Text style for error notice above stats
  errorText: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 15,
    fontSize: 14,
  },
});

export default StatsSection;

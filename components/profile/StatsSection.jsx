import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import ThemedText from "../ThemedText";
import StatCard from "./StatCard";

/**
 * StatsSection
 *
 * Displays a row of StatCard components for user or business analytics.
 * Handles loading, error, and empty states gracefully.
 */
const StatsSection = ({ isCafeUser, stats, loading, error }) => {
  const router = useRouter();
  const { actualTheme } = useTheme();
  const theme =
    actualTheme === "dark" ? { text: "#FFFFFF" } : { text: "#000000" };

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
          <ThemedText
            type="subtitle"
            style={styles.sectionTitle}
            onPress={() => isCafeUser && router.push("analytics")}
          >
            {isCafeUser ? "Business Analytics" : "Your Stats"}
          </ThemedText>
          {isCafeUser && (
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: theme.text,
                marginLeft: 15,
                marginBottom: 10, // Moves the arrow up to align with the text
              }}
              onPress={() => router.push("analytics")}
            >
              ➔
            </Text>
          )}
        </View>
      </View>

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
          : // Fallback stats if none available
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

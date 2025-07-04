/**
 * StatCard Component
 *
 * A reusable card component for displaying statistics with an icon, value, and title.
 * Used in profile screens to show user analytics and metrics.
 */
import { StyleSheet } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const StatCard = ({ title, value, icon }) => (
  <ThemedCard style={styles.statCard}>
    <ThemedText style={styles.statIcon}>{icon}</ThemedText>
    <ThemedText style={styles.statValue}>{value}</ThemedText>
    <ThemedText style={styles.statTitle}>{title}</ThemedText>
  </ThemedCard>
);

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },
});

export default StatCard;

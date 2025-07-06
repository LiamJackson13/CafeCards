/**
 * StatCard Component
 *
 * A reusable card component for displaying statistics with an icon, value, and title.
 * Used in profile screens to show user analytics and metrics.
 * Now supports custom colors and better theming.
 */
import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const StatCard = ({ title, value, icon, color, loading = false }) => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  // Ensure color is always defined with multiple fallbacks
  const safeColor = color || Colors.primary || "#4CAF50";

  if (loading) {
    return (
      <ThemedCard style={styles.statCard}>
        <View
          style={[
            styles.loadingIcon,
            { backgroundColor: (theme.text || "#999") + "20" },
          ]}
        />
        <View
          style={[
            styles.loadingValue,
            { backgroundColor: (theme.text || "#999") + "20" },
          ]}
        />
        <View
          style={[
            styles.loadingTitle,
            { backgroundColor: (theme.text || "#999") + "20" },
          ]}
        />
      </ThemedCard>
    );
  }

  return (
    <ThemedCard style={styles.statCard}>
      <View
        style={[styles.iconContainer, { backgroundColor: safeColor + "20" }]}
      >
        <ThemedText style={styles.statIcon}>{icon || "📊"}</ThemedText>
      </View>
      <ThemedText style={[styles.statValue, { color: safeColor }]}>
        {value || "0"}
      </ThemedText>
      <ThemedText
        style={styles.statTitle}
        numberOfLines={2}
        adjustsFontSizeToFit={false}
      >
        {title || "No Data"}
      </ThemedText>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    minHeight: 120,
    justifyContent: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 16,
    width: 65,
    minHeight: 32,
  },
  loadingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 12,
  },
  loadingValue: {
    width: 40,
    height: 24,
    borderRadius: 4,
    marginBottom: 6,
  },
  loadingTitle: {
    width: 60,
    height: 12,
    borderRadius: 4,
  },
});

export default StatCard;

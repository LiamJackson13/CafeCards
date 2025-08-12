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
  const { userTheme } = useTheme();
  const theme = Colors[userTheme] ?? Colors.light;

  // Ensure color is always defined with multiple fallback
  const safeColor = color || Colors.primary || "#4CAF50";

  if (loading) {
    return (
      <ThemedCard style={styles.statCard}>
        {/* Loading placeholder: icon background */}
        <View
          style={[
            styles.loadingIcon,
            { backgroundColor: (theme.text || "#999") + "20" },
          ]}
        />
        {/* Loading placeholder: value block */}
        <View
          style={[
            styles.loadingValue,
            { backgroundColor: (theme.text || "#999") + "20" },
          ]}
        />
        {/* Loading placeholder: title bar */}
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
      {/* Container for stat icon with tinted background */}
      <View
        style={[styles.iconContainer, { backgroundColor: safeColor + "20" }]}
      >
        {/* Display the stat icon or fallback emoji */}
        <ThemedText style={styles.statIcon}>{icon || "📊"}</ThemedText>
      </View>
      {/* Display the stat value prominently */}
      <ThemedText style={[styles.statValue, { color: safeColor }]}>
        {value || "0"}
      </ThemedText>
      {/* Display the stat title label (limited to two lines) */}
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
  // Card container for each statistic, centered content
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    minHeight: 120,
    justifyContent: "center",
  },
  // Circle container behind the stat icon
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  // Icon text size and alignment
  statIcon: {
    fontSize: 24,
  },
  // Bold large text for the stat value
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  // Title text styling with wrapping and subdued opacity
  statTitle: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 16,
    width: 65,
    minHeight: 32,
  },
  // Placeholder circle for loading icon state
  loadingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 12,
  },
  // Placeholder rectangle for loading value state
  loadingValue: {
    width: 40,
    height: 24,
    borderRadius: 4,
    marginBottom: 6,
  },
  // Placeholder bar for loading title state
  loadingTitle: {
    width: 60,
    height: 12,
    borderRadius: 4,
  },
});

export default StatCard;

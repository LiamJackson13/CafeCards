/**
 * ProfileOption Component
 *
 * A reusable card component for profile screen options.
 * Displays an icon, title, optional subtitle, and optional action component.
 */
import { StyleSheet, View } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const ProfileOption = ({ title, subtitle, icon, action }) => (
  <ThemedCard style={styles.optionCard}>
    <View style={styles.optionContent}>
      <View style={styles.optionLeft}>
        <ThemedText style={styles.optionIcon}>{icon}</ThemedText>
        <View style={styles.optionText}>
          <ThemedText style={styles.optionTitle}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={styles.optionSubtitle}>{subtitle}</ThemedText>
          )}
        </View>
      </View>
      {action && action}
    </View>
  </ThemedCard>
);

const styles = StyleSheet.create({
  // Card container for each profile option row
  optionCard: {
    marginBottom: 10,
    padding: 15,
  },
  // Horizontal layout: icon/text on left, action on right
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Left section wrapping icon and text
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  // Icon styling (size and spacing)
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  // Wrapper for title/subtitle texts
  optionText: {
    flex: 1,
  },
  // Main title text style
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  // Subtitle text style (smaller, faded)
  optionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default ProfileOption;

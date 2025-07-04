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
  optionCard: {
    marginBottom: 10,
    padding: 15,
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    opacity: 0.6,
  },
});

export default ProfileOption;

import { StyleSheet, View } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const AboutSection = () => {
  return (
    <>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        About
      </ThemedText>

      <ThemedCard style={styles.aboutCard}>
        <ThemedText style={styles.aboutTitle}>Cafe Cards</ThemedText>
        <ThemedText style={styles.aboutDescription}>
          Your digital wallet for cafe loyalty cards. Scan, save, and manage all
          your favorite cafe rewards in one convenient place.
        </ThemedText>
        <View style={styles.appInfo}>
          <ThemedText style={styles.appInfoText}>Version 1.0.0</ThemedText>
          <ThemedText style={styles.appInfoText}>•</ThemedText>
          <ThemedText style={styles.appInfoText}>Build 2025.1.1</ThemedText>
        </View>
      </ThemedCard>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  aboutCard: {
    padding: 20,
    alignItems: "center",
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  aboutDescription: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 15,
  },
  appInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appInfoText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default AboutSection;

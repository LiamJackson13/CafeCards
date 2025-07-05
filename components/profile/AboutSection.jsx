import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const AboutSection = () => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  return (
    <>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        About Cafe Cards
      </ThemedText>

      <ThemedCard style={styles.aboutCard}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.primary + "20" },
          ]}
        >
          <ThemedText style={styles.appIcon}>☕</ThemedText>
        </View>

        <ThemedText style={[styles.aboutTitle, { color: theme.text }]}>
          Your Digital Loyalty Companion
        </ThemedText>

        <ThemedText style={[styles.aboutDescription, { color: theme.text }]}>
          Collect stamps, earn rewards, and never lose a loyalty card again.
          Connect with your favorite cafes and enjoy a seamless reward
          experience.
        </ThemedText>

        <View style={styles.featuresList}>
          <FeatureItem icon="📱" text="Digital loyalty cards" theme={theme} />
          <FeatureItem
            icon="⭐"
            text="Automatic stamp tracking"
            theme={theme}
          />
          <FeatureItem icon="🎁" text="Easy reward redemption" theme={theme} />
          <FeatureItem icon="🌙" text="Dark & light themes" theme={theme} />
        </View>

        <View style={[styles.appInfo, { borderTopColor: theme.border }]}>
          <ThemedText style={[styles.appInfoText, { color: theme.text }]}>
            Version 1.0.0
          </ThemedText>
          <ThemedText style={[styles.appInfoText, { color: theme.text }]}>
            •
          </ThemedText>
          <ThemedText style={[styles.appInfoText, { color: theme.text }]}>
            Build 2025.1.1
          </ThemedText>
        </View>
      </ThemedCard>
    </>
  );
};

const FeatureItem = ({ icon, text, theme }) => (
  <View style={styles.featureItem}>
    <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
    <ThemedText style={[styles.featureText, { color: theme.text }]}>
      {text}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  aboutCard: {
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appIcon: {
    fontSize: 28,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  aboutDescription: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 20,
  },
  featuresList: {
    gap: 8,
    marginBottom: 20,
    alignSelf: "stretch",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  featureText: {
    fontSize: 14,
    opacity: 0.8,
  },
  appInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  appInfoText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default AboutSection;

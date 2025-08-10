import { StyleSheet, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

/**
 * AboutSection
 *
 * Shows app info, features, and version/build details.
 */
const AboutSection = () => {
  // Retrieve current theme key and resolve Colors object
  const { userTheme } = useTheme();
  // theme: object containing color definitions based on userTheme
  const theme = Colors[userTheme] ?? Colors.light;

  return (
    <>
      {/* Section subtitle header */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        About Cafe Cards
      </ThemedText>

      {/* Card container holding all about content */}
      <ThemedCard style={styles.aboutCard}>
        {/* App Icon display */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.primary + "20" }, // light background circle
          ]}
        >
          <ThemedText style={styles.appIcon}>☕</ThemedText>
        </View>

        {/* Main title below icon */}
        <ThemedText style={[styles.aboutTitle, { color: theme.text }]}>
          Your Digital Loyalty Companion
        </ThemedText>

        {/* Descriptive text about app features */}
        <ThemedText style={[styles.aboutDescription, { color: theme.text }]}>
          Collect stamps, earn rewards, and never lose a loyalty card again.
          Connect with your favorite cafes and enjoy a seamless reward
          experience.
        </ThemedText>

        {/* List of key features */}
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

        {/* Version and build info footer */}
        <View style={[styles.appInfo, { borderTopColor: theme.border }]}>
          <ThemedText style={[styles.appInfoText, { color: theme.text }]}>
            Version 1.0.0
          </ThemedText>
        </View>
      </ThemedCard>
    </>
  );
};

/**
 * FeatureItem
 *
 * Renders a single feature row with icon and text.
 */
const FeatureItem = ({ icon, text, theme }) => (
  // icon: emoji or symbol representing feature
  // text: description of the feature
  // theme: theme object for text color
  <View style={styles.featureItem}>
    {/* Feature icon */}
    <ThemedText style={styles.featureIcon}>{icon}</ThemedText>
    {/* Feature description text */}
    <ThemedText style={[styles.featureText, { color: theme.text }]}>
      {text}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  // Subtitle text for section header
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 15,
  },
  // Card wrapping all about-section content
  aboutCard: {
    padding: 24,
    alignItems: "center",
  },
  // Container for the app icon circle
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  // Emoji/icon styling inside icon container
  appIcon: {
    fontSize: 28,
  },
  // Title text under the icon
  aboutTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  // Paragraph describing app features
  aboutDescription: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 20,
  },
  // Wrapper for list of features
  featuresList: {
    gap: 8,
    marginBottom: 20,
    alignSelf: "stretch",
  },
  // Row layout for individual feature item
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  // Style for feature icon at row start
  featureIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  // Style for feature text description
  featureText: {
    fontSize: 14,
    opacity: 0.8,
  },
  // Container for version/build information on bottom
  appInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  // Text style for version and build labels
  appInfoText: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default AboutSection;

/**
 * Reward Success/Celebration Screen
 */
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const RewardSuccessScreen = () => {
  const router = useRouter();
  // Theme context: determine current theme mode and colors
  const { userTheme } = useTheme();
  // Get Route params: cafe name and reward type to display
  const { cafeName, rewardType } = useLocalSearchParams();

  const theme = Colors[userTheme] ?? Colors.light;

  // Determine display values with fallback defaults
  const displayCafeName = cafeName || "your favorite cafe";
  const displayRewardType = rewardType || "free coffee";

  // Animation values for scaling, fading, and sliding effects
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // Start celebration animation on component mount
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [scaleAnim, fadeAnim, slideAnim]);

  // Navigate back to cards list
  const handleBackToCards = () => router.push("/cards");
  // Navigate to user profile and stats
  const handleViewProfile = () => router.push("/profile");

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
      safe
    >
      <View style={styles.content}>
        {/* Animated celebration icon */}
        <Animated.View
          style={[
            styles.celebrationContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View
            style={[
              styles.celebrationCircle,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <ThemedText style={styles.celebrationIcon}>🎉</ThemedText>
          </View>
        </Animated.View>

        <Spacer height={40} />

        {/* Animated success message section */}
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ThemedText style={[styles.successTitle, { color: theme.text }]}>
            Reward Redeemed!
          </ThemedText>
          <Spacer height={16} />
          <ThemedText style={[styles.successSubtitle, { color: theme.text }]}>
            Your {displayRewardType} has been successfully redeemed
            {displayCafeName !== "your favorite cafe"
              ? ` at ${displayCafeName}`
              : ""}
            . Enjoy! ☕
          </ThemedText>
          <Spacer height={12} />
          <ThemedText
            style={[styles.thankYouText, { color: theme.text, opacity: 0.7 }]}
          >
            Thank you for your loyalty!
          </ThemedText>
        </Animated.View>

        <Spacer height={60} />

        {/* Action buttons: primary and secondary */}
        <Animated.View
          style={[
            styles.buttonsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ThemedButton
            onPress={handleBackToCards}
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
          >
            <ThemedText style={styles.primaryButtonText}>
              View My Cards
            </ThemedText>
          </ThemedButton>
          <Spacer height={16} />
          <ThemedButton
            onPress={handleViewProfile}
            style={[styles.secondaryButton, { borderColor: theme.border }]}
          >
            <ThemedText
              style={[styles.secondaryButtonText, { color: theme.text }]}
            >
              View Stats & Profile
            </ThemedText>
          </ThemedButton>
        </Animated.View>

        {/* Decorative background emojis for celebration effect */}
        <View style={styles.backgroundDecoration}>
          <ThemedText style={[styles.backgroundEmoji, { opacity: 0.1 }]}>
            ☕
          </ThemedText>
          <ThemedText
            style={[styles.backgroundEmoji, styles.emoji2, { opacity: 0.08 }]}
          >
            🎁
          </ThemedText>
          <ThemedText
            style={[styles.backgroundEmoji, styles.emoji3, { opacity: 0.06 }]}
          >
            ⭐
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // Full screen container for reward success presentation
  container: {
    flex: 1,
  },
  // Inner content wrapper: centering and padding
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    position: "relative",
  },
  // Wrapper for celebration icon animation
  celebrationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  // Circle styling behind celebration icon
  celebrationCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  // Celebration icon styling (emoji size)
  celebrationIcon: {
    fontSize: 60,
  },
  // Container for animated message text
  messageContainer: {
    alignItems: "center",
    maxWidth: width * 0.85,
  },
  // Title text style for success message
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  // Subtitle style for detailed success message
  successSubtitle: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
  },
  // Thank you text style for gratitude note
  thankYouText: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  // Container for action buttons stack
  buttonsContainer: {
    width: "100%",
    maxWidth: 280,
  },
  // Primary button styling for 'View My Cards'
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  // Text style inside primary button
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  // Secondary button styling for 'View Stats & Profile'
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  // Text style inside secondary button
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  // Full window overlay for background celebration emojis
  backgroundDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  // Base style for large background emojis
  backgroundEmoji: {
    fontSize: 120,
    position: "absolute",
  },
  // Position and size variation for second emoji
  emoji2: {
    top: -100,
    right: -40,
    fontSize: 80,
  },
  // Position and size variation for third emoji
  emoji3: {
    bottom: -80,
    left: -20,
    fontSize: 100,
  },
});

export default RewardSuccessScreen;

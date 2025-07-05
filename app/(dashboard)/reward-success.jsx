/**
 * Reward Success/Celebration Screen
 *
 * This screen is displayed after a customer successfully redeems a reward.
 * Features include:
 * - Celebration animation and visuals
 * - Confirmation message
 * - Navigation back to cards or continue shopping
 * - Themed design matching the app's aesthetic
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
  const { actualTheme } = useTheme();
  const { cafeName, rewardType } = useLocalSearchParams();

  const theme = Colors[actualTheme] ?? Colors.light;

  // Default values if params are not provided
  const displayCafeName = cafeName || "your favorite cafe";
  const displayRewardType = rewardType || "free coffee";

  // Animation values
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Start the celebration animation sequence
    const animationSequence = Animated.sequence([
      // Scale in the main celebration
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      // Fade in the content
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
    ]);

    animationSequence.start();
  }, [scaleAnim, fadeAnim, slideAnim]);

  const handleBackToCards = () => {
    router.push("/cards");
  };

  const handleViewProfile = () => {
    router.push("/profile");
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: theme.background }]}
      safe
    >
      <View style={styles.content}>
        {/* Main Celebration Icon */}
        <Animated.View
          style={[
            styles.celebrationContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
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

        {/* Success Message */}
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

        {/* Action Buttons */}
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

        {/* Coffee Animation Background */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    position: "relative",
  },
  celebrationContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
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
  celebrationIcon: {
    fontSize: 60,
  },
  messageContainer: {
    alignItems: "center",
    maxWidth: width * 0.85,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
  },
  thankYouText: {
    fontSize: 16,
    textAlign: "center",
    fontStyle: "italic",
  },
  buttonsContainer: {
    width: "100%",
    maxWidth: 280,
  },
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
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
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
  backgroundEmoji: {
    fontSize: 120,
    position: "absolute",
  },
  emoji2: {
    top: -100,
    right: -40,
    fontSize: 80,
  },
  emoji3: {
    bottom: -80,
    left: -20,
    fontSize: 100,
  },
});

export default RewardSuccessScreen;

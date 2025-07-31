import { useCallback, useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import ThemedCard from "./ThemedCard";
import ThemedText from "./ThemedText";

/**
 * RedemptionNotification
 *
 * Animated notification for reward redemption events.
 * Slides in from the top and auto-dismisses after 4 seconds.
 */
const RedemptionNotification = ({ visible, redemption, onDismiss }) => {
  // visible: controls display of the notification
  // redemption: object with redemption data (rewardsRedeemed, remainingRewards)
  // onDismiss: callback fired after notification hides
  const [slideAnim] = useState(new Animated.Value(-100));
  // slideAnim: animated value for vertical slide; starts off-screen
  const [opacityAnim] = useState(new Animated.Value(0));
  // opacityAnim: animated value for fade-in/out

  const hideNotification = useCallback(() => {
    // Animates slide up and fade out, then calls onDismiss
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100, // slide off top
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0, // fade out
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  }, [slideAnim, opacityAnim, onDismiss]);

  useEffect(() => {
    // Trigger slide-in and fade-in when visible, auto-hide after 4s
    if (visible && redemption) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // slide into view
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, // fade in
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        hideNotification();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      hideNotification();
    }
  }, [visible, redemption, slideAnim, opacityAnim, hideNotification]);

  if (!visible || !redemption) return null; // nothing to render

  return (
    // Animated container sliding vertically and fading
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }], // vertical movement
          opacity: opacityAnim, // fade
        },
      ]}
    >
      <ThemedCard style={styles.notification}>
        {" "}
        {/* Card background */}
        <View style={styles.content}>
          {" "}
          {/* Horizontal layout */}
          <View style={styles.iconContainer}>
            {" "}
            {/* Icon wrapper */}
            <ThemedText style={styles.icon}>🎉</ThemedText>{" "}
            {/* Celebration icon */}
          </View>
          <View style={styles.textContainer}>
            {" "}
            {/* Text info */}
            <ThemedText style={styles.title}>Reward Redeemed!</ThemedText>{" "}
            {/* Header */}
            <ThemedText style={styles.message}>
              {" "}
              {/* Primary message */}
              {redemption.rewardsRedeemed === 1
                ? "1 free coffee reward was just redeemed"
                : `${redemption.rewardsRedeemed} rewards were just redeemed`}
            </ThemedText>
            {redemption.remainingRewards > 0 && (
              <ThemedText style={styles.remaining}>
                {" "}
                {/* Remaining count */}
                {redemption.remainingRewards} reward
                {redemption.remainingRewards !== 1 ? "s" : ""} remaining
              </ThemedText>
            )}
          </View>
        </View>
      </ThemedCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Position the notification absolutely near top with margins
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000, // above other content
  },
  notification: {
    // ThemedCard style: light green background and left accent
    backgroundColor: "#e8f5e8",
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    // Inner layout: icon and text side-by-side
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconContainer: {
    // Wrapper around the emoji icon
    marginRight: 12,
  },
  icon: {
    // Icon size
    fontSize: 24,
  },
  textContainer: {
    // Vertical stack for title, message, remaining
    flex: 1,
  },
  title: {
    // Title text styling
    fontWeight: "bold",
    fontSize: 16,
    color: "#28a745",
    marginBottom: 2,
  },
  message: {
    // Main message text styling
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  remaining: {
    // Text for remaining rewards
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});

export default RedemptionNotification;

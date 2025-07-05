import { useCallback, useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import ThemedCard from "./ThemedCard";
import ThemedText from "./ThemedText";

const RedemptionNotification = ({ visible, redemption, onDismiss }) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible && redemption) {
      // Slide in from top
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        hideNotification();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      hideNotification();
    }
  }, [visible, redemption, slideAnim, opacityAnim, hideNotification]);

  const hideNotification = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  }, [slideAnim, opacityAnim, onDismiss]);

  if (!visible || !redemption) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <ThemedCard style={styles.notification}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <ThemedText style={styles.icon}>🎉</ThemedText>
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={styles.title}>Reward Redeemed!</ThemedText>
            <ThemedText style={styles.message}>
              {redemption.rewardsRedeemed === 1
                ? "1 free coffee reward was just redeemed"
                : `${redemption.rewardsRedeemed} rewards were just redeemed`}
            </ThemedText>
            {redemption.remainingRewards > 0 && (
              <ThemedText style={styles.remaining}>
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
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  notification: {
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
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#28a745",
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  remaining: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});

export default RedemptionNotification;

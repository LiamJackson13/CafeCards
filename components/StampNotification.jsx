import { useCallback, useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import ThemedCard from "./ThemedCard";
import ThemedText from "./ThemedText";

/**
 * StampNotification
 *
 * Animated notification for stamp addition events.
 * Slides in from the top and auto-dismisses after 3 seconds.
 */
const StampNotification = ({ visible, stampData, onDismiss }) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [opacityAnim] = useState(new Animated.Value(0));

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
    // Trigger slide-in and fade-in when visible, auto-hide after 3s
    if (visible && stampData) {
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

      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        hideNotification();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      hideNotification();
    }
  }, [visible, stampData, slideAnim, opacityAnim, hideNotification]);

  if (!visible || !stampData) return null; // nothing to render

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
        {/* Card background */}
        <View style={styles.content}>
          {/* Horizontal layout */}
          <View style={styles.iconContainer}>
            {/* Icon wrapper */}
            <ThemedText style={styles.icon}>⭐</ThemedText> {/* Stamp icon */}
          </View>
          <View style={styles.textContainer}>
            {/* Text info */}
            <ThemedText style={styles.title}>Stamp Added!</ThemedText>
            {/* Header */}
            <ThemedText style={styles.message}>
              {/* Primary message */}
              {stampData.stampsAdded === 1
                ? "1 stamp was added to your loyalty card"
                : `${stampData.stampsAdded} stamps were added to your loyalty card`}
            </ThemedText>
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
    // ThemedCard style: light blue background and left accent
    backgroundColor: "#e8f4f8",
    borderLeftWidth: 4,
    borderLeftColor: "#34b233",
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
    // Vertical stack for title, message, cafe name
    flex: 1,
  },
  title: {
    // Title text styling
    fontWeight: "bold",
    fontSize: 16,
    color: "#34b233",
    marginBottom: 2,
  },
  message: {
    // Main message text styling
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  cafeName: {
    // Text for cafe name
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});

export default StampNotification;

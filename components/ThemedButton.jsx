/**
 * Themed Button Component
 *
 * A reusable button component with consistent styling across the app.
 * Uses the app's primary brand color and provides press feedback with opacity changes.
 * Built on React Native's Pressable component for better touch handling.
 * Supports custom styling while maintaining consistent base button appearance.
 */

import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

/**
 * ThemedButton
 *
 * Reusable button that applies base styling and handles press feedback.
 * - style: additional custom styles merged after base/pressed styles
 * - children: content to render inside button (text, icons)
 * - ...props: other Pressable props (e.g., onPress, disabled)
 */
function ThemedButton({ style, children, ...props }) {
  return (
    <Pressable
      // style: combine base button, pressed feedback, and custom styles
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      {...props} // spread remaining Pressable props
    >
      {/* Render button content (text, icons, etc.) */}
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    // Base button: uses primary brand color, padding, and rounded corners
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    // Pressed state: reduce opacity for visual feedback
    opacity: 0.5,
  },
});

export default ThemedButton;

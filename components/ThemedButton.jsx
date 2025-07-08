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
 * @param {object} props
 * @param {object} [props.style] - Additional styles for the button
 * @param {React.ReactNode} [props.children] - Button content
 * @param {...any} props - Other Pressable props
 */
function ThemedButton({ style, children, ...props }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.5,
  },
});

export default ThemedButton;

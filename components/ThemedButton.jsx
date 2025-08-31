/**
 * Themed Button Component
 */

import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

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

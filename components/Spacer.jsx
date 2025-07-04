/**
 * Spacer Component
 *
 * A simple utility component for adding consistent spacing between UI elements.
 * Provides customizable width and height with sensible defaults (100% width, 40px height).
 * Used throughout the app to maintain consistent vertical and horizontal spacing
 * without adding custom margin/padding styles to individual components.
 */

import { View } from "react-native";

const Spacer = ({ width = "100%", height = 40 }) => {
  return (
    <View
      style={{
        width: width,
        height: height,
      }}
    />
  );
};

export default Spacer;

/**
 * Spacer Component
 */

import { View } from "react-native";

/**
 * Spacer
 *
 * @param {object} props
 * @param {number|string} [props.width="100%"] - Width of the spacer
 * @param {number} [props.height=40] - Height of the spacer
 */
const Spacer = ({ width = "100%", height = 40 }) => (
  // width: Width of the spacer (default full width)
  // height: Height of the spacer (default 40px)
  <View
    // Inline style drives the empty space size
    style={{ width, height }}
  />
);

export default Spacer;

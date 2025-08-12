import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "./ThemedText";

/**
 * IncrementDecrement
 *
 * A simple component for incrementing/decrementing a numeric value.
 * - Disables buttons at min/max.
 * - Shows current value.
 */
const IncrementDecrement = ({ value, setValue, min = 1, max = 10 }) => {
  const increment = () => {
    // Increase value by 1, until max limit
    if (value < max) {
      setValue(value + 1);
    }
  };

  const decrement = () => {
    // Decrease value by 1, respecting min limit
    if (value > min) {
      setValue(value - 1);
    }
  };

  return (
    // Wrapper for buttons and label
    <View style={styles.container}>
      {/* Decrement button: disabled at minimum */}
      <TouchableOpacity
        onPress={decrement}
        style={[styles.button, value <= min && styles.disabledButton]}
        disabled={value <= min}
        accessibilityLabel="Decrease value"
        accessibilityRole="button"
      >
        {/* Minus sign icon */}
        <ThemedText style={styles.buttonText}>-</ThemedText>
      </TouchableOpacity>

      {/* Display the current value */}
      <ThemedText style={styles.valueLabel}>{value}</ThemedText>

      {/* Increment button: disabled at maximum */}
      <TouchableOpacity
        onPress={increment}
        style={[styles.button, value >= max && styles.disabledButton]}
        disabled={value >= max}
        accessibilityLabel="Increase value"
        accessibilityRole="button"
      >
        {/* Plus sign icon */}
        <ThemedText style={styles.buttonText}>+</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container for buttons and value label
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Base style for both increment and decrement buttons
  button: {
    backgroundColor: "#ff5100ff",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  // Style applied when button is disabled (min/max reached)
  disabledButton: {
    backgroundColor: "#ccc",
  },
  // Text style inside the +/- buttons
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  // Styling for the central value display
  valueLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default IncrementDecrement;

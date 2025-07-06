import { StyleSheet, TouchableOpacity, View } from "react-native";
import ThemedText from "./ThemedText";

const IncrementDecrement = ({ value, setValue, min = 1, max = 10 }) => {
  const increment = () => {
    if (value < max) {
      setValue(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      setValue(value - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={decrement}
        style={[styles.button, value <= min && styles.disabledButton]}
        disabled={value <= min}
      >
        <ThemedText style={styles.buttonText}>-</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.valueLabel}>{value}</ThemedText>

      <TouchableOpacity
        onPress={increment}
        style={[styles.button, value >= max && styles.disabledButton]}
        disabled={value >= max}
      >
        <ThemedText style={styles.buttonText}>+</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 50,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  valueLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default IncrementDecrement;

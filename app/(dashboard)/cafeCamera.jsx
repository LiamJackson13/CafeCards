import { StyleSheet, View } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const CafeScannerScreen = () => {
  return (
    <ThemedView style={styles.container} safe>
      <ThemedText type="title" style={styles.title}>
        Scan Loyalty Card
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Position the loyalty card or QR code within the camera view
      </ThemedText>

      <Spacer size={20} />

      {/* Camera Scanner Placeholder */}
      <View style={styles.scannerContainer}>
        <View style={styles.scannerPlaceholder}>
          <ThemedText style={styles.placeholderText}>
            📷 Camera Scanner
          </ThemedText>
          <ThemedText style={styles.placeholderSubtext}>
            Scanner will be implemented here
          </ThemedText>
        </View>

        {/* Scanning Frame Overlay */}
        <View style={styles.scanningFrame} />
      </View>

      <Spacer size={30} />

      <View style={styles.instructions}>
        <ThemedText style={styles.instructionTitle}>Instructions:</ThemedText>
        <ThemedText style={styles.instructionText}>
          • Hold the card steady within the frame
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          • Ensure good lighting for best results
        </ThemedText>
        <ThemedText style={styles.instructionText}>
          • The card will be automatically detected
        </ThemedText>
      </View>

      <Spacer size={20} />

      <ThemedButton title="Manual Entry" style={styles.manualButton} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    fontSize: 16,
  },
  scannerContainer: {
    height: 300,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#000",
  },
  scannerPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  placeholderText: {
    fontSize: 24,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    opacity: 0.6,
  },
  scanningFrame: {
    position: "absolute",
    top: "25%",
    left: "15%",
    width: "70%",
    height: "50%",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  instructions: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
  },
  instructionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 5,
    opacity: 0.8,
  },
  manualButton: {
    marginTop: 10,
  },
});

export default CafeScannerScreen;

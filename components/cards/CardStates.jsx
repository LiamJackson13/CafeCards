// Core React Native components for layout and styling
import { StyleSheet, View } from "react-native";
// ThemedText: custom text component that adapts to app theme
import ThemedText from "../ThemedText";

/**
 * EmptyState Component
 *
 * Renders a placeholder UI when the card list is empty.
 * 
 */
const EmptyState = ({ isCafeUser }) => (
  <View style={styles.emptyContainer}>
    <ThemedText style={styles.emptyIcon}>{isCafeUser ? "📋" : "💳"}</ThemedText>
    <ThemedText style={styles.emptyTitle}>
      {isCafeUser ? "No Customer Cards Yet" : "No Loyalty Cards Yet"}
    </ThemedText>
    <ThemedText style={styles.emptyMessage}>
      {isCafeUser
        ? "When customers scan their QR codes, their loyalty cards will appear here."
        : "Start collecting loyalty cards by visiting participating cafes."}
    </ThemedText>
  </View>
);

/**
 * LoadingState Component
 *
 * Renders a placeholder text while the loyalty cards are being fetched.
 */
const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ThemedText style={styles.loadingText}>Loading cards...</ThemedText>
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    // Wrapper for the empty-state placeholder: centers content
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    // Large icon displayed in empty state
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    // Title text under the icon in empty state
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    // Supporting message text in empty state
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 24,
  },
  loadingContainer: {
    // Wrapper for the loading text: centers content
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    // Style for loading message text
    fontSize: 16,
    opacity: 0.7,
  },
});

export { EmptyState, LoadingState };

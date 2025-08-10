/**
 * DebugToggle Component
 *
 * A development-only component that allows switching between cafe and customer modes.
 * Only visible when __DEV__ is true.
 */
import { StyleSheet, Switch, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useUser } from "../../hooks/useUser";
import Spacer from "../Spacer";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const DebugToggle = () => {
  const { debugCafeMode, setDebugCafeMode, realIsCafeUser, user } = useUser();
  const { userTheme } = useTheme();
  const theme = Colors[userTheme] ?? Colors.light;

  // debugCafeMode: boolean override for cafe/customer mode in development
  // setDebugCafeMode: function to toggle the debugCafeMode state
  // realIsCafeUser: actual user role from backend to indicate auto-set state
  // user: user object, present when authenticated
  // theme: resolved color values based on active theme

  // Only render in development builds
  if (!__DEV__) {
    // Prevent debug controls from appearing in production
    return null;
  }

  return (
    <>
      <ThemedCard style={styles.debugCard}>
        {/* Debug panel card wrapper */}
        <View style={styles.debugContent}>
          {/* Container aligning icon/text and toggle switch */}
          <View style={styles.debugLeft}>
            {/* Icon indicating debug feature */}
            <ThemedText style={styles.debugIcon}>🐛</ThemedText>
            <View style={styles.debugText}>
              {/* Section title for global debug toggle */}
              <ThemedText style={styles.debugTitle}>
                Global Debug Mode
              </ThemedText>
              {/* Explanation subtitle, shows auto-set note when matching real role */}
              <ThemedText style={styles.debugSubtitle}>
                Switch app between Customer/Cafe
                {debugCafeMode === realIsCafeUser && user ? " (Auto-set)" : ""}
              </ThemedText>
            </View>
          </View>
          <View style={styles.debugToggleContainer}>
            {/* Label indicating current debug mode */}
            <ThemedText style={styles.debugLabel}>
              {debugCafeMode ? "Cafe" : "Customer"}
            </ThemedText>
            <Switch
              // value: current debug mode state
              value={debugCafeMode}
              // onValueChange: toggles debug mode via context setter
              onValueChange={setDebugCafeMode}
              // trackColor: off/on background colors for switch track
              trackColor={{
                false: theme.iconColor,
                true: Colors.primary,
              }}
              // thumbColor: color of the switch thumb knob
              thumbColor={debugCafeMode ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
      </ThemedCard>
      {/* Spacer below debug toggle for visual separation */}
      <Spacer size={20} />
    </>
  );
};

const styles = StyleSheet.create({
  // Top-level card for debug toggle, styled to stand out in dev
  debugCard: {
    padding: 15,
    backgroundColor: "#fff3cd",
    borderColor: "#ffeaa7",
    borderWidth: 1,
    borderRadius: 10,
  },
  // Layout of debug card content: space-between left and right
  debugContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Container for icon and text on left side
  debugLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  // Style for the bug icon
  debugIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  // Wrapper for title and subtitle texts
  debugText: {
    flex: 1,
  },
  // Title text style for debug section
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 2,
  },
  // Subtitle text style explaining toggle behavior
  debugSubtitle: {
    fontSize: 12,
    color: "#856404",
    opacity: 0.8,
  },
  // Container for switch and its label
  debugToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Label text next to the switch control
  debugLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#856404",
    minWidth: 50,
    textAlign: "right",
  },
});

export default DebugToggle;

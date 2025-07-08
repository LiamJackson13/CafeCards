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
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  // Only render in development mode
  if (!__DEV__) {
    return null;
  }

  return (
    <>
      <ThemedCard style={styles.debugCard}>
        <View style={styles.debugContent}>
          <View style={styles.debugLeft}>
            <ThemedText style={styles.debugIcon}>🐛</ThemedText>
            <View style={styles.debugText}>
              <ThemedText style={styles.debugTitle}>
                Global Debug Mode
              </ThemedText>
              <ThemedText style={styles.debugSubtitle}>
                Switch app between Customer/Cafe
                {debugCafeMode === realIsCafeUser && user ? " (Auto-set)" : ""}
              </ThemedText>
            </View>
          </View>
          <View style={styles.debugToggleContainer}>
            <ThemedText style={styles.debugLabel}>
              {debugCafeMode ? "Cafe" : "Customer"}
            </ThemedText>
            <Switch
              value={debugCafeMode}
              onValueChange={setDebugCafeMode}
              trackColor={{
                false: theme.iconColor,
                true: Colors.primary,
              }}
              thumbColor={debugCafeMode ? "#fff" : "#f4f3f4"}
            />
          </View>
        </View>
      </ThemedCard>
      <Spacer size={20} />
    </>
  );
};

const styles = StyleSheet.create({
  debugCard: {
    padding: 15,
    backgroundColor: "#fff3cd",
    borderColor: "#ffeaa7",
    borderWidth: 1,
    borderRadius: 10,
  },
  debugContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  debugLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  debugIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  debugText: {
    flex: 1,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 2,
  },
  debugSubtitle: {
    fontSize: 12,
    color: "#856404",
    opacity: 0.8,
  },
  debugToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  debugLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#856404",
    minWidth: 50,
    textAlign: "right",
  },
});

export default DebugToggle;

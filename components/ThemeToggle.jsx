/**
 * ThemeToggle
 *
 * Allows users to switch between light and dark themes.
 * Uses native Switch on mobile, custom switch on web.
 * Integrates with ThemeContext to persist and apply theme changes.
 */
import {
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";
import ThemedText from "./ThemedText";

const ThemeToggle = () => {
  const { themeMode, actualTheme, changeTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  const toggleTheme = () => {
    if (themeMode === "light") {
      changeTheme("dark");
    } else {
      changeTheme("light");
    }
  };

  const getThemeLabel = () => {
    return themeMode === "dark" ? "Dark" : "Light";
  };

  const isOn = actualTheme === "dark";

  // Use native Switch on iOS/Android, custom switch on web
  const renderSwitch = () => {
    if (Platform.OS === "web") {
      return (
        <TouchableOpacity
          style={[
            styles.switchContainer,
            {
              backgroundColor: isOn ? theme.text : theme.text + "40",
            },
          ]}
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.thumb,
              {
                backgroundColor: theme.background,
                transform: [{ translateX: isOn ? 24 : 2 }],
              },
            ]}
          />
        </TouchableOpacity>
      );
    }

    return (
      <Switch
        value={isOn}
        onValueChange={toggleTheme}
        trackColor={{
          false: theme.text + "40",
          true: theme.text + "60",
        }}
        thumbColor={theme.text}
        ios_backgroundColor={theme.text + "40"}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Theme: {getThemeLabel()}</ThemedText>
      {renderSwitch()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  switchContainer: {
    width: 56,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.05)",
  },
});

export default ThemeToggle;

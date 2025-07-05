import { useState } from "react";
import { ScrollView, StyleSheet, Switch, View } from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const CafeSettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoScan, setAutoScan] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const SettingRow = ({ title, subtitle, value, onValueChange, icon }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <View style={styles.settingHeader}>
          <ThemedText style={styles.settingIcon}>{icon}</ThemedText>
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        </View>
        {subtitle && (
          <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        style={styles.switch}
      />
    </View>
  );

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          Cafe Settings
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Customize your cafe loyalty card experience
        </ThemedText>

        <Spacer size={20} />

        {/* Notification Settings */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Notifications
          </ThemedText>

          <SettingRow
            title="Push Notifications"
            subtitle="Get notified about card activity and offers"
            value={notifications}
            onValueChange={setNotifications}
            icon="🔔"
          />

          <SettingRow
            title="Sound Effects"
            subtitle="Play sounds for successful scans"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            icon="🔊"
          />

          <SettingRow
            title="Vibration"
            subtitle="Vibrate on successful card scans"
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            icon="📳"
          />
        </ThemedCard>

        <Spacer size={15} />

        {/* Scanning Settings */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Scanning
          </ThemedText>

          <SettingRow
            title="Auto-Scan Mode"
            subtitle="Automatically scan when camera opens"
            value={autoScan}
            onValueChange={setAutoScan}
            icon="📷"
          />
        </ThemedCard>

        <Spacer size={15} />

        {/* Data Management */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Data Management
          </ThemedText>

          <View style={styles.dataButtons}>
            <ThemedButton
              title="Export Data"
              style={[styles.dataButton, styles.exportButton]}
            />

            <ThemedButton
              title="Clear All Data"
              style={[styles.dataButton, styles.clearButton]}
            />
          </View>
        </ThemedCard>

        <Spacer size={15} />

        {/* App Information */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            App Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Version:</ThemedText>
            <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Build:</ThemedText>
            <ThemedText style={styles.infoValue}>2025.1.1</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Last Updated:</ThemedText>
            <ThemedText style={styles.infoValue}>July 4, 2025</ThemedText>
          </View>
        </ThemedCard>

        <Spacer size={20} />

        {/* Reset Settings */}
        <ThemedButton title="Reset All Settings" style={styles.resetButton} />

        <Spacer size={30} />
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    fontWeight: "600",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginLeft: 28,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  dataButtons: {
    gap: 10,
  },
  dataButton: {
    marginVertical: 5,
  },
  exportButton: {
    backgroundColor: "#007AFF",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  resetButton: {
    backgroundColor: "#FF9500",
    marginHorizontal: 20,
  },
});

export default CafeSettingsScreen;

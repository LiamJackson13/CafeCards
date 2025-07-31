/**
 * Cafe Design Settings Screen
 *
 * Allows cafe owners to customize their loyalty card appearance and info.
 * Features:
 * - Edit cafe name, location, description, reward, and stamp requirements
 * - Choose card/stamp colors and icons
 * - Card style options (border radius, shadow)
 * - Loads and saves design to backend
 */
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedCard from "../../components/ThemedCard";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import { useUser } from "../../hooks/useUser";
import {
  createCafeProfile,
  getCafeProfile,
  updateCafeProfile,
} from "../../lib/appwrite/cafe-profiles";

const colorOptions = [
  "#AA7C48", // Coffee Brown
  "#E74C3C", // Red
  "#3498DB", // Blue
  "#2ECC71", // Green
  "#9B59B6", // Purple
  "#F39C12", // Orange
  "#1ABC9C", // Teal
  "#34495E", // Dark Blue
  "#E67E22", // Orange
  "#95A5A6", // Gray
];

const stampIcons = ["⭐", "☕", "💫", "🎯", "💎", "🏆", "❤️", "🎁", "🌟", "✨"];

const CafeDesignSettings = () => {
  // Auth hook: get current user and name-update function
  const { user, updateName } = useUser();
  // Loading state: indicates profile fetch in progress
  const [loading, setLoading] = useState(true);
  // Saving state: indicates save operation in progress
  const [saving, setSaving] = useState(false);
  // Profile state: stores fetched cafe design settings
  const [profile, setProfile] = useState(null);

  // Form state: cafe name, location, description, colors, icon, reward, stamps, layout options
  const [cafeName, setCafeName] = useState(
    // Default to auth user's name or email prefix
    user?.name || user?.email?.split("@")[0] || ""
  );
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#AA7C48");
  const [secondaryColor, setSecondaryColor] = useState("#7B6F63");
  const [backgroundColor, setBackgroundColor] = useState("#FDF3E7");
  const [textColor, setTextColor] = useState("#3B2F2F");
  const [stampIcon, setStampIcon] = useState("⭐");
  const [stampIconColor, setStampIconColor] = useState("#FFD700");
  const [rewardDescription, setRewardDescription] = useState("Free Coffee");
  const [maxStampsPerCard, setMaxStampsPerCard] = useState(10);
  const [borderRadius, setBorderRadius] = useState(15);
  const [shadowEnabled, setShadowEnabled] = useState(true);

  /**
   * loadCafeProfile: fetches existing design settings for this cafe
   * and populates local state, falling back to defaults on error.
   */
  const loadCafeProfile = useCallback(async () => {
    if (!user?.$id) return;
    try {
      setLoading(true);
      const cafeProfile = await getCafeProfile(user.$id);
      if (cafeProfile) {
        setProfile(cafeProfile);
        setCafeName(cafeProfile.cafeName || "");
        setLocation(cafeProfile.location || "");
        setDescription(cafeProfile.description || "");
        setPrimaryColor(cafeProfile.primaryColor || "#AA7C48");
        setSecondaryColor(cafeProfile.secondaryColor || "#7B6F63");
        setBackgroundColor(cafeProfile.backgroundColor || "#FDF3E7");
        setTextColor(cafeProfile.textColor || "#3B2F2F");
        setStampIcon(cafeProfile.stampIcon || "⭐");
        setStampIconColor(cafeProfile.stampIconColor || "#FFD700");
        setRewardDescription(cafeProfile.rewardDescription || "Free Coffee");
        setMaxStampsPerCard(cafeProfile.maxStampsPerCard || 10);
        setBorderRadius(cafeProfile.borderRadius || 15);
        setShadowEnabled(cafeProfile.shadowEnabled !== false);
      } else {
        // No profile yet: default cafeName to auth user's name or email prefix
        setProfile(null);
        setCafeName(user.name || user.email.split("@")[0] || "");
      }
    } catch (error) {
      console.error("Error loading cafe profile:", error);
      Alert.alert("Error", "Failed to load cafe profile");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Effect: trigger profile load on mount or when user changes
  useEffect(() => {
    loadCafeProfile();
  }, [user, loadCafeProfile]);

  /**
   * saveProfile: sends updated design settings to backend,
   * creates or updates profile, and updates auth name.
   */
  const saveProfile = async () => {
    if (!user?.$id) return;
    try {
      setSaving(true);
      const profileData = {
        cafeName,
        location,
        description,
        primaryColor,
        secondaryColor,
        backgroundColor,
        textColor,
        stampIcon,
        stampIconColor,
        rewardDescription,
        maxStampsPerCard: parseInt(maxStampsPerCard) || 10,
        borderRadius: parseInt(borderRadius) || 15,
        shadowEnabled,
      };
      let result;
      if (profile?.$id) {
        result = await updateCafeProfile(profile.$id, profileData);
      } else {
        result = await createCafeProfile(profileData, user.$id);
        setProfile(result);
      }
      // Also update auth profile name to match cafe name
      if (updateName && cafeName) {
        await updateName(cafeName);
      }
      Alert.alert("Success", "Cafe design settings saved successfully!");
    } catch (error) {
      console.error("Error saving cafe profile:", error);
      Alert.alert("Error", "Failed to save cafe design settings");
    } finally {
      setSaving(false);
    }
  };

  // Render loading placeholder while profile data is being fetched
  if (loading) {
    return (
      <ThemedView style={styles.container} safe>
        <ThemedText>Loading cafe settings...</ThemedText>
      </ThemedView>
    );
  }

  // Main render: scrollable settings form
  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: page title and description */}
        <ThemedText type="title" style={styles.title}>
          Cafe Design Settings
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Customize how your loyalty cards look to customers
        </ThemedText>
        <Spacer size={20} />

        {/* Basic Information section: name, location, description, reward, stamps-required */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Basic Information
          </ThemedText>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Cafe Name *</ThemedText>
            <TextInput
              style={styles.textInput}
              value={cafeName}
              onChangeText={setCafeName}
              placeholder="Enter your cafe name"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Location</ThemedText>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g. Downtown, Sydney"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description of your cafe"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Reward Description</ThemedText>
            <TextInput
              style={styles.textInput}
              value={rewardDescription}
              onChangeText={setRewardDescription}
              placeholder="e.g. Free Coffee, 10% Discount"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Stamps Required for Reward
            </ThemedText>
            <TextInput
              style={styles.textInput}
              value={maxStampsPerCard.toString()}
              onChangeText={(text) => setMaxStampsPerCard(parseInt(text) || 10)}
              placeholder="10"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </ThemedCard>

        <Spacer size={15} />

        {/* Colors section: pick primary, secondary, background, and text colors */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Colors
          </ThemedText>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Primary Color</ThemedText>
            <View style={styles.colorSelector}>
              <View
                style={[styles.colorPreview, { backgroundColor: primaryColor }]}
              />
              <View style={styles.colorOptions}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      primaryColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setPrimaryColor(color)}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Secondary Color</ThemedText>
            <View style={styles.colorSelector}>
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: secondaryColor },
                ]}
              />
              <View style={styles.colorOptions}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      secondaryColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSecondaryColor(color)}
                  />
                ))}
              </View>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Background Color</ThemedText>
            <View style={styles.colorSelector}>
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: backgroundColor },
                ]}
              />
              <TextInput
                style={styles.colorInput}
                value={backgroundColor}
                onChangeText={setBackgroundColor}
                placeholder="#FDF3E7"
                placeholderTextColor="#999"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Text Color</ThemedText>
            <View style={styles.colorSelector}>
              <View
                style={[styles.colorPreview, { backgroundColor: textColor }]}
              />
              <TextInput
                style={styles.colorInput}
                value={textColor}
                onChangeText={setTextColor}
                placeholder="#3B2F2F"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </ThemedCard>

        <Spacer size={15} />

        {/* Stamp Icon section: choose icon and icon color */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Stamp Icon
          </ThemedText>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Choose Stamp Icon</ThemedText>
            <View style={styles.iconSelector}>
              {stampIcons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconOption,
                    stampIcon === icon && styles.selectedIcon,
                  ]}
                  onPress={() => setStampIcon(icon)}
                >
                  <ThemedText style={styles.iconText}>{icon}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Stamp Icon Color</ThemedText>
            <View style={styles.colorSelector}>
              <View
                style={[
                  styles.colorPreview,
                  { backgroundColor: stampIconColor },
                ]}
              />
              <View style={styles.colorOptions}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      stampIconColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setStampIconColor(color)}
                  />
                ))}
              </View>
            </View>
          </View>
        </ThemedCard>

        <Spacer size={15} />

        {/* Card Style section: border radius and shadow toggle */}
        <ThemedCard style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Card Style
          </ThemedText>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Border Radius</ThemedText>
            <TextInput
              style={styles.textInput}
              value={borderRadius.toString()}
              onChangeText={(text) => setBorderRadius(parseInt(text) || 15)}
              placeholder="15"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingTitle}>Shadow Effect</ThemedText>
              <ThemedText style={styles.settingSubtitle}>
                Add shadow to cards for depth
              </ThemedText>
            </View>
            <Switch value={shadowEnabled} onValueChange={setShadowEnabled} />
          </View>
        </ThemedCard>

        <Spacer size={30} />

        {/* Save button: apply and persist design changes */}
        <ThemedButton
          onPress={saveProfile}
          disabled={saving || !cafeName.trim()}
          style={[
            styles.saveButton,
            { backgroundColor: primaryColor },
            (!cafeName.trim() || saving) && styles.disabledButton,
          ]}
        >
          <ThemedText style={styles.saveButtonText}>
            {saving ? "Saving..." : "Save Design Settings"}
          </ThemedText>
        </ThemedButton>

        <Spacer size={30} />
      </ScrollView>
    </ThemedView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // Full-screen container for design settings UI
  container: { flex: 1 },
  // Enables scrolling for long form
  scrollView: { flex: 1 },
  // Large bold title at top
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  // Subtitle text under title
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  // Wrapper for each form section card
  section: {
    margin: 15,
    padding: 20,
  },
  // Title text for each section
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  // Groups inputs with spacing
  inputGroup: {
    marginBottom: 15,
  },
  // Label text for form fields
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  // Standard text input styling
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  // Extended multiline text input
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  // Row layout for color selection controls
  colorSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // Circle preview of selected color
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  // Container for color option bubbles
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    flex: 1,
  },
  // Individual color bubble option
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "transparent",
  },
  // Highlight border for selected color
  selectedColor: {
    borderColor: "#000",
  },
  // Input for manual color code entry
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  // Layout for icon selection
  iconSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  // Individual icon option circle
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  // Highlight styling for chosen icon
  selectedIcon: {
    borderColor: "#AA7C48",
    backgroundColor: "#AA7C48" + "20",
  },
  // Icon text size
  iconText: {
    fontSize: 24,
  },
  // Row layout for card style toggles (shadow)
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  // Container for setting explanation text
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  // Title text for individual setting
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  // Subtitle text for setting description
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  // Save button styling wrapper
  saveButton: {
    marginHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
  },
  // Disabled button overlay style
  disabledButton: {
    opacity: 0.5,
  },
  // Text style for save button label
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CafeDesignSettings;

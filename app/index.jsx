/**
 * Home/Landing Screen
 */

// Imports
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import Spacer from "../components/Spacer";
import ThemedButton from "../components/ThemedButton";
import ThemedLoader from "../components/ThemedLoader";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";
import { useCafeUser, useUser } from "../hooks/useUser";

export default function Index() {
  // Auth context: indicates when initial authentication check completes
  const { authChecked } = useUser();
  const router = useRouter();
  // Role check: determines if user is a cafe owner
  const isCafeUser = useCafeUser();
  const { user } = useUser();
  const { userTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const theme = Colors[userTheme] ?? Colors.light;

  // Effect: hide loader once authentication check finishes
  useEffect(() => {
    if (authChecked) setIsLoading(false);
  }, [authChecked]);

  // Handler: navigate to appropriate dashboard or prompt login
  const handleDashboardNavigation = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (isCafeUser) {
      router.push("/(dashboard)/cafeCamera");
    } else {
      router.push("/(dashboard)/cards");
    }
  };

  // Handlers: quick navigation to login or registration screens
  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");

  if (isLoading) {
    return (
      <ThemedView style={styles.container} safe>
        {/* Initial loader while checking auth status */}
        <ThemedLoader />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safe>
      {/* StatusBar adapts to theme */}
      <StatusBar
        barStyle={userTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      {/* Hero Section: app title and description */}
      <View style={styles.heroSection}>
        <View style={styles.logoContainer}>
          <ThemedText style={styles.logoEmoji}>☕</ThemedText>
          <ThemedText style={styles.title}>Cafe Cards</ThemedText>
        </View>
        <Spacer size={16} />
        <ThemedText style={styles.subtitle}>
          Simplifying Cafe Loyalty Cards
        </ThemedText>
        <Spacer size={8} />
        <ThemedText style={styles.description}>
          Collect stamps and earn rewards at your favorite cafes.
        </ThemedText>
      </View>

      <Spacer size={40} />

      {/* Features Section: highlights app capabilities */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>📱</ThemedText>
          <ThemedText style={styles.featureText}>Digital Cards</ThemedText>
        </View>
        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>🎁</ThemedText>
          <ThemedText style={styles.featureText}>Earn Rewards</ThemedText>
        </View>
      </View>

      <Spacer size={60} />

      {/* Action Buttons: dashboard, login or register based on auth */}
      <View style={styles.buttonsContainer}>
        {user ? (
          <ThemedButton
            onPress={handleDashboardNavigation}
            style={[styles.primaryButton, { backgroundColor: Colors.primary }]}
          >
            <ThemedText style={styles.primaryButtonText}>
              {isCafeUser ? "Open Cafe Dashboard" : "View My Cards"}
            </ThemedText>
          </ThemedButton>
        ) : (
          <>
            <ThemedButton
              onPress={handleLogin}
              style={[
                styles.primaryButton,
                { backgroundColor: Colors.primary },
              ]}
            >
              <ThemedText style={styles.primaryButtonText}>
                Get Started
              </ThemedText>
            </ThemedButton>
            <Spacer size={12} />
            <ThemedButton
              onPress={handleRegister}
              style={[styles.secondaryButton, { borderColor: Colors.primary }]}
            >
              <ThemedText
                style={[styles.secondaryButtonText, { color: Colors.primary }]}
              >
                Create Account
              </ThemedText>
            </ThemedButton>
          </>
        )}
      </View>

      <Spacer size={40} />

      {/* Footer: welcome message or call to action */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          {user
            ? `Welcome back${isCafeUser ? ", Cafe Manager" : ""}!`
            : "Join thousands of happy customers"}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

// Styles
const styles = StyleSheet.create({
  // Main container wrapping all content
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  // Hero section: centered title and description padding
  heroSection: {
    alignItems: "center",
    paddingTop: 40,
  },
  // Logo wrapper for title emoji and text
  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  // Large emoji logo styling
  logoEmoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  // Main title text style
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.primary,
  },
  // Subtitle text under the title
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.8,
  },
  // Description text styling
  description: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  // Features row layout
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  // Individual feature item styling
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  // Feature icon size and spacing
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  // Feature label text
  featureText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  // Buttons container padding
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  // Primary action button styling
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Text inside primary button
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Secondary button (register) styling
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
  },
  // Text inside secondary button
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Footer container alignment and padding
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  // Footer text styling
  footerText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
});

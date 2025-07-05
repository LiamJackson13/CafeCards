/**
 * Home/Landing Screen
 *
 * This is the main entry point screen for the Cafe Cards app.
 * Displays the app title, description, and navigation links to key sections
 * including login, registration, cards dashboard, and teams management.
 * Serves as a simple navigation hub for users to access different app features.
 */
import { useRouter } from "expo-router";
import { StatusBar, StyleSheet, View } from "react-native";
import Spacer from "../components/Spacer";
import ThemedButton from "../components/ThemedButton";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";
import { useCafeUser } from "../hooks/useCafeUser";
import { useUser } from "../hooks/useUser";

export default function Index() {
  const router = useRouter();
  const isCafeUser = useCafeUser();
  const { user } = useUser();
  const { actualTheme } = useTheme();

  const theme = Colors[actualTheme] ?? Colors.light;

  const handleDashboardNavigation = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Route to appropriate default screen based on user type
    if (isCafeUser) {
      router.push("/(dashboard)/cafeSettings");
    } else {
      router.push("/(dashboard)/cards");
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <ThemedView style={styles.container} safe>
      <StatusBar
        barStyle={actualTheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      {/* Hero Section */}
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
          Collect stamps, earn rewards, and discover your favorite cafes all in
          one place.
        </ThemedText>
      </View>

      <Spacer size={40} />

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>📱</ThemedText>
          <ThemedText style={styles.featureText}>Digital Cards</ThemedText>
        </View>
        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>🎁</ThemedText>
          <ThemedText style={styles.featureText}>Earn Rewards</ThemedText>
        </View>
        <View style={styles.featureItem}>
          <ThemedText style={styles.featureIcon}>📍</ThemedText>
          <ThemedText style={styles.featureText}>Find Cafes</ThemedText>
        </View>
      </View>

      <Spacer size={60} />

      {/* Action Buttons */}
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

      {/* Footer */}
      <Spacer size={40} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  heroSection: {
    alignItems: "center",
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  logoEmoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
  },
});

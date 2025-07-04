/**
 * Home/Landing Screen
 *
 * This is the main entry point screen for the Cafe Cards app.
 * Displays the app title, description, and navigation links to key sections
 * including login, registration, cards dashboard, and teams management.
 * Serves as a simple navigation hub for users to access different app features.
 */
import { Link, useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import { useCafeUser } from "../hooks/useCafeUser";
import { useUser } from "../hooks/useUser";

export default function Index() {
  const router = useRouter();
  const isCafeUser = useCafeUser();
  const { user } = useUser();

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
  return (
    <ThemedView style={styles.container} safe>
      {/* <Image source={Logo} style={styles.img} /> */}
      <ThemedText style={styles.title} title>
        Cafe Cards
      </ThemedText>
      <ThemedText>Simplifying Cafe Loyalty Cards</ThemedText>
      <Link href={"/login"} style={styles.link}>
        <ThemedText>Login Page</ThemedText>
      </Link>
      <Link href={"/register"} style={styles.link}>
        <ThemedText>Register Page</ThemedText>
      </Link>
      <Pressable onPress={handleDashboardNavigation} style={styles.link}>
        <ThemedText>
          {user ? (isCafeUser ? "Cafe Dashboard" : "Cards Page") : "Cards Page"}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  img: {
    marginVertical: 20,
  },
  link: {
    textDecorationLine: "underline",
  },
});

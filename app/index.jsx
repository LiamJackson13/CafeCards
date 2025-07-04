import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";

export default function Index() {
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
      <Link href={"/cards"} style={styles.link}>
        <ThemedText>Cards Page</ThemedText>
      </Link>
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

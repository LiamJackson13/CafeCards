import { useRouter } from "expo-router";
import { ImageBackground, StyleSheet, Text } from "react-native";
import ThemedButton from "../components/ThemedButton";
import ThemedView from "../components/ThemedView";

const ComingSoon = () => {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../assets/images/coming-soon.jpg")}
      style={styles.background}
    >
      <ThemedView style={styles.container}>
        <Text style={styles.title}>Coming Soon</Text>

        <ThemedButton
          title="Go Back"
          onPress={() => router.back()}
          style={{ backgroundColor: "rgba(72, 255, 0, 0.66)" }}
        >
          <Text style={{ color: "white" }}>Go Back</Text>
        </ThemedButton>
      </ThemedView>
    </ImageBackground>
  );
};

export default ComingSoon;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
});

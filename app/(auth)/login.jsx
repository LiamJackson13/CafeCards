import { Link } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useUser } from "../../hooks/useUser";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useUser();

  const handleSubmit = async () => {
    setError(null);
    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : undefined}
    >
      <ThemedView style={styles.container}>
        <Spacer />
        <ThemedText title style={styles.title}>
          Login to Your Account
        </ThemedText>
        <ThemedTextInput
          placeholder="Email"
          style={[
            {
              width: "80%",
              marginBottom: 20,
            },
            styles.input,
          ]}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <ThemedTextInput
          placeholder="Password"
          secureTextEntry
          style={{
            width: "80%",
            marginBottom: 20,
          }}
          onChangeText={setPassword}
          value={password}
        />
        <ThemedButton onPress={handleSubmit} style={styles.btn}>
          <Text style={{ color: "#f2f2f2" }}>Login</Text>
        </ThemedButton>
        <Spacer />
        {error && <Text style={styles.error}>{error}</Text>}
        <Spacer height={100} />
        <Link href="/register">
          <ThemedText style={{ textAlign: "center" }}>
            Register Instead
          </ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web" && {
      minHeight: "100vh",
      paddingVertical: 20,
      width: "100%",
    }),
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 35,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: "#f5c1c8",
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  input: {
    padding: 20,
    borderRadius: 6,
    alignSelf: "stretch",
    marginHorizontal: 40,
    ...(Platform.OS === "web" && {
      maxWidth: 400,
      width: "calc(100% - 80px)",
      boxSizing: "border-box",
      alignSelf: "center",
    }),
  },
});

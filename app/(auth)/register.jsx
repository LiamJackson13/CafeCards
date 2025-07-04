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

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { register } = useUser();

  const handleSubmit = async () => {
    setError(null);
    try {
      await register(email, password);
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
          Register for an Account
        </ThemedText>
        <ThemedTextInput
          placeholder="Email"
          style={{
            width: "80%",
            marginBottom: 20,
          }}
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
        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: "#f2f2f2" }}>Register</Text>
        </ThemedButton>
        <Spacer />
        {error && <Text style={styles.error}>{error}</Text>}
        <Spacer height={100} />
        <Link href="/login">
          <ThemedText style={{ textAlign: "center" }}>
            Already have an account? Login Instead
          </ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
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
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
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
    ...(Platform.OS === "web" && {
      maxWidth: 400,
      width: "calc(100% - 80px)",
      boxSizing: "border-box",
      alignSelf: "center",
    }),
  },
});

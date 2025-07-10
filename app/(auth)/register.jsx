/**
 * User Registration Screen
 *
 * Allows new users to create an account.
 * Features:
 * - Email/password input with validation
 * - Error display
 * - Integration with UserContext for registration/login
 * - Navigation to login screen
 * - Responsive, themed design
 */
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

  // Handles registration and error state
  const handleSubmit = async () => {
    setError(null);
    try {
      await register(email, password);
    } catch (error) {
      setError(error?.message || "Registration failed.");
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : undefined}
      accessible={false}
    >
      <ThemedView style={styles.container}>
        <Spacer />
        <ThemedText title style={styles.title}>
          Register for an Account
        </ThemedText>
        <ThemedTextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
        />
        <ThemedTextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          style={styles.input}
        />
        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: "#f2f2f2" }}>Register</Text>
        </ThemedButton>
        <Spacer />
        {error && <Text style={styles.error}>{error}</Text>}
        <Spacer height={100} />
        <Link href="/login">
          <ThemedText style={styles.link}>
            Already have an account? Login Instead
          </ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;

// Styles grouped and documented for clarity
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // Responsive web adjustments
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
  link: {
    textAlign: "center",
  },
  input: {
    width: "80%",
    marginBottom: 20,
    ...(Platform.OS === "web" && {
      maxWidth: 400,
      width: "calc(100% - 80px)",
      boxSizing: "border-box",
      alignSelf: "center",
    }),
  },
});

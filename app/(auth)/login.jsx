/**
 * User Login Screen
 *
 * UI for user authentication:
 * - Email/password input with validation
 * - Error display
 * - Navigation to registration
 * - Responsive, themed design
 */

import { Link } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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

// Shared constants for layout
const INPUT_WIDTH = "80%";
const INPUT_MARGIN_BOTTOM = 20;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useUser();

  // Memoized submit handler
  const handleSubmit = useCallback(async () => {
    setError(null);
    try {
      await login(email, password);
    } catch (error) {
      setError(error.message);
    }
  }, [email, password, login]);

  // Memoized styles for performance
  const inputStyle = useMemo(
    () => [
      {
        width: INPUT_WIDTH,
        marginBottom: INPUT_MARGIN_BOTTOM,
      },
      styles.input,
    ],
    []
  );

  return (
    <TouchableWithoutFeedback
      onPress={Platform.OS !== "web" ? Keyboard.dismiss : undefined}
      accessible={false}
    >
      <ThemedView style={styles.container}>
        <Spacer />
        <ThemedText title style={styles.title}>
          Login to Your Account
        </ThemedText>

        {/* Email Input */}
        <ThemedTextInput
          placeholder="Email"
          style={inputStyle}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />

        {/* Password Input */}
        <ThemedTextInput
          placeholder="Password"
          secureTextEntry
          style={inputStyle}
          onChangeText={setPassword}
          value={password}
        />

        {/* Login Button */}
        <ThemedButton onPress={handleSubmit} style={styles.btn}>
          <Text style={styles.btnText}>Login</Text>
        </ThemedButton>

        <Spacer />

        {/* Error Message */}
        {error && <Text style={styles.error}>{error}</Text>}

        <Spacer height={100} />

        {/* Navigation Link */}
        <Link href="/register">
          <ThemedText style={styles.registerLink}>Register Instead</ThemedText>
        </Link>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

// Styles grouped by purpose
const styles = StyleSheet.create({
  // Layout & container
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

  // Typography
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },
  btnText: {
    color: "#f2f2f2",
  },
  registerLink: {
    textAlign: "center",
  },

  // Inputs
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

  // Buttons
  btn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 35,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },

  // Error message
  error: {
    color: Colors.warning,
    padding: 10,
    backgroundColor: "#f5c1c8",
    borderColor: Colors.warning,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 10,
  },
});

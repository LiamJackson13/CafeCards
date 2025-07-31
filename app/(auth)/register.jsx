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
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import ThemedText from "../../components/ThemedText";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedView from "../../components/ThemedView";
import { Colors } from "../../constants/Colors";
import { useUser } from "../../hooks/useUser";

const RegisterScreen = () => {
  // Form state: email, password, and error message
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  // Registration type flag: cafe vs customer
  const [isCafeUserFlag, setIsCafeUserFlag] = useState(false);
  // Auth hook: provides register function for new user signup
  const { register } = useUser();

  /**
   * handleSubmit: resets errors, attempts registration, and handles failures
   */
  const handleSubmit = async () => {
    setError(null);
    try {
      // Attempt to register with credentials and user type
      await register(email, password, isCafeUserFlag);
    } catch (error) {
      setError(error?.message || "Registration failed.");
    }
  };

  // Render the registration form UI
  return (
    // Dismiss keyboard when tapping outside inputs
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
        {/* Toggle to choose cafe or customer registration */}
        <View style={styles.switchContainer}>
          <ThemedText style={styles.switchLabel}>Register as Cafe</ThemedText>
          <Switch
            trackColor={{ false: Colors.light.border, true: Colors.primary }}
            thumbColor={isCafeUserFlag ? Colors.primary : Colors.light.card}
            ios_backgroundColor={Colors.light.border}
            onValueChange={setIsCafeUserFlag}
            value={isCafeUserFlag}
            style={styles.switch}
          />
        </View>
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
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
    marginBottom: 20,
    ...(Platform.OS === "web" && {
      maxWidth: 400,
      width: "calc(100% - 80px)",
      alignSelf: "center",
    }),
  },
  switchLabel: {
    fontSize: 16,
  },
  switch: {
    marginLeft: 10,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});

/**
 * User Registration Screen
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
  // Registration type flag: cafe or customer
  const [isCafeUserFlag, setIsCafeUserFlag] = useState(false);
  // Auth hook: provides register function for new user signup
  const { register } = useUser();


  // handleSubmit: resets errors, attempts registration, and handles failures
  const handleSubmit = async () => {
    setError(null);
    try {
      // Attempt to register with credentials and user type
      await register(email, password, isCafeUserFlag);
    } catch (error) { // On failure, catch the error and save it to state
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
        {/* Email and password inputs with validation */}
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
        {/* Toggle to choose to register as a cafe or customer */}
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
        {/* Register button to submit form */}
        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: "#f2f2f2" }}>Register</Text>
        </ThemedButton>
        <Spacer />
        {error && <Text style={styles.error}>{error}</Text>}
        <Spacer height={100} />
        {/* Link to login screen for existing users */}
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
  // Main view: center content with padding and responsive design
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Title the screen title
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
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

  link: {
    textAlign: "center",
  },
  // Input fields
  input: {
    width: "80%",
    marginBottom: 20,
  },
  // Switch styles
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "50%",
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
  },
  switch: {
    marginLeft: 10,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});

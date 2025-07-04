/**
 * Dashboard Layout Component
 *
 * This layout component wraps all authenticated user screens in a bottom tab navigation.
 * It uses the UserOnly component to ensure only authenticated users can access
 * these screens. Provides themed tab navigation with icons for:
 * - Profile management
 * - Loyalty cards view
 * - QR code scanner/generator
 * - Book management (if applicable)
 * Includes dynamic theming support for tab bar appearance.
 */
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import UserOnly from "../../components/auth/UserOnly";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useCafeUser } from "../../hooks/useCafeUser";

const DashboardLayout = () => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;
  const isCafeUser = useCafeUser();

  return (
    <UserOnly>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.navBackground,
            paddingTop: 10,
            height: 90,
          },
          tabBarActiveTintColor: theme.iconColorFocused,
          tabBarInactiveTintColor: theme.iconColor,
        }}
      >
        {/* Regular customer tabs - Cards first as default */}
        <Tabs.Screen
          name="cards"
          options={{
            title: "Cards",
            href: !isCafeUser ? "/cards" : null,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "card" : "card-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="qr"
          options={{
            title: "QR Code",
            href: !isCafeUser ? "/qr" : null,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "qr-code" : "qr-code-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        {/* Cafe user tabs - Camera first as default for cafe users */}
        <Tabs.Screen
          name="cafeSettings"
          options={{
            title: "Settings",
            href: isCafeUser ? "/cafeSettings" : null,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="cafeCamera"
          options={{
            title: "Scanner",
            href: isCafeUser ? "/cafeCamera" : null,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "camera" : "camera-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            href: !isCafeUser ? "/profile" : "/profile",
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />

        {/* Hidden screens */}
        <Tabs.Screen name="books/[id]" options={{ href: null }} />
      </Tabs>
    </UserOnly>
  );
};

export default DashboardLayout;

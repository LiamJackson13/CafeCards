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
import { View } from "react-native";
import UserOnly from "../../components/auth/UserOnly";
import RedemptionNotification from "../../components/RedemptionNotification";
import { Colors } from "../../constants/Colors";
import { useCards } from "../../contexts/CardsContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCafeUser } from "../../hooks/useUser";

const DashboardLayout = () => {
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;
  const isCafeUser = useCafeUser();
  const { recentRedemption, dismissRedemption } = useCards();

  return (
    <UserOnly>
      <View style={{ flex: 1 }}>
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
          {/* Customer tabs */}
          <Tabs.Screen
            name="cards"
            options={{
              title: "Cards",
              href: !isCafeUser ? undefined : null,
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
              href: !isCafeUser ? undefined : null,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "qr-code" : "qr-code-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="cafeSettings"
            options={{
              title: "Settings",
              href: isCafeUser ? undefined : null,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? "settings" : "settings-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />
          {/* Cafe user tabs */}
          <Tabs.Screen
            name="cafeCamera"
            options={{
              title: "Scanner",
              href: isCafeUser ? undefined : null,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? "camera" : "camera-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />

          {/* Profile tab - available to all users */}
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={24}
                  color={color}
                />
              ),
            }}
          />

          {/* Hidden screens - always present but not in tab bar */}
          <Tabs.Screen name="cards/[id]" options={{ href: null }} />
          <Tabs.Screen name="cafeDesign" options={{ href: null }} />
          <Tabs.Screen name="reward-success" options={{ href: null }} />
        </Tabs>

        {/* Global Redemption Notification - Only show for customers */}
        {!isCafeUser && (
          <RedemptionNotification
            visible={!!recentRedemption}
            redemption={recentRedemption}
            onDismiss={dismissRedemption}
          />
        )}
      </View>
    </UserOnly>
  );
};

export default DashboardLayout;

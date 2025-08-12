/**
 * Dashboard Layout Component
 */
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import UserOnly from "../../components/auth/UserOnly";
import StampNotification from "../../components/StampNotification";
import { Colors } from "../../constants/Colors";
import { useCards } from "../../contexts/CardsContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useCafeUser } from "../../hooks/useUser";

const TAB_ICON_SIZE = 24;

const DashboardLayout = () => {
  // Theme context: provides current theme mode (light/dark)
  const { userTheme } = useTheme();
  const router = useRouter();
  const theme = Colors[userTheme] ?? Colors.light;
  // Checks if logged-in user is a cafe owner
  const isCafeUser = useCafeUser();
  // Cards context: recent redemption event and dismiss handler for notifications
  const {
    recentRedemption,
    recentStampAddition,
    dismissRedemption,
    dismissStampAddition,
  } = useCards();

  // Redirect to reward-success whenever a redemption happens
  useEffect(() => {
    if (recentRedemption) {
      router.push({ pathname: "/reward-success" });
      // clear recent flag to prevent re-trigger
      dismissRedemption();
    }
  }, [recentRedemption, router, dismissRedemption]);
  return (
    // Only allow authenticated users to access dashboard
    <UserOnly>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            // Hide headers and style tab bar dynamically
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.navBackground,
              paddingTop: 10,
              height: 90,
            },
            // Tab icon colors based on focus
            tabBarActiveTintColor: theme.iconColorFocused,
            tabBarInactiveTintColor: theme.iconColor,
          }}
        >
          {/* Define tabs for customers and cafe users, with icons */}
          {/* Customer: Cards tab */}
          <Tabs.Screen
            name="cards"
            options={{
              title: "Cards",
              href: !isCafeUser ? undefined : null,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? "card" : "card-outline"}
                  size={TAB_ICON_SIZE}
                  color={color}
                />
              ),
            }}
          />
          {/* Customer: QR Code tab */}
          <Tabs.Screen
            name="qr"
            options={{
              title: "QR Code",
              href: !isCafeUser ? undefined : null,
              tabBarIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "qr-code" : "qr-code-outline"}
                  size={TAB_ICON_SIZE}
                  color={color}
                />
              ),
            }}
          />
          {/* Cafe User: Design tab */}
          <Tabs.Screen
            name="cafeDesign"
            options={{
              title: "Design",
              href: isCafeUser ? undefined : null,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? "color-palette" : "color-palette-outline"}
                  size={TAB_ICON_SIZE}
                  color={color}
                />
              ),
            }}
          />
          {/* Cafe User: Scanner tab */}
          <Tabs.Screen
            name="cafeCamera"
            options={{
              title: "Scanner",
              href: isCafeUser ? undefined : null,
              tabBarIcon: ({ focused, color }) => (
                <Ionicons
                  name={focused ? "camera" : "camera-outline"}
                  size={TAB_ICON_SIZE}
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
                  size={TAB_ICON_SIZE}
                  color={color}
                />
              ),
            }}
          />
          {/* Hidden screens - not shown in tab bar */}
          <Tabs.Screen name="cards/[id]" options={{ href: null }} />
          <Tabs.Screen name="reward-success" options={{ href: null }} />
        </Tabs>

        {/* Global stamp notification for customers */}
        <StampNotification
          visible={!!recentStampAddition}
          stampData={recentStampAddition}
          onDismiss={dismissStampAddition}
        />
      </View>
    </UserOnly>
  );
};

export default DashboardLayout;

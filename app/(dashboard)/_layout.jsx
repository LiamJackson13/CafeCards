/**
 * Dashboard Layout Component
 *
 * Wraps all authenticated user screens in a bottom tab navigation.
 * - Ensures only authenticated users can access screens (UserOnly)
 * - Themed tab navigation with icons for:
 *   - Profile management
 *   - Loyalty cards
 *   - QR code scanner/generator
 *   - Cafe design (for cafe users)
 *   - Cafe scanner (for cafe users)
 * - Dynamic theming for tab bar
 * - Global redemption notification for customers
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

const TAB_ICON_SIZE = 24;
const TAB_BAR_HEIGHT = 90;
const TAB_BAR_PADDING_TOP = 10;

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
              paddingTop: TAB_BAR_PADDING_TOP,
              height: TAB_BAR_HEIGHT,
            },
            tabBarActiveTintColor: theme.iconColorFocused,
            tabBarInactiveTintColor: theme.iconColor,
          }}
        >
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

        {/* Global Redemption Notification - Only for customers */}
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

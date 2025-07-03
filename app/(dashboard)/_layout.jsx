import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import UserOnly from "../../components/auth/UserOnly";
import { Colors } from "../../constants/Colors";

const DashboardLayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

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
        <Tabs.Screen
          name="cards"
          options={{
            title: "Cards",
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
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "qr-code" : "qr-code-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen name="books/[id]" options={{ href: null }} />
      </Tabs>
    </UserOnly>
  );
};

export default DashboardLayout;

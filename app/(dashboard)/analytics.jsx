import { useContext, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ThemedView from "../../components/ThemedView";
import { CardsContext } from "../../contexts/CardsContext";
import { useTheme } from "../../contexts/ThemeContext";

const Analytics = () => {
  const { cards } = useContext(CardsContext);
  const { actualTheme } = useTheme();
  const isDarkMode = actualTheme === "dark";

  // Calculate metrics
  const totalActiveCustomers = useMemo(() => {
    const uniqueCustomers = new Set(cards.map((card) => card.customerId));
    return uniqueCustomers.size;
  }, [cards]);

  const repeatCustomerRate = useMemo(() => {
    const customerVisitCounts = cards.reduce((acc, card) => {
      acc[card.customerId] = (acc[card.customerId] || 0) + 1;
      return acc;
    }, {});
    const repeatCustomers = Object.values(customerVisitCounts).filter(
      (visits) => visits > 1
    ).length;
    return ((repeatCustomers / totalActiveCustomers) * 100).toFixed(2);
  }, [cards, totalActiveCustomers]);

  const topCustomers = useMemo(() => {
    const customerStats = cards.reduce((acc, card) => {
      if (!acc[card.customerId]) {
        acc[card.customerId] = {
          visits: 0,
          redemptions: 0,
          name: card.customerName,
        };
      }
      acc[card.customerId].visits += card.totalStamps || 0;
      acc[card.customerId].redemptions += card.totalRedeemed || 0;
      return acc;
    }, {});

    return Object.entries(customerStats)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  }, [cards]);

  const totalStampsIssued = useMemo(() => {
    return cards.reduce((sum, card) => sum + (card.totalStamps || 0), 0);
  }, [cards]);

  const totalRewardsRedeemed = useMemo(() => {
    return cards.reduce((sum, card) => sum + (card.totalRedeemed || 0), 0);
  }, [cards]);

  const redemptionRate = useMemo(() => {
    return ((totalRewardsRedeemed / totalStampsIssued) * 100).toFixed(2);
  }, [totalRewardsRedeemed, totalStampsIssued]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      color: isDarkMode ? "#fff" : "#333",
      textAlign: "center",
    },
    section: {
      marginBottom: 20,
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
      padding: 15,
      borderRadius: 10,
      shadowColor: isDarkMode ? "#000" : "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    metricTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: isDarkMode ? "#bbb" : "#555",
      marginBottom: 5,
    },
    metricValue: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDarkMode ? "#4caf50" : "#007AFF",
    },
    listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#333" : "#eee",
    },
    listText: {
      fontSize: 16,
      color: isDarkMode ? "#ddd" : "#444",
    },
  });

  return (
    <ThemedView style={styles.container} safe>
      <Text style={styles.header}>Analytics</Text>

      <View style={styles.section}>
        <Text style={styles.metricTitle}>Total Active Loyalty Customers:</Text>
        <Text style={styles.metricValue}>{totalActiveCustomers}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.metricTitle}>Repeat Customer Rate:</Text>
        <Text style={styles.metricValue}>{repeatCustomerRate}%</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.metricTitle}>Top 10 Customers (by Visits):</Text>
        <FlatList
          data={topCustomers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item.name}</Text>
              <Text style={styles.listText}>Visits: {item.visits}</Text>
              <Text style={styles.listText}>
                Redemptions: {item.redemptions}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.metricTitle}>Total Stamps Issued:</Text>
        <Text style={styles.metricValue}>{totalStampsIssued}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.metricTitle}>Total Rewards Redeemed:</Text>
        <Text style={styles.metricValue}>{totalRewardsRedeemed}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.metricTitle}>Redemption Rate:</Text>
        <Text style={styles.metricValue}>{redemptionRate}%</Text>
      </View>
    </ThemedView>
  );
};

export default Analytics;

import { useContext, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ThemedCard from "../../components/ThemedCard";
import ThemedView from "../../components/ThemedView";
import { CardsContext } from "../../contexts/CardsContext";
import { useTheme } from "../../contexts/ThemeContext";

const Analytics = () => {
  // Context: access all loyalty cards data
  const { cards } = useContext(CardsContext);
  // Theme context: determine if dark mode is active
  const { actualTheme } = useTheme();
  const isDarkMode = actualTheme === "dark";

  // Calculate metrics
  const totalActiveCustomers = useMemo(() => {
    // Total number of unique active customers
    const uniqueCustomers = new Set(cards.map((card) => card.customerId));
    return uniqueCustomers.size;
  }, [cards]);

  const repeatCustomerRate = useMemo(() => {
    // Calculate percentage of customers who visited more than once
    const customerVisitCounts = cards.reduce((acc, card) => {
      // For each card record, increment this customer's visit count
      acc[card.customerId] = (acc[card.customerId] || 0) + 1;
      return acc;
    }, {});
    // Identify customers with more than one recorded visit
    const repeatCustomers = Object.values(customerVisitCounts).filter(
      (visits) => visits > 1
    ).length;
    // Compute repeat rate percentage, formatted to two decimals
    return ((repeatCustomers / totalActiveCustomers) * 100).toFixed(2);
  }, [cards, totalActiveCustomers]);

  const topCustomers = useMemo(() => {
    // Build aggregate stats (visits & redemptions) per customer
    const customerStats = cards.reduce((acc, card) => {
      if (!acc[card.customerId]) {
        // Initialize counts when we first encounter a customer
        acc[card.customerId] = {
          visits: 0,
          redemptions: 0,
          name: card.customerName,
        };
      }
      // Sum all stamps as visits for ranking purposes
      acc[card.customerId].visits += card.totalStamps || 0;
      // Sum all redeemed rewards for additional metrics
      acc[card.customerId].redemptions += card.totalRedeemed || 0;
      return acc;
    }, {});

    // Convert aggregated stats object into an array of customer records
    return (
      Object.entries(customerStats)
        .map(([id, stats]) => ({ id, ...stats }))
        // Sort customers descending by visits (most active first)
        .sort((a, b) => b.visits - a.visits)
        // Limit to top 10 customers
        .slice(0, 10)
    );
  }, [cards]);

  const totalStampsIssued = useMemo(() => {
    // Sum of all stamps issued across all cards
    return cards.reduce((sum, card) => sum + (card.totalStamps || 0), 0);
  }, [cards]);

  const totalRewardsRedeemed = useMemo(() => {
    // Sum of all rewards redeemed across all cards
    return cards.reduce((sum, card) => sum + (card.totalRedeemed || 0), 0);
  }, [cards]);

  const redemptionRate = useMemo(() => {
    // Overall redemption rate as a percentage
    return ((totalRewardsRedeemed / totalStampsIssued) * 100).toFixed(2);
  }, [totalRewardsRedeemed, totalStampsIssued]);

  // Styles for analytics dashboard
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
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

      padding: 15,
      borderRadius: 10,
      shadowColor: "#000",
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
      <FlatList
        data={topCustomers}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Analytics</Text>

            <ThemedCard style={styles.section}>
              <Text style={styles.metricTitle}>
                Total Active Loyalty Customers:
              </Text>
              <Text style={styles.metricValue}>{totalActiveCustomers}</Text>
            </ThemedCard>
            <ThemedCard style={styles.section}>
              <Text style={styles.metricTitle}>Repeat Customer Rate:</Text>
              <Text style={styles.metricValue}>{repeatCustomerRate}%</Text>
            </ThemedCard>

            <ThemedCard style={styles.section}>
              <Text style={styles.metricTitle}>
                Top 10 Customers (by Visits):
              </Text>
              {topCustomers.map((item) => (
                <View key={item.id} style={styles.listItem}>
                  <Text style={styles.listText}>{item.name}</Text>
                  <Text style={styles.listText}>Visits: {item.visits}</Text>
                  <Text style={styles.listText}>
                    Redemptions: {item.redemptions}
                  </Text>
                </View>
              ))}
            </ThemedCard>
          </>
        }
        ListFooterComponent={
          <>
            <ThemedCard style={styles.section}>
              <Text style={styles.metricTitle}>Total Stamps Issued:</Text>
              <Text style={styles.metricValue}>{totalStampsIssued}</Text>
            </ThemedCard>

            <ThemedCard style={styles.section}>
              <Text style={styles.metricTitle}>Total Rewards Redeemed:</Text>
              <Text style={styles.metricValue}>{totalRewardsRedeemed}</Text>
            </ThemedCard>

            <ThemedCard style={styles.section}>
              <Text style={styles.metricTitle}>Redemption Rate:</Text>
              <Text style={styles.metricValue}>{redemptionRate}%</Text>
            </ThemedCard>
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
};

export default Analytics;

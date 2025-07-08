/**
 * Loyalty Cards Screen
 *
 * Displays loyalty cards for customers or cafe users.
 * - Customers: See their own cards from different cafes
 * - Cafe users: See all customer cards they manage
 * Features:
 * - Grid/list view of cards
 * - Card progress, details, and redemption
 * - Empty/loading states
 * - Real-time updates
 * - Themed, modern UI
 */
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import ThemedLoader from "../../components/ThemedLoader";
import ThemedView from "../../components/ThemedView";
import { EmptyState, LoadingState } from "../../components/cards/CardStates";
import CardsListHeader from "../../components/cards/CardsListHeader";
import CustomCardItem from "../../components/cards/CustomCardItem";
import QRCodeModal from "../../components/cards/QRCodeModal";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useEnhancedCardsList } from "../../hooks/cards/useEnhancedCardsList";
import { useCafeUser, useUser } from "../../hooks/useUser";

const CardsScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const { actualTheme } = useTheme();
  const { displayCards, loading, refreshing, onRefresh, updateCardInList } =
    useEnhancedCardsList();

  // Modal state for redeem functionality
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const theme = Colors[actualTheme] ?? Colors.light;

  // Handle card press: open details or redeem modal
  const handleCardPress = (cardId, options = {}) => {
    if (options.redeem) {
      const card = displayCards.find((c) => c.id === cardId);
      if (card && card.isReady) {
        setSelectedCard(card);
        setShowRedeemModal(true);
      }
    } else {
      router.push(`/cards/${cardId}`);
    }
  };

  // Generate QR data for redemption modal
  const generateRedemptionQRData = () => {
    if (!selectedCard || !user) return "";
    return JSON.stringify({
      type: "reward_redemption",
      app: "cafe-cards",
      customerId: selectedCard.customerId || user.$id,
      customerName: selectedCard.customerName || user.name,
      email: selectedCard.customerEmail || user.email,
      cardId: selectedCard.cardId || selectedCard.id,
      currentStamps: selectedCard.stamps || selectedCard.currentStamps || 0,
      availableRewards:
        selectedCard.availableRewards || selectedCard.rewardsEarned || 1,
      timestamp: new Date().toISOString(),
    });
  };

  // Show loading state if cards are loading and none are present
  if (loading && displayCards.length === 0) {
    return (
      <ThemedView style={styles.container} safe>
        <View style={styles.loadingContainer}>
          <ThemedLoader size="large" />
          <LoadingState />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safe>
      <FlatList
        data={displayCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomCardItem
            item={item}
            onPress={handleCardPress}
            onUpdate={updateCardInList}
            isCafeUser={isCafeUser}
            theme={theme}
            actualTheme={actualTheme}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
        ListHeaderComponent={
          <CardsListHeader
            isCafeUser={isCafeUser}
            displayCards={displayCards}
          />
        }
        ListEmptyComponent={<EmptyState isCafeUser={isCafeUser} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.text}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Redemption QR Code Modal */}
      <QRCodeModal
        visible={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
        qrData={generateRedemptionQRData()}
        availableRewards={selectedCard?.availableRewards || 1}
        theme={theme}
      />
    </ThemedView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flexGrow: 1,
  },
  cardSeparator: {
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
});

export default CardsScreen;

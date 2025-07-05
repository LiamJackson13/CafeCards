/**
 * Loyalty Cards Screen (Refactored)
 *
 * This screen displays loyalty cards differently based on user type:
 * - For customers: Shows their own loyalty cards from different cafes
 * - For cafe users: Shows all customer loyalty cards they manage
 * Features include:
 * - Grid/list view of loyalty cards
 * - Beautiful card designs with progress indicators
 * - Individual card details and progress tracking
 * - Empty state handling for users with no cards
 * - Modern UI with themed styling
 * - Real-time updates from Appwrite database
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

  const handleCardPress = (cardId, options = {}) => {
    if (options.redeem) {
      // Find the card and show redeem modal
      const card = displayCards.find((c) => c.id === cardId);
      if (card && card.isReady) {
        setSelectedCard(card);
        setShowRedeemModal(true);
      }
    } else {
      // Navigate to card details
      router.push(`/cards/${cardId}`);
    }
  };

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

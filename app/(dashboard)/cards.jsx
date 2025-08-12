/**
 * Loyalty Cards Screen
 */
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Spacer from "../../components/Spacer";
import ThemedLoader from "../../components/ThemedLoader";
import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";
import CustomCardItem from "../../components/cards/CardItem";
import { EmptyState, LoadingState } from "../../components/cards/CardStates";
import CardsListHeader from "../../components/cards/CardsListHeader";
import QRCodeModal from "../../components/cards/QRCodeModal";
import { Colors } from "../../constants/Colors";
import { useTheme } from "../../contexts/ThemeContext";
import { useCardsList } from "../../hooks/cards/useCardsList";
import { useCafeUser, useUser } from "../../hooks/useUser";

const SORT_OPTIONS = [
  { label: "Last Used", value: "lastUsed" },
  { label: "Most Stamps", value: "stamps" },
  { label: "A-Z", value: "alpha" },
];

const CardsScreen = () => {
  const router = useRouter();
  // Auth context: current user info
  const { user } = useUser();
  const isCafeUser = useCafeUser();
  const { userTheme } = useTheme();
  // detect if this screen is active
  const isFocused = useIsFocused();
  // Data hook: fetches, refreshes, and updates loyalty cards list
  const { displayCards, loading, refreshing, onRefresh, updateCardInList } =
    useCardsList();

  const theme = Colors[userTheme] ?? Colors.light;

  // App states for managing card redemption
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [sortType, setSortType] = useState("lastUsed");

  /**
   * sortedCards: memoized, combines pinned and unpinned cards,
   * sorted by selected criteria (stamps, lastUsed, alpha).
   */
  const sortedCards = useMemo(() => {
    const cards = [...displayCards];
    const pinned = cards.filter((c) => c.isPinned);
    const others = cards.filter((c) => !c.isPinned);
    const sortFn = (arr) => {
      // Choose sorting logic based on sortType
      switch (sortType) {
        case "stamps":
          return arr.sort((a, b) => {
            // Rewards-ready cards first, then by stamp count desc
            if (a.isReady && !b.isReady) return -1;
            if (!a.isReady && b.isReady) return 1;
            return (b.stamps || 0) - (a.stamps || 0);
          });
        case "lastUsed":
          return arr.sort(
            // Sort by most recent update timestamp
            (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
          );
        case "alpha":
        default:
          // Alphabetical by cafe name
          return arr.sort((a, b) =>
            (a.cafeName || "").localeCompare(b.cafeName || "")
          );
      }
    };
    return [...sortFn(pinned), ...sortFn(others)];
  }, [displayCards, sortType]);

  /**
   * handleCardPress: if redeem option, open modal; otherwise navigate to details.
   */
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

  // Prepare QR data string for redemption modal
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

  // Close QR modal when leaving screen
  useEffect(() => {
    if (!isFocused) {
      setShowRedeemModal(false);
    }
  }, [isFocused]);

  // Access control: only non-cafe users (customers) can view
  if (isCafeUser) {
    return (
      <ThemedView style={styles.container} safe>
        <ThemedText type="title" style={styles.title}>
          Access Denied
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Only customers can access this page
        </ThemedText>
      </ThemedView>
    );
  }

  // Show loader if initial data is still fetching
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
      {/* Cards list with sorting and refresh control */}
      <FlatList
        data={sortedCards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomCardItem
            item={item}
            onPress={handleCardPress}
            onUpdate={updateCardInList}
            isCafeUser={isCafeUser}
            theme={theme}
            userTheme={userTheme}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
        ListHeaderComponent={
          <>
            {/* Header: sorting buttons */}
            <CardsListHeader
              isCafeUser={isCafeUser}
              displayCards={displayCards}
            />
            <View style={styles.sortButtonRow}>
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.sortButton,
                    {
                      borderColor: theme.border,
                      backgroundColor: theme.uiBackground,
                    },
                    sortType === opt.value && {
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => setSortType(opt.value)}
                >
                  <ThemedText
                    style={{
                      color:
                        sortType === opt.value ? Colors.light.card : theme.text,
                      fontSize: 14,
                      fontWeight: sortType === opt.value ? "600" : "500",
                    }}
                  >
                    {opt.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <Spacer height={20} />
          </>
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
  // Main container: full screen flex
  container: {
    flex: 1,
  },
  // FlatList content container style for lists
  list: {
    flexGrow: 1,
  },
  // Separator between cards
  cardSeparator: {
    height: 16,
  },
  // Centered loader container for initial load state
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  // Row layout for sort buttons section
  sortButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  // Individual sort button styling
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default CardsScreen;

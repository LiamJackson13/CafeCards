/**
 * CardsContext
 *
 * Provides global state and CRUD operations for loyalty cards.
 * Handles fetching, updating, and real-time syncing of cards for both cafe users and customers.
 * Integrates with Appwrite for database and real-time updates.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCafeUser, useUser } from "../hooks/useUser";
import {
  client,
  createLoyaltyCard,
  DATABASE_ID,
  findLoyaltyCardByCustomerId,
  findLoyaltyCardByCustomerIdAndCafeUserId,
  getLoyaltyCardById,
  getLoyaltyCardsByCafeUser,
  getLoyaltyCardsByCustomerId,
  LOYALTY_CARDS_COLLECTION_ID,
  updateLoyaltyCard,
} from "../lib/appwrite";

export const CardsContext = createContext();

/**
 * CardsProvider
 *
 * Wraps children with CardsContext and provides card state and actions.
 */
export function CardsProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentRedemption, setRecentRedemption] = useState(null);
  const [recentStampAddition, setRecentStampAddition] = useState(null);

  const { user } = useUser();
  const isCafeUser = useCafeUser();

  /**
   * Fetch all cards for the current user (cafe or customer).
   */
  const fetchCards = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let cardDocuments = isCafeUser
        ? await getLoyaltyCardsByCafeUser(user.$id)
        : await getLoyaltyCardsByCustomerId(user.$id);

      // Filter out invalid cards
      const validCards = cardDocuments.filter(
        (card) => card && card.$id && card.customerId && card.cafeUserId
      );
      setCards(validCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [user, isCafeUser]);

  /**
   * Fetch a single card by its ID.
   */
  const fetchCardById = useCallback(async (cardId) => {
    if (!cardId) return null;
    try {
      return await getLoyaltyCardById(cardId);
    } catch (error) {
      console.error("Error fetching card by ID:", error);
      return null;
    }
  }, []); // Empty dependency array since it doesn't depend on any state

  /**
   * Fetch a card by customer user ID.
   */
  const fetchCardByUserId = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      return await findLoyaltyCardByCustomerId(userId);
    } catch (error) {
      console.error("Error fetching card by user ID:", error);
      return null;
    }
  }, []);

  /**
   * Fetch a card by customer user ID and cafe user ID.
   */
  const fetchCardByUserIdAndCafeUserId = useCallback(
    async (userId, cafeUserId) => {
      if (!userId || !cafeUserId) return null;
      try {
        return await findLoyaltyCardByCustomerIdAndCafeUserId(
          userId,
          cafeUserId
        );
      } catch (error) {
        console.error(
          "Error fetching card by user ID and cafe user ID:",
          error
        );
        return null;
      }
    },
    []
  );

  /**
   * Create a new loyalty card (cafe users only).
   */
  const createCard = async (data) => {
    if (!user || !isCafeUser) {
      throw new Error("Only cafe users can create cards");
    }
    try {
      const newCard = await createLoyaltyCard(data, user.$id);
      setCards((prev) => [newCard, ...prev]);
      return newCard;
    } catch (error) {
      console.error("Error creating card:", error);
      throw error;
    }
  };

  /**
   * Update a loyalty card by ID.
   */
  const updateCard = async (cardId, updateData) => {
    if (!cardId) throw new Error("Card ID is required for update");
    try {
      const updatedCard = await updateLoyaltyCard(cardId, updateData);
      if (!updatedCard || !updatedCard.$id) {
        throw new Error("Invalid response from card update");
      }
      setCards((prev) =>
        prev.map((card) => (card && card.$id === cardId ? updatedCard : card))
      );
      return updatedCard;
    } catch (error) {
      console.error("Error updating card:", error);
      // Remove card from state if not found
      if (error.message?.includes("Loyalty card not found")) {
        setCards((prev) => prev.filter((card) => card && card.$id !== cardId));
      }
      throw error;
    }
  };

  /**
   * Delete a card (not implemented).
   */
  const deleteCard = async (id) => {
    // Placeholder for future implementation
    console.log("Delete card not implemented yet:", id);
  };

  /**
   * Debug helper to log card state.
   */
  function debugCards() {
    console.log("=== CARDS DEBUG INFO ===");
    console.log("Total cards:", cards.length);
    console.log("User:", user?.$id, "isCafeUser:", isCafeUser);
    cards.forEach((card, index) => {
      if (!card) {
        console.warn(`Card ${index}: NULL/UNDEFINED`);
      } else if (!card.$id) {
        console.warn(`Card ${index}: Missing $id`, card);
      } else if (!card.customerId) {
        console.warn(`Card ${index}: Missing customerId`, card);
      } else if (!card.cafeUserId) {
        console.warn(`Card ${index}: Missing cafeUserId`, card);
      } else {
        console.log(
          `Card ${index}: Valid - ID: ${card.$id}, Customer: ${card.customerId}, Cafe: ${card.cafeUserId}`
        );
      }
    });
    console.log("=== END CARDS DEBUG ===");
  }

  // Fetch cards when user or role changes
  useEffect(() => {
    if (user) {
      fetchCards();
    } else {
      setCards([]);
    }
  }, [user, isCafeUser, fetchCards]);

  /**
   * Real-time subscription handler for Appwrite card updates.
   * Handles create, update, and delete events.
   */
  useEffect(() => {
    if (!user) return;

    let unsubscribe;
    const channel = `databases.${DATABASE_ID}.collections.${LOYALTY_CARDS_COLLECTION_ID}.documents`;
    let retryCount = 0;

    const handleRealtimeUpdate = (response) => {
      try {
        const { events, payload } = response;

        // Validate response structure
        if (!response || !Array.isArray(events) || !payload || !payload.$id) {
          console.warn("Invalid real-time update:", response);
          return;
        }
        if (!payload.customerId || !payload.cafeUserId) {
          console.warn("Payload missing required fields:", payload);
          return;
        }

        // Only update if relevant to current user
        const isRelevant = isCafeUser
          ? payload.cafeUserId === user.$id
          : payload.customerId === user.$id;
        if (!isRelevant) return;

        // Handle create
        if (events.includes("databases.*.collections.*.documents.*.create")) {
          setCards((prev) =>
            prev.some((card) => card && card.$id === payload.$id)
              ? prev
              : [payload, ...prev]
          );
        }
        // Handle update
        else if (
          events.includes("databases.*.collections.*.documents.*.update")
        ) {
          setCards((prev) =>
            prev.map((card) => {
              if (!card || !card.$id) return card;
              if (card.$id === payload.$id) {
                // Customer: show notifications for card changes
                if (!isCafeUser && card.customerId === user?.$id) {
                  const oldRewards = card.availableRewards || 0;
                  const newRewards = payload.availableRewards || 0;
                  const oldStamps = card.totalStamps || 0;
                  const newStamps = payload.totalStamps || 0;

                  // Show redemption notification if rewards decrease
                  if (newRewards < oldRewards) {
                    setRecentRedemption({
                      timestamp: new Date(),
                      customerName: payload.customerName || "You",
                      rewardsRedeemed: oldRewards - newRewards,
                      remainingRewards: newRewards,
                    });
                    setTimeout(() => setRecentRedemption(null), 5000);
                  }

                  // Show stamp notification if stamps increase
                  if (newStamps > oldStamps) {
                    const stampsAdded = newStamps - oldStamps;
                    setRecentStampAddition({
                      timestamp: new Date(),
                      customer: { name: payload.customerName || "You" },
                      stampsAdded: stampsAdded,
                      totalStamps: newStamps,
                      cafeName: payload.cafeName || "this cafe", // Use cafe name from payload
                    });
                    setTimeout(() => setRecentStampAddition(null), 4000);
                  }
                }
                return payload;
              }
              return card;
            })
          );
        }
        // Handle delete
        else if (
          events.includes("databases.*.collections.*.documents.*.delete")
        ) {
          setCards((prev) =>
            prev.filter((card) => card && card.$id !== payload.$id)
          );
        }
      } catch (error) {
        console.error("Error handling real-time update:", error);
      }
    };

    // Subscribe to Appwrite real-time updates
    const setupSubscription = () => {
      try {
        unsubscribe = client.subscribe(channel, handleRealtimeUpdate);
        // console.log("Real-time subscription established.");
        retryCount = 0; // Reset retry count on successful connection
      } catch (error) {
        console.error("Failed to set up real-time subscription:", error);
        retryCount++;
        const retryDelay = Math.min(5000 * retryCount, 30000); // Exponential backoff with max delay of 30 seconds
        setTimeout(() => {
          if (user) setupSubscription();
        }, retryDelay);
      }
    };

    setupSubscription();

    // Cleanup on unmount
    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
          // console.log("Real-time subscription cleaned up.");
        } catch (error) {
          console.error("Error cleaning up subscription:", error);
        }
      }
    };
  }, [user, isCafeUser]);

  return (
    <CardsContext.Provider
      value={{
        cards,
        loading,
        recentRedemption,
        recentStampAddition,
        dismissRedemption: () => setRecentRedemption(null),
        dismissStampAddition: () => setRecentStampAddition(null),
        fetchCardById,
        fetchCards,
        fetchCardByUserId,
        fetchCardByUserIdAndCafeUserId,
        createCard,
        updateCard,
        deleteCard,
        debugCards,
      }}
    >
      {children}
    </CardsContext.Provider>
  );
}

/**
 * useCards
 *
 * Custom hook to access CardsContext.
 * Throws if used outside of CardsProvider.
 */
export function useCards() {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error("useCards must be used within a CardsProvider");
  }
  return context;
}

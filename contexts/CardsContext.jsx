/**
 * Loyalty Cards Data Management Context
 *
 * Provides data management for loyalty cards throughout the app.
 * Handles CRUD operations for loyalty cards using Appwrite database services.
 * Manages cards state and provides methods for fetching cards, creating new cards,
 * and managing card operations. Integrates with user authentication and cafe user roles.
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
  getLoyaltyCardById,
  getLoyaltyCardsByCafeUser,
  getLoyaltyCardsByCustomerId,
  LOYALTY_CARDS_COLLECTION_ID,
  updateLoyaltyCard,
} from "../lib/appwrite";

export const CardsContext = createContext();

export function CardsProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentRedemption, setRecentRedemption] = useState(null);
  const { user } = useUser();
  const isCafeUser = useCafeUser();

  const fetchCards = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      let cardDocuments = [];

      if (isCafeUser) {
        // Fetch cards managed by this cafe user
        cardDocuments = await getLoyaltyCardsByCafeUser(user.$id);
      } else {
        // Fetch cards for this customer
        cardDocuments = await getLoyaltyCardsByCustomerId(user.$id);
      }

      // Filter out any invalid cards and log warnings
      const validCards = cardDocuments.filter((card) => {
        if (!card || !card.$id) {
          console.warn("Found invalid card document (missing $id):", card);
          return false;
        }
        if (!card.customerId || !card.cafeUserId) {
          console.warn("Found card missing required fields:", card);
          return false;
        }
        return true;
      });

      if (validCards.length !== cardDocuments.length) {
        console.warn(
          `Filtered out ${
            cardDocuments.length - validCards.length
          } invalid cards`
        );
      }

      setCards(validCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      // Don't throw the error, just set empty cards to prevent app crashes
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [user, isCafeUser]);

  async function fetchCardById(cardId) {
    if (!cardId) return null;

    try {
      console.log("Fetching card by ID:", cardId);
      const card = await getLoyaltyCardById(cardId);
      console.log("Found card:", card ? "Yes" : "No");
      return card;
    } catch (error) {
      console.error("Error fetching card by ID:", error);
      return null;
    }
  }

  async function fetchCardByUserId(userId) {
    if (!userId) return null;

    try {
      const card = await findLoyaltyCardByCustomerId(userId);
      return card;
    } catch (error) {
      console.error("Error fetching card by user ID:", error);
      return null;
    }
  }

  async function createCard(data) {
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
  }

  async function updateCard(cardId, updateData) {
    try {
      if (!cardId) {
        throw new Error("Card ID is required for update");
      }

      const updatedCard = await updateLoyaltyCard(cardId, updateData);

      if (!updatedCard || !updatedCard.$id) {
        throw new Error("Invalid response from card update");
      }

      setCards((prev) =>
        prev.map((card) => {
          if (!card || !card.$id) {
            console.warn("Found invalid card in state during update:", card);
            return card;
          }
          return card.$id === cardId ? updatedCard : card;
        })
      );

      return updatedCard;
    } catch (error) {
      console.error("Error updating card:", error);

      // If the card was not found, remove it from local state
      if (error.message?.includes("Loyalty card not found")) {
        console.log(
          "Removing card from local state as it was not found:",
          cardId
        );
        setCards((prev) => prev.filter((card) => card && card.$id !== cardId));
      }

      throw error;
    }
  }

  async function deleteCard(id) {
    try {
      // We'll implement this when needed
      console.log("Delete card not implemented yet:", id);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  }

  // Debug function to help identify issues with cards
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

  // Refresh cards when user changes
  useEffect(() => {
    if (user) {
      fetchCards();
    } else {
      setCards([]);
    }
  }, [user, isCafeUser, fetchCards]);

  // Set up real-time subscriptions for card updates
  useEffect(() => {
    if (!user) return;

    let unsubscribe;
    const channel = `databases.${DATABASE_ID}.collections.${LOYALTY_CARDS_COLLECTION_ID}.documents`;

    const handleRealtimeUpdate = (response) => {
      try {
        const { events, payload } = response;

        // Validate response structure
        if (!response || !events || !Array.isArray(events)) {
          console.warn(
            "Invalid response structure in real-time update:",
            response
          );
          return;
        }

        // Validate payload exists and has required properties
        if (!payload || !payload.$id) {
          console.warn(
            "Invalid payload received in real-time update:",
            payload
          );
          return;
        }

        // Additional validation for required fields
        if (!payload.customerId || !payload.cafeUserId) {
          console.warn(
            "Payload missing required fields (customerId or cafeUserId):",
            payload
          );
          return;
        }

        // Check if this event is relevant to the current user
        const isRelevant = isCafeUser
          ? payload.cafeUserId === user.$id // For cafe users, check if they manage this card
          : payload.customerId === user.$id; // For customers, check if it's their card

        if (!isRelevant) {
          console.log(
            "Real-time update not relevant to current user, ignoring"
          );
          return;
        }

        if (events.includes("databases.*.collections.*.documents.*.create")) {
          setCards((prev) => {
            // Check if card already exists to prevent duplicates
            const exists = prev.some(
              (card) => card && card.$id === payload.$id
            );
            if (exists) {
              console.log(
                "Card already exists, not adding duplicate:",
                payload.$id
              );
              return prev;
            }
            console.log("Adding new card from real-time update:", payload.$id);
            return [payload, ...prev];
          });
        } else if (
          events.includes("databases.*.collections.*.documents.*.update")
        ) {
          setCards((prev) =>
            prev.map((card) => {
              if (!card || !card.$id) {
                console.warn("Found invalid card in state:", card);
                return card;
              }
              if (card.$id === payload.$id) {
                console.log(
                  "Updating card from real-time update:",
                  payload.$id
                );

                // Check if this is a redemption (for customer notifications)
                if (!isCafeUser && card.customerId === user?.$id) {
                  const oldRewards = card.availableRewards || 0;
                  const newRewards = payload.availableRewards || 0;

                  if (newRewards < oldRewards) {
                    // This is a redemption - show notification
                    setRecentRedemption({
                      timestamp: new Date(),
                      customerName: payload.customerName || "You",
                      rewardsRedeemed: oldRewards - newRewards,
                      remainingRewards: newRewards,
                    });

                    // Auto-dismiss after 5 seconds
                    setTimeout(() => {
                      setRecentRedemption(null);
                    }, 5000);
                  }
                }

                return payload;
              }
              return card;
            })
          );
        } else if (
          events.includes("databases.*.collections.*.documents.*.delete")
        ) {
          console.log(
            "Removing deleted card from real-time update:",
            payload.$id
          );
          setCards((prev) =>
            prev.filter((card) => card && card.$id !== payload.$id)
          );
        }
      } catch (error) {
        console.error("Error handling real-time update:", error);
        // Don't crash the app, just log the error and continue
        // This prevents the app from crashing on malformed real-time updates
      }
    };

    const setupSubscription = async () => {
      try {
        console.log("Setting up real-time subscription for cards...");
        unsubscribe = client.subscribe(channel, handleRealtimeUpdate);
        console.log("Real-time subscription established successfully");
      } catch (error) {
        console.error("Failed to set up real-time subscription:", error);
        // Schedule a retry in 5 seconds
        setTimeout(() => {
          if (user) {
            console.log("Retrying real-time subscription setup...");
            setupSubscription();
          }
        }, 5000);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        try {
          console.log("Cleaning up real-time subscription");
          unsubscribe();
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
        dismissRedemption: () => setRecentRedemption(null),
        fetchCardById,
        fetchCards,
        fetchCardByUserId,
        createCard,
        updateCard,
        deleteCard,
        debugCards, // Add debug function for troubleshooting
      }}
    >
      {children}
    </CardsContext.Provider>
  );
}

// Custom hook to use the CardsContext
export function useCards() {
  const context = useContext(CardsContext);
  if (!context) {
    throw new Error("useCards must be used within a CardsProvider");
  }
  return context;
}

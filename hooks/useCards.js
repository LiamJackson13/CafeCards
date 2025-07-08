/**
 * useCards
 *
 * Custom hook for accessing CardsContext.
 * Provides access to loyalty cards data and management functions.
 * Must be used within a CardsProvider component.
 */
import { useContext } from "react";
import { CardsContext } from "../contexts/CardsContext";

export function useCards() {
  const context = useContext(CardsContext);

  if (!context) {
    throw new Error("useCards must be used within a CardsProvider");
  }

  return context;
}

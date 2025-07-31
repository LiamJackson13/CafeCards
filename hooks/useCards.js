import { useContext } from "react";
import { CardsContext } from "../contexts/CardsContext";

export function useCards() {
  // Access the CardsContext value provided by the nearest CardsProvider
  const context = useContext(CardsContext);

  // If context is undefined, the hook is used outside of its provider
  if (!context) {
    throw new Error("useCards must be used within a CardsProvider");
  }

  // Return the context object containing cards data and management functions
  return context;
}

import { useContext } from "react";
import { CardsContext } from "../contexts/CardsContext";

export function useCards() {
  const context = useContext(CardsContext);

  if (!context) {
    throw new Error("useCard must be used within a CardsProvider");
  }
}

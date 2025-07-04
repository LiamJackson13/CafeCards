import { createContext, useState } from "react";

const DATABASE_ID = "6865cc6c000a762776eb";
const COLLECTION_ID = "686788ae0015e07965fb";

export const CardsContext = createContext();

export function CardsProvider({ children }) {
  const [cards, setCards] = useState([]);

  async function fetchCards() {
    try {
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchCardById(id) {
    try {
    } catch (error) {
      console.error(error.message);
    }
  }

  async function createCard(data) {
    try {
    } catch (error) {
      console.error(error.message);
    }
  }

  async function deleteCard(id) {
    try {
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <CardsContext.Provider
      value={{ cards, fetchCardById, fetchCards, createCard, deleteCard }}
    >
      {children}
    </CardsContext.Provider>
  );
}

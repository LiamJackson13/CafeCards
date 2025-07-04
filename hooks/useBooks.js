/**
 * Books/Cards Data Management Hook
 *
 * A custom React hook that provides access to books/cards data context.
 * Returns books state and data management methods (fetch, create, delete books/cards).
 * Ensures the hook is used within a BooksProvider and throws an error if used
 * outside the provider context. Simplifies access to loyalty cards data
 * functionality throughout the app.
 */
import { useContext } from "react";
import { BooksContext } from "../contexts/BooksContext";

export function useBooks() {
  const context = useContext(BooksContext);

  if (!context) {
    throw new Error("useBooks must be used within a BooksProvider");
  }

  return context;
}

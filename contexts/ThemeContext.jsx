/**
 * Theme Management Context
 *
 * Provides theme state and management throughout the app.
 * Handles switching between light and dark themes with persistent storage.
 * Loads saved theme preferences from AsyncStorage on app startup.
 * Exposes theme state and changeTheme method to all components via context.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

/**
 * ThemeProvider
 *
 * Wraps children and provides theme state and actions.
 */
export const ThemeProvider = ({ children }) => {
  // themeMode: current theme setting stored ('light' or 'dark')
  // setThemeMode: updater to change the theme mode
  const [themeMode, setThemeMode] = useState("light");
  // isLoading: flag while loading saved theme from AsyncStorage
  const [isLoading, setIsLoading] = useState(true);

  // actualTheme: effective theme applied (currently mirrors themeMode)
  const actualTheme = themeMode;

  // Load saved theme preference on app start
  useEffect(() => {
    // useEffect: fetch saved themeMode from AsyncStorage once on mount
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode");
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setThemeMode(savedTheme);
        } else {
          setThemeMode("light");
        }
      } catch (error) {
        console.log("Error loading theme:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  // changeTheme: update themeMode state and persist to AsyncStorage
  const changeTheme = async (newTheme) => {
    try {
      setThemeMode(newTheme);
      await AsyncStorage.setItem("themeMode", newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  // context value exposed to users
  const value = {
    themeMode, // current theme mode string
    actualTheme, // effective theme applied
    changeTheme, // function to switch themes
    isLoading, // loading state for initial theme fetch
  };

  // Provide theme context to app
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * useTheme
 *
 * Custom hook to access theme context.
 * Throws if used outside of ThemeProvider.
 */
export const useTheme = () => {
  // useTheme: hook to access ThemeContext; ensures mounted within provider
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

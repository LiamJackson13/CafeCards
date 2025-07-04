import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("light"); // "light" or "dark"
  const [isLoading, setIsLoading] = useState(true);

  // The actual theme is the same as the theme mode now
  const actualTheme = themeMode;

  // Load saved theme preference on app start
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode");
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setThemeMode(savedTheme);
        } else {
          // Default to light theme if no valid saved theme
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

  // Save theme preference when it changes
  const changeTheme = async (newTheme) => {
    try {
      setThemeMode(newTheme);
      await AsyncStorage.setItem("themeMode", newTheme);
    } catch (error) {
      console.log("Error saving theme:", error);
    }
  };

  const value = {
    themeMode,
    actualTheme,
    changeTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

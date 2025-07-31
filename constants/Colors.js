/**
 * Color Theme Constants
 *
 * Defines the color palette and theme schemes for the app.
 *
 */
export const Colors = {
  // Brand colors
  primary: "#AA7C48", // Warm caramel for buttons & accents
  warning: "#E37B7B", // Soft warning red (error/toast)

  dark: {
    text: "#F5F5F5", // Primary readable text
    title: "#FFFFFF", // Bold headlines / section titles
    background: "#1C1C1A", // App background (deep espresso black)
    navBackground: "#2A2A26", // Bottom tab/nav bar
    iconColor: "#B5B5A7", // Muted tan icons (unfocused)
    iconColorFocused: "#F5F5F5", // Bright icon when selected
    uiBackground: "#3A332A", // Cards, buttons, inputs (dark mocha)
    primary: "#AA7C48", // Primary color for dark theme
    secondary: "#7B6F63", // Secondary color for dark theme
    border: "#3A332A", // Border color for dark theme
    card: "#2A2A26", // Card background for dark theme
  },

  light: {
    text: "#625F57", // Body text (light brown-gray)
    title: "#3B2F2F", // Titles / Headings (rich coffee brown)
    background: "#FDF3E7", // Light background (cream)
    navBackground: "#EFE3D1", // Nav bar (light tan)
    iconColor: "#7B6F63", // Unfocused icons
    iconColorFocused: "#3B2F2F", // Focused icons
    uiBackground: "#DBCBB1", // Cards, buttons, inputs (latte beige)
    primary: "#AA7C48", // Primary color for light theme
    secondary: "#7B6F63", // Secondary color for light theme
    border: "#E0D5C1", // Border color for light theme
    card: "#FFFFFF", // Card background for light theme
  },
};

/**
 * ESLint Configuration
 * 
 * ESLint configuration file for the Cafe Cards React Native/Expo app.
 * Uses the official Expo ESLint config with additional customizations.
 * Ignores the dist folder from linting and follows Expo's recommended
 * linting rules for React Native development.
 */
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);

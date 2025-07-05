import { useState } from "react";
import { Alert, View } from "react-native";
import { migrateLoyaltyCards } from "../../lib/appwrite";
import ThemedButton from "../ThemedButton";
import ThemedText from "../ThemedText";

/**
 * Temporary component for running database migration
 * Add this to any screen where you want to run the migration
 * Remove after migration is complete
 */
export const MigrationHelper = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runMigration = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const migrationResult = await migrateLoyaltyCards();
      setResult(migrationResult);

      if (migrationResult.success) {
        Alert.alert(
          "Migration Complete",
          `Successfully migrated ${migrationResult.migratedCount} cards out of ${migrationResult.totalCount} total cards.`
        );
      } else {
        Alert.alert("Migration Failed", migrationResult.error);
      }
    } catch (error) {
      console.error("Migration error:", error);
      Alert.alert("Migration Error", error.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "#fff3cd",
        margin: 10,
        borderRadius: 8,
      }}
    >
      <ThemedText
        style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
      >
        Database Migration Helper
      </ThemedText>
      <ThemedText style={{ marginBottom: 10 }}>
        This will update all legacy loyalty cards to include the new reward
        fields. Run this once after updating the database schema.
      </ThemedText>

      <ThemedButton
        title={isRunning ? "Running Migration..." : "Run Migration"}
        onPress={runMigration}
        disabled={isRunning}
        style={{ marginBottom: 10 }}
      />

      {result && (
        <View>
          <ThemedText
            style={{ fontSize: 14, color: result.success ? "green" : "red" }}
          >
            Status: {result.success ? "Success" : "Failed"}
          </ThemedText>
          {result.success && (
            <>
              <ThemedText>Migrated: {result.migratedCount}</ThemedText>
              <ThemedText>Errors: {result.errorCount}</ThemedText>
              <ThemedText>Total: {result.totalCount}</ThemedText>
            </>
          )}
          {!result.success && <ThemedText>Error: {result.error}</ThemedText>}
        </View>
      )}
    </View>
  );
};

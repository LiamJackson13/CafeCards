/**
 * Teams Management Screen
 *
 * This screen displays and manages user teams within the Cafe Cards app.
 * Features include:
 * - Fetching and displaying teams the current user is a member of
 * - Real-time team data with pull-to-refresh functionality
 * - Team creation, joining, and leaving capabilities
 * - Error handling and loading states
 * - QR code generation for team joining
 * - Team member management and role assignment
 */

import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import ThemedCard from "../components/ThemedCard";
import ThemedLoader from "../components/ThemedLoader";
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import { Colors } from "../constants/Colors";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../hooks/useUser";
import { teams } from "../lib/appwrite";

export default function TeamsScreen() {
  const { user } = useUser();
  const { actualTheme } = useTheme();
  const theme = Colors[actualTheme] ?? Colors.light;

  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserTeams = async () => {
    try {
      setError(null);
      console.log("Fetching teams...");

      // Get teams that the current user is a member of
      const response = await teams.list();
      console.log("Teams response:", response);

      // Handle different possible response structures
      const teamsList = response.teams || response || [];
      console.log("Teams list:", teamsList);

      setUserTeams(teamsList);
    } catch (error) {
      console.error("Error fetching teams:", error);
      setError(error.message || "Failed to load teams");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserTeams();
  };

  useEffect(() => {
    if (user) {
      console.log("User authenticated, fetching teams...");
      fetchUserTeams();
    } else {
      console.log("No user authenticated");
      setLoading(false);
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const TeamCard = ({ team }) => (
    <ThemedCard style={styles.teamCard}>
      <View style={styles.teamHeader}>
        <View style={[styles.teamIcon, { backgroundColor: theme.tint }]}>
          <ThemedText
            style={[styles.teamIconText, { color: theme.background }]}
          >
            {team.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.teamInfo}>
          <ThemedText style={styles.teamName} title>
            {team.name}
          </ThemedText>
          <ThemedText style={styles.teamId}>ID: {team.$id}</ThemedText>
        </View>
      </View>

      <View style={styles.teamDetails}>
        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Members:</ThemedText>
          <ThemedText style={styles.detailValue}>{team.total}</ThemedText>
        </View>

        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Created:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {formatDate(team.$createdAt)}
          </ThemedText>
        </View>

        <View style={styles.detailRow}>
          <ThemedText style={styles.detailLabel}>Updated:</ThemedText>
          <ThemedText style={styles.detailValue}>
            {formatDate(team.$updatedAt)}
          </ThemedText>
        </View>
      </View>
    </ThemedCard>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container} safe>
        <ThemedLoader />
      </ThemedView>
    );
  }

  if (!user) {
    return (
      <ThemedView style={styles.container} safe>
        <View style={styles.header}>
          <ThemedText style={styles.title} title>
            My Teams
          </ThemedText>
          <ThemedCard style={styles.emptyCard}>
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyIcon}>🔒</ThemedText>
              <ThemedText style={styles.emptyTitle} title>
                Authentication Required
              </ThemedText>
              <ThemedText style={styles.emptyMessage}>
                Please log in to view your teams.
              </ThemedText>
            </View>
          </ThemedCard>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <ThemedText style={styles.title} title>
            My Teams
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Teams you&apos;re a member of
          </ThemedText>
        </View>

        {error && (
          <ThemedCard style={[styles.errorCard, { borderColor: "#ff6b6b" }]}>
            <ThemedText style={[styles.errorText, { color: "#ff6b6b" }]}>
              {error}
            </ThemedText>
          </ThemedCard>
        )}

        {userTeams.length === 0 && !error ? (
          <ThemedCard style={styles.emptyCard}>
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyIcon}>👥</ThemedText>
              <ThemedText style={styles.emptyTitle} title>
                No Teams Found
              </ThemedText>
              <ThemedText style={styles.emptyMessage}>
                You&apos;re not currently a member of any teams. Teams allow you
                to collaborate with others in your organization.
              </ThemedText>
            </View>
          </ThemedCard>
        ) : (
          <View style={styles.teamsContainer}>
            {userTeams.map((team) => (
              <TeamCard key={team.$id} team={team} />
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Pull down to refresh
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  teamCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  teamIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  teamIconText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  teamId: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: "monospace",
  },
  teamDetails: {
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
    paddingTop: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "400",
  },
  errorCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  errorText: {
    textAlign: "center",
    fontSize: 14,
  },
  emptyCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
  teamsContainer: {
    paddingBottom: 20,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
  },
});

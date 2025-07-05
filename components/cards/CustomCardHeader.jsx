import { Image, ImageBackground, StyleSheet, View } from "react-native";
import ThemedCard from "../ThemedCard";
import ThemedText from "../ThemedText";

const CustomCardHeader = ({ formattedCard, isCafeUser, theme, cafeDesign }) => {
  if (!cafeDesign) {
    // Show loading state
    return (
      <ThemedCard
        style={[
          styles.headerCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View
            style={[styles.cardIcon, { backgroundColor: theme.primary + "20" }]}
          >
            <ThemedText style={[styles.cardIconText, { color: theme.primary }]}>
              ☕
            </ThemedText>
          </View>
          <View style={styles.cardInfo}>
            <ThemedText style={[styles.customerName, { color: theme.text }]}>
              Loading...
            </ThemedText>
          </View>
        </View>
      </ThemedCard>
    );
  }

  const cardStyle = [
    styles.headerCard,
    {
      backgroundColor: theme.card,
      borderRadius: cafeDesign.borderRadius,
      borderColor: theme.border,
      borderWidth: 1,
    },
  ];

  if (!cafeDesign.shadowEnabled) {
    cardStyle.push({
      shadowOpacity: 0,
      elevation: 0,
    });
  }

  const HeaderContent = () => (
    <View style={styles.cardHeader}>
      <View
        style={[styles.cardIcon, { backgroundColor: theme.primary + "20" }]}
      >
        {cafeDesign.logoUrl ? (
          <Image
            source={{ uri: cafeDesign.logoUrl }}
            style={[
              styles.logoImage,
              {
                width: cafeDesign.logoSize || 40,
                height: cafeDesign.logoSize || 40,
              },
            ]}
            resizeMode="contain"
          />
        ) : (
          <ThemedText style={[styles.cardIconText, { color: theme.primary }]}>
            {formattedCard.isComplete ? "🎉" : cafeDesign.stampIcon}
          </ThemedText>
        )}
      </View>
      <View style={styles.cardInfo}>
        <ThemedText style={[styles.customerName, { color: theme.text }]}>
          {isCafeUser
            ? formattedCard.customerName
            : cafeDesign.cafeName || "Local Cafe"}
        </ThemedText>
        <ThemedText
          style={[styles.customerEmail, { color: theme.text, opacity: 0.7 }]}
        >
          {isCafeUser
            ? formattedCard.customerEmail
            : cafeDesign.location || "Your loyalty card"}
        </ThemedText>
        {formattedCard.isComplete && (
          <View
            style={[styles.completeBadge, { backgroundColor: theme.primary }]}
          >
            <ThemedText style={styles.completeText}>
              🎁 {cafeDesign.rewardDescription || "Ready to Redeem"}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <>
      {cafeDesign.backgroundImageUrl ? (
        <ThemedCard style={cardStyle}>
          <ImageBackground
            source={{ uri: cafeDesign.backgroundImageUrl }}
            style={styles.backgroundImage}
            imageStyle={{
              opacity: cafeDesign.backgroundImageOpacity || 0.1,
              borderRadius: cafeDesign.borderRadius - 2,
            }}
          >
            <HeaderContent />
          </ImageBackground>
        </ThemedCard>
      ) : (
        <ThemedCard style={cardStyle}>
          <HeaderContent />
        </ThemedCard>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backgroundImage: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoImage: {
    borderRadius: 8,
  },
  cardIconText: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  completeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  completeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default CustomCardHeader;

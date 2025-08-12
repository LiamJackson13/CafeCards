/**
 * QR Code Scanner Utilities
 *
 * Contains QR code parsing, validation, and processing logic.
 */

/**
 * Parses QR code data and extracts customer information.
 * Supports both new (JSON) and legacy (plain text) formats.
 * @param {string} qrData - Raw QR code data
 * @returns {Object} Parsed customer data and scan type
 */
export const parseQRCode = (qrData) => {
  let customer;
  let isRedemptionQR = false;
  let scanType = "stamp"; // 'stamp' or 'redemption'

  try {
    // Try to parse as JSON
    const parsedData = JSON.parse(qrData);

    if (parsedData.type === "loyalty_card" && parsedData.app === "cafe-cards") {
      // QR format for adding stamps
      customer = {
        id: parsedData.userId,
        name: parsedData.customerName,
        email: parsedData.email,
        cardId: parsedData.cardId,
        issueDate: parsedData.issueDate,
      };
      scanType = "stamp";
    } else if (
      parsedData.type === "reward_redemption" &&
      parsedData.app === "cafe-cards"
    ) {
      // Redemption QR format
      isRedemptionQR = true;
      scanType = "redemption";
      customer = {
        id: parsedData.customerId,
        name: parsedData.customerName,
        email: parsedData.email,
        cardId: parsedData.cardId,
        currentStamps: parsedData.currentStamps,
        availableRewards: parsedData.availableRewards || 0,
      };
    } else {
      throw new Error("Invalid QR format");
    }
  } catch (_error) {
    // Fallback for old format or plain text
    customer = {
      id: "customer_" + Math.random().toString(36).substring(2, 9),
      name: "Unknown Customer",
      email: "unknown@example.com",
      cardId: qrData.length > 20 ? qrData.substring(0, 20) + "..." : qrData,
    };
    scanType = "stamp";
  }

  return {
    customer,
    isRedemptionQR,
    scanType,
    isValidFormat: !isRedemptionQR ? true : customer.id !== undefined,
  };
};

/**
 * Validates if QR code data is from our cafe cards app.
 * @param {string} qrData - Raw QR code data
 * @returns {boolean} Whether the QR is valid cafe cards format
 */
export const isValidCafeCardsQR = (qrData) => {
  try {
    const parsedData = JSON.parse(qrData);
    return (
      parsedData.app === "cafe-cards" &&
      (parsedData.type === "loyalty_card" ||
        parsedData.type === "reward_redemption")
    );
  } catch {
    // Accept any data as potentially valid (just in case yk)
    return true;
  }
};

/**
 * Creates a scan history entry for display or logging.
 * @param {Object} customer - Customer data
 * @param {string} scanType - Type of scan ('stamp' or 'redemption')
 * @param {string} status - Scan status ('success' or 'error')
 * @param {string} message - Status message
 * @param {number} stampsAdded - Number of stamps added (optional)
 * @returns {Object} Scan history entry
 */
export const createScanHistoryEntry = (
  customer,
  scanType,
  status,
  message,
  stampsAdded = 0
) => ({
  id: Math.random().toString(36).substring(2, 9),
  timestamp: new Date(),
  customer,
  type: scanType,
  status,
  message,
  stampsAdded,
  formattedTime: new Date().toLocaleTimeString(),
});

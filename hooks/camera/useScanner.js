/**
 * useScanner
 *
 * Custom React hook for handling QR code scanning, processing, and scan history.
 * Manages state for scanning, debouncing, stamp addition, reward redemption, and manual entry.
 * Designed for use with cafe user flows and integrates with Appwrite backend.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { addStampToCard, redeemReward } from "../../lib/appwrite";
import {
  createScanHistoryEntry,
  parseQRCode,
} from "../../lib/scanner/qr-parser";

export const useScanner = (user, isCafeUser) => {
  // Whether a barcode scan has been handled (prevents duplicate processing)
  const [scanned, setScanned] = useState(false);
  // Array of recent scan entries with status and messages (max length 10)
  const [scanHistory, setScanHistory] = useState([]);
  // Indicates a scan or redemption is currently being processed
  const [isProcessing, setIsProcessing] = useState(false);

  // Controls stamp addition modal visibility and target customer
  const [showStampModal, setShowStampModal] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState(null);
  const [stampsToAdd, setStampsToAdd] = useState(1);

  // Tracks redemption success feedback and stores the redeemed customer info
  const [showRedemptionSuccess, setShowRedemptionSuccess] = useState(false);
  const [redeemedCustomer, setRedeemedCustomer] = useState(null);

  // Tracks stamp addition success feedback and stores the stamp info
  const [showStampNotification, setShowStampNotification] = useState(false);
  const [stampNotificationData, setStampNotificationData] = useState(null);

  // Manual entry state for entering card ID directly
  const [isManualEntryVisible, setIsManualEntryVisible] = useState(false);
  const [manualCardId, setManualCardId] = useState("");

  // Ref for auto-reset timer: clears stuck processing after timeout
  const processingTimeoutRef = useRef(null);
  // Ref to store last scanned data and timestamp for debounce logic
  const lastScannedRef = useRef({ data: null, timestamp: 0 });
  // Minimum interval between handling the same QR scan (ms)
  const DEBOUNCE_TIME = 3000;

  // Auto-reset stuck processing state after 30 seconds to avoid permanent lockups
  useEffect(() => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    if (isProcessing) {
      processingTimeoutRef.current = setTimeout(() => {
        console.warn("Scanner: Auto-resetting stuck processing state");
        setIsProcessing(false);
        setScanned(false);
        setShowStampModal(false);
        setPendingCustomer(null);
        lastScannedRef.current = { data: null, timestamp: 0 };
      }, 30000);
    }
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
    };
  }, [isProcessing]);

  // Adds a new entry to scanHistory, keeping only the latest 10 entries
  const addToScanHistory = useCallback(
    (customer, scanType, status, message, stampsAdded = 0) => {
      const entry = createScanHistoryEntry(
        customer,
        scanType,
        status,
        message,
        stampsAdded
      );
      setScanHistory((prev) => [entry, ...prev].slice(0, 10));
    },
    []
  );

  // Main barcode scan handler:
  // Handles incoming QR scans, debouncing duplicates, parsing data, authorization checks, and routing to appropriate flow
  const handleBarCodeScanned = useCallback(
    async ({ type, data }) => {
      // Get current timestamp for debounce comparison
      const now = Date.now();
      // Ignore if same QR data scanned within DEBOUNCE_TIME window
      if (
        lastScannedRef.current.data === data &&
        now - lastScannedRef.current.timestamp < DEBOUNCE_TIME
      ) {
        return; // Skip duplicate scan too soon
      }
      // Prevent new scans while already marked or processing
      if (scanned || isProcessing) {
        return; // Avoid overlapping processing
      }
      // Record this scan event data and time
      lastScannedRef.current = { data, timestamp: now };
      setScanned(true); // Mark scan as handled
      setIsProcessing(true); // Enter processing state (e.g., show loader)

      try {
        // Parse the QR code string into structured info
        const { customer, isRedemptionQR, scanType } = parseQRCode(data);

        // Restrict scan operations to cafe staff users only
        if (!isCafeUser) {
          // Log access denied error in history
          addToScanHistory(
            customer,
            scanType,
            "error",
            "Access denied: Cafe user required",
            0
          );
          // After a delay, reset scan state for retry
          setTimeout(() => {
            setScanned(false);
            lastScannedRef.current = { data: null, timestamp: 0 };
          }, 2000);
          return; // Exit early on unauthorized access
        }

        // Check for invalid card (Unknown Customer indicates failed parsing)
        if (customer.name === "Unknown Customer") {
          throw new Error("Card not found - Invalid card ID or QR code format");
        }

        // Decide between redemption or stamp flow
        if (isRedemptionQR) {
          await handleRewardRedemption(customer); // Process redemption path
        } else {
          // Prepare and display the stamp addition UI
          setPendingCustomer(customer);
          setStampsToAdd(1);
          setShowStampModal(true);
        }
      } catch (error) {
        // On parse or API errors, log as Unknown customer entry
        addToScanHistory(
          { name: "Unknown" },
          "stamp",
          "error",
          `Error: ${error.message}`,
          0
        );

        // Show user-friendly error message
        Alert.alert("Card Error", error.message || "Failed to process card");

        // Allow retries by resetting scan markers after timeout
        setTimeout(() => {
          setScanned(false);
          lastScannedRef.current = { data: null, timestamp: 0 };
        }, 2000);
      } finally {
        // Always clear processing state when done
        setIsProcessing(false);
      }
    },
    [
      scanned,
      isProcessing,
      isCafeUser,
      addToScanHistory,
      handleRewardRedemption,
    ]
  );

  // Processes reward redemption flows:
  // - Calls backend redemption API
  // - Records success/error in history
  // - Displays feedback modal
  const handleRewardRedemption = useCallback(
    async (customer) => {
      try {
        await redeemReward(customer.id, user.$id);
        addToScanHistory(
          customer,
          "redemption",
          "success",
          "Reward redeemed successfully!",
          0
        );
        setRedeemedCustomer(customer);
        setShowRedemptionSuccess(true);
      } catch (error) {
        addToScanHistory(
          customer,
          "redemption",
          "error",
          `Redemption failed: ${error.message}`,
          0
        );
      } finally {
        setTimeout(() => {
          setScanned(false);
          lastScannedRef.current = { data: null, timestamp: 0 };
        }, 1000);
      }
    },
    [user, addToScanHistory]
  );

  // Confirms and applies stamp additions:
  // - Adds one or more stamps to customer card via backend
  // - Logs result in history
  // - Shows stamp notification
  // - Closes modal and resets scanner state
  const confirmStampAddition = useCallback(async () => {
    if (!pendingCustomer) return;
    try {
      // Add all stamps in a single call instead of a loop
      await addStampToCard(pendingCustomer, user.$id, stampsToAdd);

      const stampText = stampsToAdd === 1 ? "stamp" : "stamps";
      addToScanHistory(
        pendingCustomer,
        "stamp",
        "success",
        `${stampsToAdd} ${stampText} added successfully!`,
        stampsToAdd
      );

      // Show stamp notification
      setStampNotificationData({
        customer: pendingCustomer,
        stampsAdded: stampsToAdd,
        cafeName: user?.name || user?.email?.split("@")[0], // Use cafe name
      });
      setShowStampNotification(true);
    } catch (error) {
      addToScanHistory(
        pendingCustomer,
        "stamp",
        "error",
        `Failed to add stamps: ${error.message}`,
        0
      );
    } finally {
      // Close modal and reset scanner state
      setShowStampModal(false);
      setPendingCustomer(null);
      setStampsToAdd(1);
      setScanned(false);
    }
  }, [pendingCustomer, stampsToAdd, user, addToScanHistory]);

  // Cancels stamp addition flow and resets related state
  const cancelStampAddition = useCallback(() => {
    setShowStampModal(false);
    setPendingCustomer(null);
    setStampsToAdd(1);
    setScanned(false);
  }, []);

  // Handles manual card ID entry by delegating to barcode handler
  const processManualEntry = useCallback(
    async (cardId) => {
      if (!cardId.trim()) return;
      setIsProcessing(true);
      try {
        await handleBarCodeScanned({
          type: "manual",
          data: cardId.trim(),
        });
        setManualCardId("");
        setIsManualEntryVisible(false);
      } catch (_error) {
        // Error already handled in handleBarCodeScanned
      } finally {
        setIsProcessing(false);
      }
    },
    [handleBarCodeScanned]
  );

  // Wrapper for manual entry submission
  const handleManualEntry = useCallback(async () => {
    await processManualEntry(manualCardId);
  }, [processManualEntry, manualCardId]);

  // Closes redemption success feedback and clears customer info
  const dismissRedemptionSuccess = useCallback(() => {
    setShowRedemptionSuccess(false);
    setRedeemedCustomer(null);
  }, []);

  // Closes stamp notification and clears stamp data
  const dismissStampNotification = useCallback(() => {
    setShowStampNotification(false);
    setStampNotificationData(null);
  }, []);

  return {
    // State
    scanned,
    scanHistory,
    isProcessing,
    showStampModal,
    pendingCustomer,
    stampsToAdd,
    showRedemptionSuccess,
    redeemedCustomer,
    showStampNotification,
    stampNotificationData,
    isManualEntryVisible,
    manualCardId,

    // Actions
    handleBarCodeScanned,
    confirmStampAddition,
    cancelStampAddition,
    processManualEntry,
    handleManualEntry,
    dismissRedemptionSuccess,
    dismissStampNotification,
    setStampsToAdd,
    setIsManualEntryVisible,
    setManualCardId,
  };
};

/**
 * Scanner Logic Hook
 *
 * Handles QR code scanning, processing, and history management.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { addStampToCard, redeemReward } from "../../lib/appwrite";
import {
  createScanHistoryEntry,
  parseQRCode,
} from "../../lib/scanner/qr-parser";

export const useScanner = (user, isCafeUser) => {
  const [scanned, setScanned] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStampModal, setShowStampModal] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState(null);
  const [stampsToAdd, setStampsToAdd] = useState(1);
  // Redemption feedback state
  const [showRedemptionSuccess, setShowRedemptionSuccess] = useState(false);
  const [redeemedCustomer, setRedeemedCustomer] = useState(null);
  // Manual entry state
  const [isManualEntryVisible, setIsManualEntryVisible] = useState(false);
  const [manualCardId, setManualCardId] = useState("");

  // Safety mechanism to reset stuck scanner state
  const processingTimeoutRef = useRef(null);

  // QR code debouncing to prevent multiple scans of the same code
  const lastScannedRef = useRef({ data: null, timestamp: 0 });
  const DEBOUNCE_TIME = 3000; // 3 seconds between same QR scans

  useEffect(() => {
    // Clear any existing timeout when processing state changes
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }

    // If we're processing, set a timeout to auto-reset after 30 seconds
    if (isProcessing) {
      processingTimeoutRef.current = setTimeout(() => {
        console.warn("Scanner: Auto-resetting stuck processing state");
        setIsProcessing(false);
        setScanned(false);
        setShowStampModal(false);
        setPendingCustomer(null);
        // Clear debounce data on auto-reset
        lastScannedRef.current = { data: null, timestamp: 0 };
      }, 30000); // 30 second timeout
    }

    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
        processingTimeoutRef.current = null;
      }
    };
  }, [isProcessing]);

  const addToScanHistory = useCallback(
    (customer, scanType, status, message, stampsAdded = 0) => {
      const entry = createScanHistoryEntry(
        customer,
        scanType,
        status,
        message,
        stampsAdded
      );
      setScanHistory((prev) => [entry, ...prev].slice(0, 10)); // Keep last 10 entries
    },
    []
  );

  const handleBarCodeScanned = useCallback(
    async ({ type, data }) => {
      const now = Date.now();
      console.log("Scanner: Barcode scanned", {
        type,
        data: data?.substring(0, 50) + "...",
      });
      console.log("Scanner state:", { scanned, isProcessing });

      // Check for duplicate scan (same QR code within debounce time)
      if (
        lastScannedRef.current.data === data &&
        now - lastScannedRef.current.timestamp < DEBOUNCE_TIME
      ) {
        console.log(
          `Scanner: Ignoring duplicate scan within ${DEBOUNCE_TIME}ms`,
          {
            timeSinceLastScan: now - lastScannedRef.current.timestamp,
          }
        );
        return;
      }

      if (scanned || isProcessing) {
        console.log("Scanner: Scan blocked - already processing or scanned");
        return;
      }

      console.log("Scanner: Processing scan...");

      // Update last scanned data immediately to prevent duplicates
      lastScannedRef.current = { data, timestamp: now };

      setScanned(true);
      setIsProcessing(true);

      try {
        const { customer, isRedemptionQR, scanType } = parseQRCode(data);

        // Only proceed with Appwrite operations for cafe users
        if (!isCafeUser) {
          addToScanHistory(
            customer,
            scanType,
            "error",
            "Access denied: Cafe user required",
            0
          );
          // Reset scanner state after showing error
          setTimeout(() => {
            setScanned(false);
            // Clear debounce after access denied
            lastScannedRef.current = { data: null, timestamp: 0 };
          }, 2000);
          return;
        }

        if (isRedemptionQR) {
          // Handle reward redemption
          await handleRewardRedemption(customer);
        } else {
          // For stamp addition, show confirmation modal
          setPendingCustomer(customer);
          setStampsToAdd(1);
          setShowStampModal(true);
        }
      } catch (error) {
        console.error("Scan processing error:", error);
        addToScanHistory(
          { name: "Unknown" },
          "stamp",
          "error",
          `Error: ${error.message}`,
          0
        );
        // Reset scanner state after error
        setTimeout(() => {
          setScanned(false);
          // Clear debounce on errors to allow retry
          lastScannedRef.current = { data: null, timestamp: 0 };
        }, 2000);
      } finally {
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

        // Show success feedback
        setRedeemedCustomer(customer);
        setShowRedemptionSuccess(true);
      } catch (error) {
        console.error("Redemption error:", error);
        addToScanHistory(
          customer,
          "redemption",
          "error",
          `Redemption failed: ${error.message}`,
          0
        );
      } finally {
        // Reset scanner state to allow for additional scans
        setTimeout(() => {
          setScanned(false);
          // For redemptions, clear debounce after successful processing
          // This allows scanning different customers but prevents duplicate redemptions
          lastScannedRef.current = { data: null, timestamp: 0 };
        }, 1000); // Small delay to show feedback before allowing next scan
      }
    },
    [user, addToScanHistory]
  );

  const confirmStampAddition = useCallback(async () => {
    if (!pendingCustomer) return;

    try {
      for (let i = 0; i < stampsToAdd; i++) {
        await addStampToCard(pendingCustomer.id, user.$id);
      }

      const stampText = stampsToAdd === 1 ? "stamp" : "stamps";
      addToScanHistory(
        pendingCustomer,
        "stamp",
        "success",
        `${stampsToAdd} ${stampText} added successfully!`,
        stampsToAdd
      );
    } catch (error) {
      console.error("Error adding stamps:", error);
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
      setScanned(false); // Reset scanner state to allow new scans
    }
  }, [pendingCustomer, stampsToAdd, user, addToScanHistory]);

  const cancelStampAddition = useCallback(() => {
    setShowStampModal(false);
    setPendingCustomer(null);
    setStampsToAdd(1);
    setScanned(false); // Reset scanner state when cancelling
  }, []);

  const resetScanner = useCallback(() => {
    console.log("Scanner: Manual reset triggered");
    setScanned(false);
    setIsProcessing(false);
    // Clear debounce data to allow immediate re-scanning
    lastScannedRef.current = { data: null, timestamp: 0 };
  }, []);

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
      } catch (error) {
        console.error("Manual entry error:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [handleBarCodeScanned]
  );

  const handleManualEntry = useCallback(async () => {
    await processManualEntry(manualCardId);
  }, [processManualEntry, manualCardId]);

  const dismissRedemptionSuccess = useCallback(() => {
    setShowRedemptionSuccess(false);
    setRedeemedCustomer(null);
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
    isManualEntryVisible,
    manualCardId,

    // Actions
    handleBarCodeScanned,
    confirmStampAddition,
    cancelStampAddition,
    resetScanner,
    processManualEntry,
    handleManualEntry,
    dismissRedemptionSuccess,
    setStampsToAdd,
    setIsManualEntryVisible,
    setManualCardId,
  };
};

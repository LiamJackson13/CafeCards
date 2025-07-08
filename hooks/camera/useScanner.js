/**
 * useScanner
 *
 * Custom React hook for handling QR code scanning, processing, and scan history.
 * Manages state for scanning, debouncing, stamp addition, reward redemption, and manual entry.
 * Designed for use with cafe user flows and integrates with Appwrite backend.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { addStampToCard, redeemReward } from "../../lib/appwrite";
import {
  createScanHistoryEntry,
  parseQRCode,
} from "../../lib/scanner/qr-parser";

export const useScanner = (user, isCafeUser) => {
  // State for scanning and processing
  const [scanned, setScanned] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // State for stamp modal and pending customer
  const [showStampModal, setShowStampModal] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState(null);
  const [stampsToAdd, setStampsToAdd] = useState(1);

  // State for redemption feedback
  const [showRedemptionSuccess, setShowRedemptionSuccess] = useState(false);
  const [redeemedCustomer, setRedeemedCustomer] = useState(null);

  // State for manual entry
  const [isManualEntryVisible, setIsManualEntryVisible] = useState(false);
  const [manualCardId, setManualCardId] = useState("");

  // Timeout and debounce refs
  const processingTimeoutRef = useRef(null);
  const lastScannedRef = useRef({ data: null, timestamp: 0 });
  const DEBOUNCE_TIME = 3000; // 3 seconds between same QR scans

  // Auto-reset stuck processing state after 30s
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

  // Add an entry to scan history (max 10 entries)
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

  // Main barcode scan handler
  const handleBarCodeScanned = useCallback(
    async ({ type, data }) => {
      const now = Date.now();
      // Debounce: ignore duplicate scans within DEBOUNCE_TIME
      if (
        lastScannedRef.current.data === data &&
        now - lastScannedRef.current.timestamp < DEBOUNCE_TIME
      ) {
        return;
      }
      if (scanned || isProcessing) {
        return;
      }
      lastScannedRef.current = { data, timestamp: now };
      setScanned(true);
      setIsProcessing(true);

      try {
        const { customer, isRedemptionQR, scanType } = parseQRCode(data);

        // Only cafe users can process scans
        if (!isCafeUser) {
          addToScanHistory(
            customer,
            scanType,
            "error",
            "Access denied: Cafe user required",
            0
          );
          setTimeout(() => {
            setScanned(false);
            lastScannedRef.current = { data: null, timestamp: 0 };
          }, 2000);
          return;
        }

        if (isRedemptionQR) {
          await handleRewardRedemption(customer);
        } else {
          setPendingCustomer(customer);
          setStampsToAdd(1);
          setShowStampModal(true);
        }
      } catch (error) {
        addToScanHistory(
          { name: "Unknown" },
          "stamp",
          "error",
          `Error: ${error.message}`,
          0
        );
        setTimeout(() => {
          setScanned(false);
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

  // Reward redemption handler
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

  // Confirm stamp addition (after modal)
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

  // Cancel stamp addition
  const cancelStampAddition = useCallback(() => {
    setShowStampModal(false);
    setPendingCustomer(null);
    setStampsToAdd(1);
    setScanned(false);
  }, []);

  // Manual scanner reset
  const resetScanner = useCallback(() => {
    setScanned(false);
    setIsProcessing(false);
    lastScannedRef.current = { data: null, timestamp: 0 };
  }, []);

  // Manual entry processing
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
        // Error already handled in handleBarCodeScanned
      } finally {
        setIsProcessing(false);
      }
    },
    [handleBarCodeScanned]
  );

  // Manual entry handler
  const handleManualEntry = useCallback(async () => {
    await processManualEntry(manualCardId);
  }, [processManualEntry, manualCardId]);

  // Dismiss redemption success feedback
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

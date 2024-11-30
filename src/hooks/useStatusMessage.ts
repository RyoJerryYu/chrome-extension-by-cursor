import { useState, useCallback } from 'react';

export type StatusType = "success" | "error";

export type ShowStatus = (message: string, type: StatusType) => void;

export type HandleOperation = <T>(
  operation: () => Promise<T>,
  messages: { successMessage: string; errorMessage: string }
) => Promise<T | undefined>;

interface StatusMessage {
  message: string;
  type: StatusType;
}

export function useStatusMessage(timeout = 3000) {
  const [status, setStatus] = useState<StatusMessage | null>(null);

  const showStatus: ShowStatus = useCallback((message, type) => {
    setStatus({ message, type });
    setTimeout(() => setStatus(null), timeout);
  }, [timeout]);

  const handleOperation: HandleOperation = useCallback(async (operation, { successMessage, errorMessage }) => {
    try {
      const result = await operation();
      showStatus(successMessage, "success");
      return result;
    } catch (err) {
      showStatus(errorMessage, "error");
      return undefined;
    }
  }, [showStatus]);

  return { status, showStatus, handleOperation };
}
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  storage,
  Payment,
  generateId,
  generateTransactionId,
} from "@/utils/storage";
import { useAuth } from "./AuthContext";

interface PaymentContextType {
  payments: Payment[];
  isLoading: boolean;
  addPayment: (
    paymentData: Omit<Payment, "id" | "userId" | "transactionId" | "createdAt" | "status">
  ) => Promise<Payment>;
  getPaymentsByType: (type: Payment["type"]) => Payment[];
  getRecentPayments: (count?: number) => Payment[];
  getPendingAmount: () => number;
  refreshPayments: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

interface PaymentProviderProps {
  children: ReactNode;
}

export function PaymentProvider({ children }: PaymentProviderProps) {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPayments();
    } else {
      setPayments([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const savedPayments = await storage.getPayments();
      setPayments(savedPayments);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPayments = async () => {
    await loadPayments();
  };

  const addPayment = async (
    paymentData: Omit<Payment, "id" | "userId" | "transactionId" | "createdAt" | "status">
  ): Promise<Payment> => {
    const newPayment: Payment = {
      ...paymentData,
      id: generateId(),
      userId: user?.id || "",
      transactionId: generateTransactionId(),
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    await storage.addPayment(newPayment);
    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  };

  const getPaymentsByType = (type: Payment["type"]): Payment[] => {
    return payments.filter((p) => p.type === type);
  };

  const getRecentPayments = (count: number = 3): Payment[] => {
    return payments.slice(0, count);
  };

  const getPendingAmount = (): number => {
    return 0;
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        isLoading,
        addPayment,
        getPaymentsByType,
        getRecentPayments,
        getPendingAmount,
        refreshPayments,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments(): PaymentContextType {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayments must be used within a PaymentProvider");
  }
  return context;
}

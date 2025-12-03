import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER: "@mcd_user",
  PAYMENTS: "@mcd_payments",
  AUTH_TOKEN: "@mcd_auth_token",
};

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  propertyId: string;
  address: string;
  createdAt: string;

  // ✅ NEW FIELD — FIXES YOUR ERROR
  profileImage?: string;
}

export interface Payment {
  id: string;
  userId: string;
  propertyId: string;
  type: "house_rent" | "property_tax" | "water_charges" | "sewage_tax" | "other";
  amount: number;
  period: string;
  notes: string;
  status: "pending" | "completed" | "failed";
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
}

export const storage = {
  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  },

  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user:", error);
    }
  },

  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Error clearing user:", error);
    }
  },

  async getPayments(): Promise<Payment[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting payments:", error);
      return [];
    }
  },

  async addPayment(payment: Payment): Promise<void> {
    try {
      const payments = await this.getPayments();
      payments.unshift(payment);
      await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  },

  async clearPayments(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    } catch (error) {
      console.error("Error clearing payments:", error);
    }
  },

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  },

  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error("Error setting auth token:", error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.PAYMENTS,
        STORAGE_KEYS.AUTH_TOKEN,
      ]);
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },
};

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateTransactionId(): string {
  const prefix = "MCD";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getPaymentTypeLabel(type: Payment["type"]): string {
  const labels: Record<Payment["type"], string> = {
    house_rent: "House Rent",
    property_tax: "Property Tax",
    water_charges: "Water Charges",
    sewage_tax: "Sewage Tax",
    other: "Other",
  };
  return labels[type];
}

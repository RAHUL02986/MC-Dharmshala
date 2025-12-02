import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { usePayments } from "@/contexts/PaymentContext";
import {
  Spacing,
  BorderRadius,
  Colors,
} from "@/constants/theme";
import Spacer from "@/components/Spacer";
import { formatCurrency, getPaymentTypeLabel, Payment } from "@/utils/storage";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type PaymentConfirmScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "PaymentConfirm">;
  route: RouteProp<HomeStackParamList, "PaymentConfirm">;
};

type PaymentMethod = "upi" | "card" | "netbanking";

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { id: "upi", label: "UPI", icon: "smartphone" },
  { id: "card", label: "Card", icon: "credit-card" },
  { id: "netbanking", label: "Net Banking", icon: "globe" },
];

export default function PaymentConfirmScreen({
  navigation,
  route,
}: PaymentConfirmScreenProps) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { addPayment } = usePayments();
  const { type, amount, period, notes } = route.params;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const successColor = isDark ? Colors.dark.success : Colors.light.success;

  const handlePayment = async () => {
    if (!termsAccepted) {
      Alert.alert("Error", "Please accept the terms and conditions");
      return;
    }

    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const payment = await addPayment({
        propertyId: user?.propertyId || "",
        type: type as Payment["type"],
        amount,
        period,
        notes,
        paymentMethod: selectedMethod,
      });

      navigation.replace("Receipt", { paymentId: payment.id });
    } catch (error) {
      Alert.alert("Payment Failed", "Please try again later");
      setIsProcessing(false);
    }
  };

  const getPeriodLabel = (p: string) => {
    switch (p) {
      case "monthly":
        return "Monthly";
      case "quarterly":
        return "Quarterly";
      case "yearly":
        return "Yearly";
      default:
        return p;
    }
  };

  return (
    <ScreenScrollView>
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <ThemedText
          type="small"
          style={[styles.summaryLabel, { color: theme.textSecondary }]}
        >
          PAYMENT SUMMARY
        </ThemedText>

        <Spacer height={Spacing.lg} />

        <View style={styles.summaryRow}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Payment Type
          </ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {getPaymentTypeLabel(type as Payment["type"])}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.summaryRow}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Property ID
          </ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {user?.propertyId}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.summaryRow}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Period
          </ThemedText>
          <ThemedText type="body" style={{ fontWeight: "600" }}>
            {getPeriodLabel(period)}
          </ThemedText>
        </View>

        {notes ? (
          <>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryRow}>
              <ThemedText type="body" style={{ color: theme.textSecondary }}>
                Notes
              </ThemedText>
              <ThemedText
                type="body"
                style={{ fontWeight: "500", flex: 1, textAlign: "right" }}
                numberOfLines={2}
              >
                {notes}
              </ThemedText>
            </View>
          </>
        ) : null}

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.summaryRow}>
          <ThemedText type="h4">Total Amount</ThemedText>
          <ThemedText type="h3" style={{ color: primaryColor }}>
            {formatCurrency(amount)}
          </ThemedText>
        </View>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText type="h4">Select Payment Method</ThemedText>

      <Spacer height={Spacing.lg} />

      <View style={styles.paymentMethods}>
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <Pressable
              key={method.id}
              style={[
                styles.paymentMethodCard,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: isSelected ? primaryColor : theme.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View
                style={[
                  styles.methodIcon,
                  {
                    backgroundColor: isSelected
                      ? Colors.light.primaryLight
                      : theme.backgroundSecondary,
                  },
                ]}
              >
                <Feather
                  name={method.icon}
                  size={24}
                  color={isSelected ? primaryColor : theme.textSecondary}
                />
              </View>
              <ThemedText
                type="body"
                style={{
                  fontWeight: isSelected ? "600" : "400",
                  marginLeft: Spacing.lg,
                }}
              >
                {method.label}
              </ThemedText>
              {isSelected ? (
                <View style={styles.checkmark}>
                  <Feather name="check-circle" size={24} color={successColor} />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <Spacer height={Spacing["2xl"]} />

      <Pressable
        style={styles.termsRow}
        onPress={() => setTermsAccepted(!termsAccepted)}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: termsAccepted ? primaryColor : "transparent",
              borderColor: termsAccepted ? primaryColor : theme.border,
            },
          ]}
        >
          {termsAccepted ? (
            <Feather name="check" size={14} color="#FFFFFF" />
          ) : null}
        </View>
        <ThemedText type="small" style={styles.termsText}>
          I agree to the Terms of Service and authorize this payment to the Municipal Corporation of Dharamshala
        </ThemedText>
      </Pressable>

      <Spacer height={Spacing["2xl"]} />

      <Button
        onPress={handlePayment}
        disabled={isProcessing || !termsAccepted}
        style={{ backgroundColor: successColor }}
      >
        {isProcessing ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          `Pay ${formatCurrency(amount)}`
        )}
      </Button>

      <Spacer height={Spacing.lg} />

      <View style={styles.secureNote}>
        <Feather name="shield" size={16} color={theme.textSecondary} />
        <ThemedText
          type="caption"
          style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}
        >
          Your payment is secured with 256-bit encryption
        </ThemedText>
      </View>

      <Spacer height={Spacing.xl} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  summaryLabel: {
    fontWeight: "600",
    letterSpacing: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.sm,
  },
  paymentMethods: {
    gap: Spacing.md,
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    marginLeft: "auto",
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    lineHeight: 20,
  },
  secureNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

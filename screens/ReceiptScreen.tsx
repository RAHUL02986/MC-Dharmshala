import React from "react";
import { StyleSheet, View, Pressable, Share, Platform } from "react-native";
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
import {
  formatCurrency,
  formatDateTime,
  getPaymentTypeLabel,
} from "@/utils/storage";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type ReceiptScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Receipt">;
  route: RouteProp<HomeStackParamList, "Receipt">;
};

export default function ReceiptScreen({
  navigation,
  route,
}: ReceiptScreenProps) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { payments } = usePayments();
  const { paymentId } = route.params;

  const payment = payments.find((p) => p.id === paymentId);
  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const successColor = isDark ? Colors.dark.success : Colors.light.success;

  if (!payment) {
    return (
      <ScreenScrollView contentContainerStyle={styles.centerContent}>
        <ThemedText type="h4">Receipt not found</ThemedText>
      </ScreenScrollView>
    );
  }

  const handleShare = async () => {
    try {
      const message = `Payment Receipt\n\nTransaction ID: ${payment.transactionId}\nAmount: ${formatCurrency(payment.amount)}\nType: ${getPaymentTypeLabel(payment.type)}\nDate: ${formatDateTime(payment.createdAt)}\nProperty ID: ${payment.propertyId}\n\nPaid to: Municipal Corporation of Dharamshala`;

      await Share.share({
        message,
        title: "Payment Receipt",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDone = () => {
    navigation.popToTop();
  };

  return (
    <ScreenScrollView>
      <View style={styles.successSection}>
        <View style={[styles.successIcon, { backgroundColor: "#E8F5E9" }]}>
          <Feather name="check" size={48} color={successColor} />
        </View>
        <Spacer height={Spacing.xl} />
        <ThemedText type="h2" style={styles.successTitle}>
          Payment Successful
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.successSubtitle, { color: theme.textSecondary }]}
        >
          Your payment has been processed successfully
        </ThemedText>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View
        style={[
          styles.receiptCard,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        ]}
      >
        <View style={styles.receiptHeader}>
          <View style={[styles.mcLogo, { backgroundColor: primaryColor }]}>
            <Feather name="home" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.receiptHeaderText}>
            <ThemedText type="body" style={{ fontWeight: "600" }}>
              Municipal Corporation
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Dharamshala, Himachal Pradesh
            </ThemedText>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.amountSection}>
          <ThemedText
            type="caption"
            style={{ color: theme.textSecondary, letterSpacing: 1 }}
          >
            AMOUNT PAID
          </ThemedText>
          <ThemedText
            type="h1"
            style={{ color: successColor, marginTop: Spacing.xs }}
          >
            {formatCurrency(payment.amount)}
          </ThemedText>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Transaction ID
            </ThemedText>
            <ThemedText type="small" style={{ fontWeight: "600" }}>
              {payment.transactionId}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Date and Time
            </ThemedText>
            <ThemedText type="small" style={{ fontWeight: "500" }}>
              {formatDateTime(payment.createdAt)}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Payment Type
            </ThemedText>
            <ThemedText type="small" style={{ fontWeight: "500" }}>
              {getPaymentTypeLabel(payment.type)}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Payment Method
            </ThemedText>
            <ThemedText type="small" style={{ fontWeight: "500" }}>
              {payment.paymentMethod.toUpperCase()}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Property ID
            </ThemedText>
            <ThemedText type="small" style={{ fontWeight: "500" }}>
              {payment.propertyId}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Paid By
            </ThemedText>
            <ThemedText type="small" style={{ fontWeight: "500" }}>
              {user?.fullName}
            </ThemedText>
          </View>

          <View style={styles.detailRow}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Status
            </ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: "#E8F5E9" }]}>
              <ThemedText
                type="caption"
                style={{ color: successColor, fontWeight: "600" }}
              >
                COMPLETED
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleShare}
        >
          <Feather name="share-2" size={20} color={primaryColor} />
          <ThemedText
            type="small"
            style={{ color: primaryColor, marginTop: Spacing.xs, fontWeight: "500" }}
          >
            Share
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleShare}
        >
          <Feather name="download" size={20} color={primaryColor} />
          <ThemedText
            type="small"
            style={{ color: primaryColor, marginTop: Spacing.xs, fontWeight: "500" }}
          >
            Download
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={handleShare}
        >
          <Feather name="mail" size={20} color={primaryColor} />
          <ThemedText
            type="small"
            style={{ color: primaryColor, marginTop: Spacing.xs, fontWeight: "500" }}
          >
            Email
          </ThemedText>
        </Pressable>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <Button onPress={handleDone}>Return to Home</Button>

      <Spacer height={Spacing.xl} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  successSection: {
    alignItems: "center",
    paddingTop: Spacing.xl,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    textAlign: "center",
  },
  successSubtitle: {
    textAlign: "center",
    marginTop: Spacing.sm,
  },
  receiptCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  receiptHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xl,
  },
  mcLogo: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  receiptHeaderText: {
    marginLeft: Spacing.lg,
  },
  divider: {
    height: 1,
  },
  amountSection: {
    alignItems: "center",
    padding: Spacing.xl,
  },
  detailsSection: {
    padding: Spacing.xl,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
});

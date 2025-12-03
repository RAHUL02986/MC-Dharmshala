import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { usePayments } from "@/contexts/PaymentContext";
import {
  Spacing,
  BorderRadius,
  Colors,
  Shadows,
} from "@/constants/theme";
import Spacer from "@/components/Spacer";
import { formatCurrency, formatDate, getPaymentTypeLabel } from "@/utils/storage";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "Dashboard">;
};

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { getRecentPayments } = usePayments();

  const recentPayments = getRecentPayments(3);
  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const successColor = isDark ? Colors.dark.success : Colors.light.success;

  return (
    <ScreenScrollView>
      <View
        style={[
          styles.propertyCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.propertyHeader}>
          <View style={[styles.propertyIcon, { backgroundColor: primaryColor }]}>
            <Feather name="home" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.propertyInfo}>
            <ThemedText type="h4">{user?.fullName}</ThemedText>
            <ThemedText
              type="small"
              style={{ color: theme.textSecondary, marginTop: 2 }}
            >
              Property ID: {user?.propertyId}
            </ThemedText>
          </View>
        </View>
        <View
          style={[styles.divider, { backgroundColor: theme.border }]}
        />
        <View style={styles.addressContainer}>
          <Feather
            name="map-pin"
            size={16}
            color={theme.textSecondary}
          />
          <ThemedText
            type="small"
            style={[styles.addressText, { color: theme.textSecondary }]}
            numberOfLines={2}
          >
            {user?.address}
          </ThemedText>
        </View>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Quick Actions</ThemedText>
      </View>

      <Spacer height={Spacing.lg} />

      <View style={styles.quickActionsGrid}>
        <Pressable
          style={({ pressed }) => [
            styles.quickActionCard,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => navigation.navigate("PaymentForm")}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: Colors.light.primaryLight }]}>
            <Feather name="credit-card" size={24} color={primaryColor} />
          </View>
          <ThemedText type="body" style={styles.quickActionText}>
            Pay Now
          </ThemedText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.quickActionCard,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => navigation.getParent()?.navigate("HistoryTab")}
        >
          <View style={[styles.quickActionIcon, { backgroundColor: "#E8F5E9" }]}>
            <Feather name="file-text" size={24} color={successColor} />
          </View>
          <ThemedText type="body" style={styles.quickActionText}>
            View History
          </ThemedText>
        </Pressable>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.sectionHeader}>
        <ThemedText type="h4">Recent Transactions</ThemedText>
        {recentPayments.length > 0 ? (
          <Pressable
            onPress={() => navigation.getParent()?.navigate("HistoryTab")}
          >
            <ThemedText type="small" style={{ color: primaryColor }}>
              View All
            </ThemedText>
          </Pressable>
        ) : null}
      </View>

      <Spacer height={Spacing.lg} />

      {recentPayments.length === 0 ? (
        <View
          style={[
            styles.emptyState,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="inbox" size={48} color={theme.textSecondary} />
          <ThemedText
            type="body"
            style={[styles.emptyStateText, { color: theme.textSecondary }]}
          >
            No transactions yet
          </ThemedText>
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, textAlign: "center" }}
          >
            Your payment history will appear here
          </ThemedText>
        </View>
      ) : (
        <View style={styles.transactionsList}>
          {recentPayments.map((payment, index) => (
            <Pressable
              key={payment.id}
              style={({ pressed }) => [
                styles.transactionCard,
                { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
                index < recentPayments.length - 1 && {
                  marginBottom: Spacing.md,
                },
              ]}
              onPress={() =>
                navigation.navigate("Receipt", { paymentId: payment.id })
              }
            >
              <View style={styles.transactionLeft}>
                <View
                  style={[
                    styles.transactionIcon,
                    { backgroundColor: Colors.light.primaryLight },
                  ]}
                >
                  <Feather name="check-circle" size={20} color={successColor} />
                </View>
                <View style={styles.transactionInfo}>
                  <ThemedText type="body" style={{ fontWeight: "500" }}>
                    {getPaymentTypeLabel(payment.type)}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {formatDate(payment.createdAt)}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <ThemedText
                  type="body"
                  style={{ fontWeight: "600", color: successColor }}
                >
                  {formatCurrency(payment.amount)}
                </ThemedText>
                <Feather
                  name="chevron-right"
                  size={20}
                  color={theme.textSecondary}
                />
              </View>
            </Pressable>
          ))}
        </View>
      )}

      <Spacer height={Spacing["2xl"]} />

      <View
        style={[
          styles.announcementCard,
          { backgroundColor: Colors.light.primaryLight },
        ]}
      >
        <View style={styles.announcementHeader}>
          <Feather name="bell" size={20} color={primaryColor} />
          <ThemedText
            type="body"
            style={[styles.announcementTitle, { color: primaryColor }]}
          >
            Municipal Notice
          </ThemedText>
        </View>
        <ThemedText
          type="small"
          style={{ color: Colors.light.primaryDark, marginTop: Spacing.sm }}
        >
          Pay your property tax before March 31st to avail 10% rebate on the total amount.
        </ThemedText>
      </View>

      <Spacer height={Spacing.xl} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  propertyCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  propertyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  propertyIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  propertyInfo: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressText: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickActionsGrid: {
    flexDirection: "row",
    gap: Spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  quickActionText: {
    fontWeight: "500",
    textAlign: "center",
  },
  emptyState: {
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  transactionsList: {},
  transactionCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  transactionInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  transactionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  announcementCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  announcementHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  announcementTitle: {
    fontWeight: "600",
    marginLeft: Spacing.sm,
  },
});

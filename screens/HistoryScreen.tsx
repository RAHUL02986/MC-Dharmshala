import React, { useState, useMemo } from "react";
import { StyleSheet, View, Pressable, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { usePayments } from "@/contexts/PaymentContext";
import {
  Spacing,
  BorderRadius,
  Colors,
} from "@/constants/theme";
import {
  formatCurrency,
  formatDate,
  getPaymentTypeLabel,
  Payment,
} from "@/utils/storage";
import type { HistoryStackParamList } from "@/navigation/HistoryStackNavigator";

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<HistoryStackParamList, "History">;
};

type FilterOption = "all" | "this_month" | "last_3_months" | "this_year";

const FILTERS: { id: FilterOption; label: string }[] = [
  { id: "all", label: "All" },
  { id: "this_month", label: "This Month" },
  { id: "last_3_months", label: "Last 3 Months" },
  { id: "this_year", label: "This Year" },
];

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const { theme, isDark } = useTheme();
  const { payments, isLoading } = usePayments();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();

  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const successColor = isDark ? Colors.dark.success : Colors.light.success;

  const filteredPayments = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    return payments.filter((payment) => {
      const paymentDate = new Date(payment.createdAt);

      switch (selectedFilter) {
        case "this_month":
          return (
            paymentDate.getMonth() === thisMonth &&
            paymentDate.getFullYear() === thisYear
          );
        case "last_3_months":
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return paymentDate >= threeMonthsAgo;
        case "this_year":
          return paymentDate.getFullYear() === thisYear;
        default:
          return true;
      }
    });
  }, [payments, selectedFilter]);

  const groupedPayments = useMemo(() => {
    const groups: { [key: string]: Payment[] } = {};

    filteredPayments.forEach((payment) => {
      const date = new Date(payment.createdAt);
      const monthYear = date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });

      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(payment);
    });

    return Object.entries(groups).map(([title, data]) => ({
      title,
      data,
    }));
  }, [filteredPayments]);

  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <Pressable
      style={({ pressed }) => [
        styles.paymentCard,
        { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={() => navigation.navigate("ReceiptDetail", { paymentId: item.id })}
    >
      <View style={styles.paymentLeft}>
        <View
          style={[
            styles.paymentIcon,
            { backgroundColor: Colors.light.primaryLight },
          ]}
        >
          <Feather name="check-circle" size={20} color={successColor} />
        </View>
        <View style={styles.paymentInfo}>
          <ThemedText type="body" style={{ fontWeight: "500" }}>
            {getPaymentTypeLabel(item.type)}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {formatDate(item.createdAt)}
          </ThemedText>
          <ThemedText
            type="caption"
            style={{ color: theme.textSecondary, marginTop: 2 }}
          >
            {item.transactionId}
          </ThemedText>
        </View>
      </View>
      <View style={styles.paymentRight}>
        <ThemedText
          type="body"
          style={{ fontWeight: "600", color: successColor }}
        >
          {formatCurrency(item.amount)}
        </ThemedText>
        <Feather
          name="chevron-right"
          size={20}
          color={theme.textSecondary}
          style={{ marginTop: Spacing.xs }}
        />
      </View>
    </Pressable>
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <ThemedText
        type="small"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        {title}
      </ThemedText>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Feather name="inbox" size={64} color={theme.textSecondary} />
      <ThemedText
        type="h4"
        style={[styles.emptyStateTitle, { color: theme.textSecondary }]}
      >
        No Transactions Found
      </ThemedText>
      <ThemedText
        type="body"
        style={{ color: theme.textSecondary, textAlign: "center" }}
      >
        {selectedFilter === "all"
          ? "Your payment history will appear here"
          : "No transactions found for the selected period"}
      </ThemedText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.filtersContainer,
          {
            paddingTop: headerHeight + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => {
            const isSelected = selectedFilter === item.id;
            return (
              <Pressable
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected
                      ? primaryColor
                      : theme.backgroundDefault,
                    borderColor: isSelected ? primaryColor : theme.border,
                  },
                ]}
                onPress={() => setSelectedFilter(item.id)}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: isSelected ? "#FFFFFF" : theme.text,
                    fontWeight: isSelected ? "600" : "400",
                  }}
                >
                  {item.label}
                </ThemedText>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={groupedPayments}
        keyExtractor={(item) => item.title}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item: section }) => (
          <View>
            {renderSectionHeader(section.title)}
            {section.data.map((payment) => (
              <View key={payment.id} style={styles.paymentWrapper}>
                {renderPaymentItem({ item: payment })}
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingBottom: Spacing.md,
  },
  filtersList: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
  },
  sectionHeader: {
    paddingVertical: Spacing.md,
  },
  sectionTitle: {
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  paymentWrapper: {
    marginBottom: Spacing.md,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  paymentRight: {
    alignItems: "flex-end",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyStateTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
});

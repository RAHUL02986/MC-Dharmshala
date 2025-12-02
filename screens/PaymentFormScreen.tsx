import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import {
  Spacing,
  BorderRadius,
  Typography,
  Colors,
} from "@/constants/theme";
import Spacer from "@/components/Spacer";
import { Payment, formatCurrency } from "@/utils/storage";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type PaymentFormScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, "PaymentForm">;
};

type PaymentType = Payment["type"];

const PAYMENT_TYPES: { type: PaymentType; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { type: "house_rent", label: "House Rent", icon: "home" },
  { type: "property_tax", label: "Property Tax", icon: "file-text" },
  { type: "water_charges", label: "Water Charges", icon: "droplet" },
  { type: "sewage_tax", label: "Sewage Tax", icon: "git-merge" },
  { type: "other", label: "Other", icon: "more-horizontal" },
];

const PERIODS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export default function PaymentFormScreen({ navigation }: PaymentFormScreenProps) {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState<PaymentType>("house_rent");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("monthly");
  const [notes, setNotes] = useState("");

  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;

  const handleProceed = () => {
    if (!amount.trim()) {
      Alert.alert("Error", "Please enter the payment amount");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    navigation.navigate("PaymentConfirm", {
      type: selectedType,
      amount: numericAmount,
      period,
      notes: notes.trim(),
    });
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.backgroundDefault,
      color: theme.text,
      borderColor: theme.border,
    },
  ];

  return (
    <ScreenKeyboardAwareScrollView>
      <View
        style={[
          styles.propertyCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.propertyHeader}>
          <Feather name="home" size={20} color={primaryColor} />
          <ThemedText type="body" style={{ fontWeight: "600", marginLeft: Spacing.sm }}>
            {user?.propertyId}
          </ThemedText>
        </View>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
          numberOfLines={1}
        >
          {user?.address}
        </ThemedText>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText type="h4">Select Payment Type</ThemedText>

      <Spacer height={Spacing.lg} />

      <View style={styles.paymentTypesGrid}>
        {PAYMENT_TYPES.map((item) => {
          const isSelected = selectedType === item.type;
          return (
            <Pressable
              key={item.type}
              style={[
                styles.paymentTypeCard,
                {
                  backgroundColor: isSelected
                    ? Colors.light.primaryLight
                    : theme.backgroundDefault,
                  borderColor: isSelected ? primaryColor : theme.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
              onPress={() => setSelectedType(item.type)}
            >
              <Feather
                name={item.icon}
                size={24}
                color={isSelected ? primaryColor : theme.textSecondary}
              />
              <ThemedText
                type="small"
                style={[
                  styles.paymentTypeLabel,
                  { color: isSelected ? primaryColor : theme.text },
                ]}
              >
                {item.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.fieldContainer}>
        <ThemedText type="small" style={styles.label}>
          Amount (INR)
        </ThemedText>
        <View style={styles.amountInputWrapper}>
          <ThemedText
            type="h4"
            style={[styles.currencySymbol, { color: theme.textSecondary }]}
          >
            Rs.
          </ThemedText>
          <TextInput
            style={[inputStyle, styles.amountInput]}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Spacer height={Spacing.xl} />

      <View style={styles.fieldContainer}>
        <ThemedText type="small" style={styles.label}>
          Payment Period
        </ThemedText>
        <View style={styles.periodContainer}>
          {PERIODS.map((item) => {
            const isSelected = period === item.value;
            return (
              <Pressable
                key={item.value}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: isSelected
                      ? primaryColor
                      : theme.backgroundDefault,
                    borderColor: isSelected ? primaryColor : theme.border,
                  },
                ]}
                onPress={() => setPeriod(item.value)}
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
          })}
        </View>
      </View>

      <Spacer height={Spacing.xl} />

      <View style={styles.fieldContainer}>
        <ThemedText type="small" style={styles.label}>
          Notes (Optional)
        </ThemedText>
        <TextInput
          style={[inputStyle, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any additional notes"
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
        />
      </View>

      <Spacer height={Spacing["3xl"]} />

      <Button onPress={handleProceed}>
        {amount ? `Proceed to Pay ${formatCurrency(parseFloat(amount) || 0)}` : "Proceed to Payment"}
      </Button>

      <Spacer height={Spacing.xl} />
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  propertyCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  propertyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  paymentTypeCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.sm,
  },
  paymentTypeLabel: {
    marginTop: Spacing.sm,
    textAlign: "center",
    fontWeight: "500",
  },
  fieldContainer: {
    width: "100%",
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
  },
  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    marginRight: Spacing.md,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "600",
    height: 56,
  },
  periodContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  periodButton: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notesInput: {
    height: 100,
    paddingTop: Spacing.md,
    textAlignVertical: "top",
  },
});

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "@/screens/DashboardScreen";
import PaymentFormScreen from "@/screens/PaymentFormScreen";
import PaymentConfirmScreen from "@/screens/PaymentConfirmScreen";
import ReceiptScreen from "@/screens/ReceiptScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";
import { Payment } from "@/utils/storage";

export type HomeStackParamList = {
  Dashboard: undefined;
  PaymentForm: undefined;
  PaymentConfirm: {
    type: string;
    amount: number;
    period: string;
    notes: string;
  };
  Receipt: {
    paymentId: string;
  };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Dharamshala MC" />,
        }}
      />
      <Stack.Screen
        name="PaymentForm"
        component={PaymentFormScreen}
        options={{
          title: "Pay Rent",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
      <Stack.Screen
        name="PaymentConfirm"
        component={PaymentConfirmScreen}
        options={{
          title: "Confirm Payment",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
      <Stack.Screen
        name="Receipt"
        component={ReceiptScreen}
        options={{
          title: "Receipt",
          headerBackVisible: false,
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
    </Stack.Navigator>
  );
}

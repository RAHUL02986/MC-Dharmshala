import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HistoryScreen from "@/screens/HistoryScreen";
import ReceiptScreen from "@/screens/ReceiptScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HistoryStackParamList = {
  History: undefined;
  ReceiptDetail: {
    paymentId: string;
  };
};

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export default function HistoryStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Payment History",
        }}
      />
      <Stack.Screen
        name="ReceiptDetail"
        component={ReceiptDetailScreen}
        options={{
          title: "Receipt",
          ...getCommonScreenOptions({ theme, isDark, transparent: false }),
        }}
      />
    </Stack.Navigator>
  );
}

function ReceiptDetailScreen(props: any) {
  return <ReceiptScreen {...props} route={{ ...props.route, params: { paymentId: props.route.params.paymentId } }} />;
}

import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface HeaderTitleProps {
  title: string;
}

export function HeaderTitle({ title }: HeaderTitleProps) {
  const { isDark } = useTheme();
  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer]}>
        <Image
          source={require('@/assets/images/logo.png')} // path to your logo
          style={{ width: 88, height: 88, resizeMode: 'contain' }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconContainer: {
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
},

  title: {
    fontSize: 17,
    fontWeight: "600",
  },
});

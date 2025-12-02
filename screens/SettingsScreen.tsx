import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Switch,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import {
  Spacing,
  BorderRadius,
  Colors,
} from "@/constants/theme";
import Spacer from "@/components/Spacer";
import type { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "Settings">;
};

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const [paymentReminders, setPaymentReminders] = useState(true);
  const [announcements, setAnnouncements] = useState(true);

  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;
  const errorColor = isDark ? Colors.dark.error : Colors.light.error;

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleContact = () => {
    if (Platform.OS !== "web") {
      Linking.openURL("tel:+911892224000");
    } else {
      Alert.alert("Contact", "Call: +91 1892 224000");
    }
  };

  const renderMenuItem = (
    icon: keyof typeof Feather.glyphMap,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    isDestructive?: boolean
  ) => (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View
        style={[
          styles.menuIcon,
          {
            backgroundColor: isDestructive
              ? "#FFEBEE"
              : Colors.light.primaryLight,
          },
        ]}
      >
        <Feather
          name={icon}
          size={20}
          color={isDestructive ? errorColor : primaryColor}
        />
      </View>
      <View style={styles.menuContent}>
        <ThemedText
          type="body"
          style={{ color: isDestructive ? errorColor : theme.text }}
        >
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText
            type="small"
            style={{ color: theme.textSecondary, marginTop: 2 }}
          >
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {rightElement ? (
        rightElement
      ) : onPress ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );

  return (
    <ScreenScrollView>
      <View style={styles.profileSection}>
        <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
          <Feather name="user" size={40} color="#FFFFFF" />
        </View>
        <Spacer height={Spacing.lg} />
        <ThemedText type="h3">{user?.fullName}</ThemedText>
        <ThemedText
          type="body"
          style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
        >
          {user?.email}
        </ThemedText>
        <ThemedText
          type="small"
          style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
        >
          Property ID: {user?.propertyId}
        </ThemedText>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText
        type="small"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        PROPERTY DETAILS
      </ThemedText>

      <Spacer height={Spacing.md} />

      <View style={styles.menuGroup}>
        {renderMenuItem(
          "home",
          "Property Information",
          user?.address,
          () => navigation.navigate("EditProfile")
        )}
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText
        type="small"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        NOTIFICATIONS
      </ThemedText>

      <Spacer height={Spacing.md} />

      <View style={styles.menuGroup}>
        {renderMenuItem(
          "bell",
          "Payment Reminders",
          "Get notified before due dates",
          undefined,
          <Switch
            value={paymentReminders}
            onValueChange={setPaymentReminders}
            trackColor={{ false: theme.border, true: primaryColor }}
            thumbColor="#FFFFFF"
          />
        )}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        {renderMenuItem(
          "volume-2",
          "Municipal Announcements",
          "Receive important updates",
          undefined,
          <Switch
            value={announcements}
            onValueChange={setAnnouncements}
            trackColor={{ false: theme.border, true: primaryColor }}
            thumbColor="#FFFFFF"
          />
        )}
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText
        type="small"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        SUPPORT
      </ThemedText>

      <Spacer height={Spacing.md} />

      <View style={styles.menuGroup}>
        {renderMenuItem(
          "phone",
          "Contact Municipal Office",
          "+91 1892 224000",
          handleContact
        )}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        {renderMenuItem(
          "help-circle",
          "Help & FAQ",
          undefined,
          () => {}
        )}
      </View>

      <Spacer height={Spacing["2xl"]} />

      <ThemedText
        type="small"
        style={[styles.sectionTitle, { color: theme.textSecondary }]}
      >
        ABOUT
      </ThemedText>

      <Spacer height={Spacing.md} />

      <View style={styles.menuGroup}>
        {renderMenuItem(
          "info",
          "About",
          "Version 1.0.0",
          () => {}
        )}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        {renderMenuItem(
          "file-text",
          "Terms of Service",
          undefined,
          () => {}
        )}
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        {renderMenuItem(
          "shield",
          "Privacy Policy",
          undefined,
          () => {}
        )}
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.menuGroup}>
        {renderMenuItem(
          "log-out",
          "Logout",
          undefined,
          handleLogout,
          undefined,
          true
        )}
      </View>

      <Spacer height={Spacing["3xl"]} />

      <View style={styles.footer}>
        <Feather name="home" size={24} color={theme.textSecondary} />
        <ThemedText
          type="small"
          style={[styles.footerText, { color: theme.textSecondary }]}
        >
          Municipal Corporation of Dharamshala
        </ThemedText>
        <ThemedText
          type="caption"
          style={{ color: theme.textSecondary }}
        >
          Making Dharamshala Digital
        </ThemedText>
      </View>

      <Spacer height={Spacing.xl} />
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    paddingTop: Spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontWeight: "600",
    letterSpacing: 1,
    paddingHorizontal: Spacing.xs,
  },
  menuGroup: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  menuContent: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  divider: {
    height: 1,
    marginLeft: 72,
  },
  footer: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  footerText: {
    marginTop: Spacing.sm,
    fontWeight: "500",
  },
});

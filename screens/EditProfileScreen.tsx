import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import Spacer from "@/components/Spacer";
import type { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "EditProfile">;
};

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Please enter your address");
      return;
    }

    setIsLoading(true);

    try {
      await updateUser({
        fullName: fullName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.backgroundDefault,
      color: theme.text,
      borderColor: theme.border,
    },
  ];

  const renderInput = (
    icon: keyof typeof Feather.glyphMap,
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    options?: {
      keyboardType?: "default" | "phone-pad";
      autoCapitalize?: "none" | "words" | "sentences";
      multiline?: boolean;
      editable?: boolean;
    }
  ) => (
    <View style={styles.fieldContainer}>
      <ThemedText type="small" style={styles.label}>
        {label}
      </ThemedText>
      <View style={styles.inputWrapper}>
        <Feather
          name={icon}
          size={20}
          color={theme.textSecondary}
          style={[styles.inputIcon, options?.multiline && { top: Spacing.md + 2 }]}
        />
        <TextInput
          style={[
            inputStyle,
            styles.inputWithIcon,
            options?.multiline && styles.multilineInput,
            !options?.editable && { opacity: 0.6 },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          keyboardType={options?.keyboardType || "default"}
          autoCapitalize={options?.autoCapitalize || "sentences"}
          multiline={options?.multiline}
          textAlignVertical={options?.multiline ? "top" : "center"}
          editable={options?.editable !== false && !isLoading}
        />
      </View>
    </View>
  );

  return (
    <ScreenKeyboardAwareScrollView>
      <Spacer height={Spacing.xl} />

      {renderInput(
        "user",
        "Full Name",
        "Enter your full name",
        fullName,
        setFullName,
        { autoCapitalize: "words" }
      )}

      <Spacer height={Spacing.xl} />

      {renderInput(
        "mail",
        "Email Address",
        user?.email || "",
        user?.email || "",
        () => {},
        { editable: false }
      )}

      <Spacer height={Spacing.xl} />

      {renderInput(
        "phone",
        "Phone Number",
        "Enter your phone number",
        phone,
        setPhone,
        { keyboardType: "phone-pad" }
      )}

      <Spacer height={Spacing.xl} />

      {renderInput(
        "hash",
        "Property ID",
        user?.propertyId || "",
        user?.propertyId || "",
        () => {},
        { editable: false }
      )}

      <Spacer height={Spacing.xl} />

      {renderInput(
        "map-pin",
        "Property Address",
        "Enter your full address",
        address,
        setAddress,
        { multiline: true }
      )}

      <Spacer height={Spacing["3xl"]} />

      <Button onPress={handleSave} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          "Save Changes"
        )}
      </Button>

      <Spacer height={Spacing.xl} />
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    width: "100%",
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: Spacing.lg,
    zIndex: 1,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.body.fontSize,
    flex: 1,
  },
  inputWithIcon: {
    paddingLeft: Spacing.lg + 28,
  },
  multilineInput: {
    height: 100,
    paddingTop: Spacing.md,
  },
});

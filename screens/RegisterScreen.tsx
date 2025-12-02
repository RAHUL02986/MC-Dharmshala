import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthKeyboardAwareScrollView } from "@/components/AuthKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius, Typography, Colors } from "@/constants/theme";
import Spacer from "@/components/Spacer";
import type { AuthStackParamList } from "@/navigation/AuthStackNavigator";

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const { theme, isDark } = useTheme();
  const { register, isLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!propertyId.trim()) {
      Alert.alert("Error", "Please enter your property ID");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Please enter your address");
      return;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const success = await register({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      propertyId: propertyId.trim(),
      address: address.trim(),
    });

    if (!success) {
      Alert.alert("Registration Failed", "Please try again later");
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

  const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;

  const renderInput = (
    icon: keyof typeof Feather.glyphMap,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    options?: {
      keyboardType?: "default" | "email-address" | "phone-pad";
      autoCapitalize?: "none" | "words" | "sentences";
      secureTextEntry?: boolean;
      multiline?: boolean;
    }
  ) => (
    <View style={styles.inputWrapper}>
      <Feather
        name={icon}
        size={20}
        color={theme.textSecondary}
        style={styles.inputIcon}
      />
      <TextInput
        style={[
          inputStyle,
          styles.inputWithIcon,
          options?.multiline && styles.multilineInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        keyboardType={options?.keyboardType || "default"}
        autoCapitalize={options?.autoCapitalize || "sentences"}
        secureTextEntry={options?.secureTextEntry}
        multiline={options?.multiline}
        textAlignVertical={options?.multiline ? "top" : "center"}
        editable={!isLoading}
      />
    </View>
  );

  return (
    <AuthKeyboardAwareScrollView>
      <View style={styles.headerSection}>
        <View style={[styles.logoContainer, { backgroundColor: primaryColor }]}>
          <Feather name="user-plus" size={40} color="#FFFFFF" />
        </View>
        <Spacer height={Spacing.xl} />
        <ThemedText type="h2" style={styles.title}>
          Create Account
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          Register to pay your municipal dues
        </ThemedText>
      </View>

      <Spacer height={Spacing["2xl"]} />

      <View style={styles.form}>
        <View style={styles.fieldContainer}>
          <ThemedText type="small" style={styles.label}>
            Full Name
          </ThemedText>
          {renderInput("user", "Enter your full name", fullName, setFullName, {
            autoCapitalize: "words",
          })}
        </View>

        <Spacer height={Spacing.lg} />

        <View style={styles.fieldContainer}>
          <ThemedText type="small" style={styles.label}>
            Email Address
          </ThemedText>
          {renderInput("mail", "Enter your email", email, setEmail, {
            keyboardType: "email-address",
            autoCapitalize: "none",
          })}
        </View>

        <Spacer height={Spacing.lg} />

        <View style={styles.fieldContainer}>
          <ThemedText type="small" style={styles.label}>
            Phone Number
          </ThemedText>
          {renderInput("phone", "Enter your phone number", phone, setPhone, {
            keyboardType: "phone-pad",
          })}
        </View>

        <Spacer height={Spacing.lg} />

        <View style={styles.fieldContainer}>
          <ThemedText type="small" style={styles.label}>
            Property ID (Municipal Registration Number)
          </ThemedText>
          {renderInput(
            "hash",
            "Enter your property ID",
            propertyId,
            setPropertyId,
            { autoCapitalize: "none" }
          )}
        </View>

        <Spacer height={Spacing.lg} />

        <View style={styles.fieldContainer}>
          <ThemedText type="small" style={styles.label}>
            Property Address
          </ThemedText>
          {renderInput(
            "map-pin",
            "Enter your full address",
            address,
            setAddress,
            { multiline: true }
          )}
        </View>

        <Spacer height={Spacing.lg} />

        <View style={styles.fieldContainer}>
          <ThemedText type="small" style={styles.label}>
            Password
          </ThemedText>
          <View style={styles.inputWrapper}>
            <Feather
              name="lock"
              size={20}
              color={theme.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[inputStyle, styles.inputWithIcon, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!isLoading}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Feather
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
        </View>

        <Spacer height={Spacing.lg} />

        <View style={styles.fieldContainer}>
          <ThemedText type="small" style={styles.label}>
            Confirm Password
          </ThemedText>
          {renderInput(
            "lock",
            "Confirm your password",
            confirmPassword,
            setConfirmPassword,
            { secureTextEntry: !showPassword, autoCapitalize: "none" }
          )}
        </View>

        <Spacer height={Spacing["2xl"]} />

        <Button onPress={handleRegister} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            "Create Account"
          )}
        </Button>

        <Spacer height={Spacing["2xl"]} />

        <View style={styles.loginContainer}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Already have an account?{" "}
          </ThemedText>
          <Pressable onPress={() => navigation.goBack()}>
            <ThemedText type="body" style={{ color: primaryColor, fontWeight: "600" }}>
              Login
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <Spacer height={Spacing["3xl"]} />
    </AuthKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    alignItems: "center",
    paddingTop: Spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  form: {
    width: "100%",
  },
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
    top: Spacing.md + 2,
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
    height: 80,
    paddingTop: Spacing.md,
  },
  passwordInput: {
    paddingRight: Spacing.lg + 28,
  },
  passwordToggle: {
    position: "absolute",
    right: Spacing.lg,
    padding: Spacing.xs,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

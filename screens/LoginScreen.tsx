import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
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

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const { theme, isDark } = useTheme();
  const { login, isLoading, forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    const success = await login(email.trim(), password);
    if (!success) {
      Alert.alert(
        "Login Failed",
        "No account found with this email. Please register first."
      );
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

  return (
    <AuthKeyboardAwareScrollView
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.headerSection}>
        <View style={[styles.logoContainer, { backgroundColor: primaryColor }]}>
          <Feather name="home" size={48} color="#FFFFFF" />
        </View>
        <Spacer height={Spacing.xl} />
        <ThemedText type="h2" style={styles.title}>
          Welcome Back
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          Municipal Corporation of Dharamshala
        </ThemedText>
      </View>

      <Spacer height={Spacing["3xl"]} />

      <View style={styles.form}>
        <View style={styles.fieldContainer}>
          <ThemedText type="small" style={styles.label}>
            Email or Phone
          </ThemedText>
          <View style={styles.inputWrapper}>
            <Feather
              name="mail"
              size={20}
              color={theme.textSecondary}
              style={styles.inputIcon}
            />
            <TextInput
              style={[inputStyle, styles.inputWithIcon]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              editable={!isLoading}
            />
          </View>
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
              placeholder="Enter your password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="done"
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

        <Spacer height={Spacing.md} />

        <Pressable style={styles.forgotPassword} onPress={() => forgotPassword(email)}>
          <ThemedText type="small" style={{ color: primaryColor }}>
            Forgot Password?
          </ThemedText>
        </Pressable>

        <Spacer height={Spacing["2xl"]} />

        <Button onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            "Login"
          )}
        </Button>

        <Spacer height={Spacing["2xl"]} />

        <View style={styles.registerContainer}>
          <ThemedText type="body" style={{ color: theme.textSecondary }}>
            Don't have an account?{" "}
          </ThemedText>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <ThemedText type="body" style={{ color: primaryColor, fontWeight: "600" }}>
              Register
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <Spacer height={Spacing["3xl"]} />

      <View style={styles.footer}>
        <ThemedText
          type="small"
          style={[styles.footerText, { color: theme.textSecondary }]}
        >
          By continuing, you agree to our Terms of Service and Privacy Policy
        </ThemedText>
      </View>
    </AuthKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: Spacing["3xl"],
  },
  headerSection: {
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
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
  passwordInput: {
    paddingRight: Spacing.lg + 28,
  },
  passwordToggle: {
    position: "absolute",
    right: Spacing.lg,
    padding: Spacing.xs,
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  footerText: {
    textAlign: "center",
  },
});

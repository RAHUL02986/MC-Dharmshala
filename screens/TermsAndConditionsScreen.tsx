import { StyleSheet, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import Spacer from "@/components/Spacer";
import type { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type TermsAndConditionsScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "TermsAndConditions">;
};

export default function TermsAndConditionsScreen({ navigation }: TermsAndConditionsScreenProps) {
  const { theme } = useTheme();

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.container}>
        <ThemedText type="h1">Terms and Conditions</ThemedText>
        <Spacer height={Spacing.lg} />
        <ThemedText type="body">
          This is the Terms and Conditions page. Here you can add the full content of your terms and conditions.
        </ThemedText>
        <Spacer height={Spacing.lg} />
        <ThemedText type="body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </ThemedText>
        <Spacer height={Spacing["2xl"]} />
        <Button onPress={() => navigation.goBack()}>Back to Profile</Button>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
});

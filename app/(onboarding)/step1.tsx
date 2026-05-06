import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize } from '@/constants';

export default function OnboardingStep1() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingTop: insets.top }]}
      testID="onboarding-step1-screen"
    >
      <Text style={styles.text}>온보딩 Step 1 (signup2 매핑) — 작업 12에서 구현 예정</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.sans.regular,
    color: colors.ink[700],
  },
});

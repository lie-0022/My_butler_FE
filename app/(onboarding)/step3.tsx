import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { CTA } from '@/components/ui';
import { BottleGroup } from '@/components/illustrations';
import { useAuthStore } from '@/store/authStore';
import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/constants';

export default function OnboardingStep3Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const nickname = user?.name ?? '바텐더';

  const goToBar = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="onboarding-step3-screen">
      <StatusBar style="light" />

      <View style={styles.bottlesWrap} pointerEvents="none">
        <BottleGroup
          containerSize="lg"
          bottles={[
            { tone: 'green', label: '', size: 'sm' },
            { tone: 'amber', label: 'RESERVE', size: 'md' },
            { tone: 'clear', label: '', size: 'sm' },
          ]}
        />
      </View>

      <View style={[styles.content, { paddingBottom: insets.bottom + spacing[7] }]}>
        <Text style={styles.eyebrow}>— WELCOME TO THE COUNTER —</Text>
        <Text style={styles.heading}>
          반가워요, <Text style={styles.headingAccent}>{nickname}</Text>님.
        </Text>
        <Text style={styles.subheading}>이제 당신의 바 카운터를{'\n'}채워볼 차례예요.</Text>

        <View style={styles.ctaGroup}>
          <CTA variant="amber" onPress={goToBar} testID="onboarding-step3-enter-button">
            첫 재료 등록하기
          </CTA>
          <Pressable
            onPress={goToBar}
            hitSlop={6}
            style={styles.skipBtn}
            testID="onboarding-step3-skip-button"
          >
            <Text style={styles.skipText}>둘러보기 먼저 할게요</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink[900],
  },
  bottlesWrap: {
    position: 'absolute',
    top: '18%',
    alignSelf: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[7],
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.brass.base,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  heading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: 38,
    color: colors.paper[50],
    lineHeight: 38 * 1.05,
    letterSpacing: -0.7,
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  headingAccent: {
    fontFamily: fontFamily.serif.regular,
    color: colors.amber[200],
    fontStyle: 'italic',
  },
  subheading: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    lineHeight: fontSize.md * lineHeight.relaxed,
    textAlign: 'center',
    maxWidth: 280,
  },
  ctaGroup: {
    marginTop: spacing[7] + spacing[2], // 40
    width: '100%',
    gap: spacing[3],
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  skipText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
  },
});

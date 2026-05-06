import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { CTA } from '@/components/ui';
import { BottleGroup } from '@/components/illustrations';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';

export default function LoginFrontDoorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.root, { paddingTop: insets.top }]}
      testID="login-frontdoor-screen"
    >
      <StatusBar style="light" />

      {/* 우상단 히어로 병 그룹 (3 tone stack — 작업 16-2) */}
      <View style={styles.bottleWrap} pointerEvents="none">
        <BottleGroup
          containerSize="lg"
          bottles={[
            { tone: 'green', label: 'AMARO', size: 'sm' },
            { tone: 'clear', label: 'DRY GIN', size: 'md' },
            { tone: 'amber', label: 'RESERVE', size: 'md' },
          ]}
        />
      </View>

      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + spacing[7] },
        ]}
      >
        <Text style={styles.eyebrow}>MY · BUTLER · 2026</Text>

        <Text style={styles.heading}>
          당신의 서재,{'\n'}
          <Text style={styles.headingAccent}>한 잔의 기록</Text>
        </Text>

        <Text style={styles.subheading}>
          소장한 술과 취향을 기록하고,{'\n'}오늘 밤의 한 잔을 제안받으세요.
        </Text>

        <View style={styles.ctaGroup}>
          <CTA
            variant="amber"
            onPress={() => router.push('/(auth)/register')}
            testID="login-create-account-button"
          >
            계정 만들기
          </CTA>

          <Pressable
            onPress={() => router.push('/(auth)/login-email')}
            testID="login-existing-user-link"
            style={({ pressed }) => [
              styles.secondaryBtn,
              pressed && styles.secondaryBtnPressed,
            ]}
          >
            <Text style={styles.secondaryBtnText}>이미 있어요 · 로그인</Text>
          </Pressable>

          <Text style={styles.terms}>
            계속 진행 시 <Text style={styles.termsLink}>이용약관</Text> 및{' '}
            <Text style={styles.termsLink}>개인정보처리방침</Text>에 동의합니다
          </Text>
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
  bottleWrap: {
    position: 'absolute',
    top: 60,
    right: -20,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6] + spacing[1], // 28
    paddingTop: spacing[5],
    justifyContent: 'flex-end',
  },
  eyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.brass.base,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: spacing[3],
  },
  heading: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: 44,
    color: colors.paper[50],
    lineHeight: 44 * lineHeight.tight,
    letterSpacing: -0.9,
    marginBottom: spacing[1],
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
    marginTop: spacing[3],
    maxWidth: 290,
  },
  ctaGroup: {
    marginTop: spacing[7],
    gap: spacing[3],
  },
  secondaryBtn: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(250,246,239,0.25)',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryBtnPressed: {
    backgroundColor: 'rgba(250,246,239,0.05)',
  },
  secondaryBtnText: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.md,
    color: colors.paper[50],
  },
  terms: {
    marginTop: spacing[3],
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
  },
});

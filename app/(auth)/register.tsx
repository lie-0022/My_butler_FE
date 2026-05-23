import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { authApi } from '@/api/auth';
import { AppBar, BackBtn, CTA, Eyebrow, Input, ProgressDots } from '@/components/ui';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { parseApiError } from '@/utils/parseApiError';

const schema = z
  .object({
    email: z.string().email('올바른 이메일 형식이 아닙니다.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

type RegisterForm = z.infer<typeof schema>;

type EmailAvailability = 'idle' | 'checking' | 'available' | 'taken';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailAvailability>('idle');
  const kbVisible = useKeyboardVisible();
  const footerPadBottom = kbVisible ? spacing[3] : insets.bottom + spacing[5];

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', passwordConfirm: '' },
    mode: 'onChange', // 입력 즉시 isValid 갱신 — CTA 활성화 타이밍 자연스럽게
  });

  /**
   * 이메일 중복 인라인 체크.
   * BE에 check-email 엔드포인트가 없고, check-username은 username 규칙(^[A-Za-z0-9가-힣_]+$)을
   * 강제해서 이메일을 그대로 넣을 수 없다. 따라서 이메일 중복은 onSubmit 시점에 BE의
   * DUPLICATE_EMAIL(AUTH_001) 에러로만 잡는다. 인라인 표시는 비활성.
   */
  const checkEmailAvailable = async () => {
    if (!BACKEND_ENABLED) return;
    const email = getValues('email').trim();
    if (!email || !z.string().email().safeParse(email).success) return;
    setEmailStatus('idle');
  };

  const onSubmit = async (values: RegisterForm) => {
    if (!agreeTerms) {
      Alert.alert('약관 동의 필요', '이용약관 및 개인정보처리방침에 동의해주세요.');
      return;
    }
    // UI 단계: 백엔드 미연동. 작업 18에서 BACKEND_ENABLED=true로 활성.
    if (!BACKEND_ENABLED) {
      router.replace('/(onboarding)/step1');
      return;
    }
    setSubmitting(true);
    try {
      // BE가 user_<random8>로 자동 생성 → 사용자는 step1에서 닉네임으로 교체.
      await authApi.register({
        email: values.email,
        password: values.password,
        termsAgreed: agreeTerms,
        privacyAgreed: agreeTerms,
        marketingAgreed: false,
      });
      router.replace('/(onboarding)/step1');
    } catch (error) {
      Alert.alert('회원가입 실패', parseApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const emailHint =
    emailStatus === 'available'
      ? '사용 가능한 이메일입니다.'
      : emailStatus === 'taken'
        ? '이미 사용 중인 이메일입니다.'
        : errors.email?.message;
  const emailHintType: 'ok' | 'err' | 'default' =
    emailStatus === 'available'
      ? 'ok'
      : emailStatus === 'taken' || errors.email
        ? 'err'
        : 'default';

  const ctaDisabled = submitting || !isValid || !agreeTerms || emailStatus === 'taken';

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="register-screen">
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} testID="register-back-button" />}
        title="01 / 03"
        serif={false}
      />
      <ProgressDots step={1} total={3} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 70 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Eyebrow>STEP ONE</Eyebrow>
            <Text style={styles.heading}>
              먼저 <Text style={styles.headingAccent}>계정</Text>부터{'\n'}만들어 볼까요?
            </Text>

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="이메일"
                  placeholder="you@bar.com"
                  value={value}
                  onChangeText={(v) => {
                    onChange(v);
                    if (emailStatus !== 'idle') setEmailStatus('idle');
                  }}
                  onBlur={() => {
                    onBlur();
                    void checkEmailAvailable();
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  hint={emailHint}
                  hintType={emailHintType}
                  testID="register-email-input"
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="비밀번호"
                  placeholder="8자 이상"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="next"
                  hint={errors.password?.message ?? '숫자 · 특수문자 포함 권장'}
                  hintType={errors.password ? 'err' : 'default'}
                  testID="register-password-input"
                />
              )}
            />
            <Controller
              control={control}
              name="passwordConfirm"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="비밀번호 확인"
                  placeholder="한 번 더"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  hint={errors.passwordConfirm?.message}
                  hintType={errors.passwordConfirm ? 'err' : 'default'}
                  testID="register-password-confirm-input"
                />
              )}
            />

            <Pressable
              style={styles.termsRow}
              onPress={() => setAgreeTerms((v) => !v)}
              testID="register-terms-checkbox"
            >
              <View style={[styles.checkbox, agreeTerms && styles.checkboxOn]}>
                {agreeTerms ? (
                  <Svg width={11} height={11} viewBox="0 0 11 11">
                    <Path
                      d="M2 5.5L4.5 8l4.5-5"
                      stroke={colors.ink[900]}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                ) : null}
              </View>
              <Text style={styles.termsText}>
                <Text style={styles.termsLink}>이용약관</Text> 및{' '}
                <Text style={styles.termsLink}>개인정보처리방침</Text>에 동의합니다 (필수)
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: footerPadBottom }]}>
          <CTA
            variant="amber"
            onPress={handleSubmit(onSubmit)}
            disabled={ctaDisabled}
            testID="register-submit-button"
          >
            {submitting ? '가입 중...' : '다음으로'}
          </CTA>
          <Text style={styles.loginRow}>
            이미 계정이 있으신가요?{' '}
            <Text
              style={styles.loginLink}
              onPress={() => router.push('/(auth)/login-email')}
              testID="register-login-link"
            >
              로그인
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper[50],
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
  },
  heading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h1,
    color: colors.ink[900],
    lineHeight: fontSize.h1 * lineHeight.tight,
    letterSpacing: -0.6,
    marginTop: spacing[2],
    marginBottom: spacing[6],
  },
  headingAccent: {
    fontFamily: fontFamily.serif.bold,
    color: colors.amber[400],
    fontStyle: 'italic',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    marginTop: spacing[3],
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.xs + 1, // 5
    borderWidth: 1.5,
    borderColor: colors.paper[300],
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: {
    backgroundColor: colors.amber[300],
    borderColor: colors.amber[300],
  },
  termsText: {
    flex: 1,
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  termsLink: {
    color: colors.ink[900],
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
    backgroundColor: colors.paper[50],
    borderTopWidth: 1,
    borderTopColor: colors.paper[200],
    gap: spacing[3],
  },
  loginRow: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
    textAlign: 'center',
  },
  loginLink: {
    fontFamily: fontFamily.sans.semibold,
    color: colors.amber[500],
    textDecorationLine: 'underline',
  },
});

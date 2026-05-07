import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { authApi } from '@/api/auth';
import { AppBar, BackBtn, CTA, Eyebrow, Input, ProgressDots } from '@/components/ui';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
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

  // 기존 register.tsx의 username 중복확인 로직 보존 — email을 username 필드로 매핑.
  const checkEmailAvailable = async () => {
    if (!BACKEND_ENABLED) return; // UI 단계: 백엔드 호출 보류 (작업 18에서 활성)
    const email = getValues('email').trim();
    if (!email || !z.string().email().safeParse(email).success) return;
    setEmailStatus('checking');
    try {
      const res = await authApi.checkUsername(email);
      setEmailStatus(res.data.available ? 'available' : 'taken');
    } catch {
      setEmailStatus('idle');
    }
  };

  const onSubmit = async (values: RegisterForm) => {
    if (!agreeTerms) {
      Alert.alert('약관 동의 필요', '이용약관 및 개인정보처리방침에 동의해주세요.');
      return;
    }
    if (emailStatus === 'taken') {
      Alert.alert('이메일 중복', '이미 사용 중인 이메일입니다.');
      return;
    }
    // UI 단계: 백엔드 미연동. 작업 18에서 BACKEND_ENABLED=true로 활성.
    if (!BACKEND_ENABLED) {
      router.replace('/(onboarding)/step1');
      return;
    }
    setSubmitting(true);
    try {
      // 백엔드 username 필드에 email 매핑 (작업 18에서 정리 예정).
      await authApi.register({
        username: values.email,
        email: values.email,
        password: values.password,
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[5] }]}>
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

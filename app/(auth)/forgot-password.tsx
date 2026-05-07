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
import Svg, { Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { authApi } from '@/api/auth';
import { AppBar, BackBtn, CTA, Eyebrow, Input } from '@/components/ui';
import { colors, fontFamily, fontSize, lineHeight, shadows, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { parseApiError } from '@/utils/parseApiError';

const schema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
});

type ResetForm = z.infer<typeof schema>;
type ResetState = 'input' | 'sent';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<ResetState>('input');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const emailValue = watch('email');

  const onSubmit = async (values: ResetForm) => {
    // UI 단계: 백엔드 미연동. 작업 18에서 BACKEND_ENABLED=true로 활성.
    if (!BACKEND_ENABLED) {
      setSubmittedEmail(values.email);
      setState('sent');
      return;
    }
    setSubmitting(true);
    try {
      await authApi.requestPasswordReset({ email: values.email });
      setSubmittedEmail(values.email);
      setState('sent');
    } catch (error) {
      Alert.alert('오류', parseApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} testID="forgot-password-back-button" />}
        title="비밀번호 찾기"
        serif={false}
      />
      {state === 'input' ? (
        <InputView
          control={control}
          emailValue={emailValue}
          emailError={errors.email?.message}
          submitting={submitting}
          onSubmit={handleSubmit(onSubmit)}
          insetsBottom={insets.bottom}
        />
      ) : (
        <SentView
          email={submittedEmail}
          insetsBottom={insets.bottom}
          onBackToLogin={() => router.replace('/(auth)/login-email')}
          onResend={() => setState('input')}
        />
      )}
    </View>
  );
}

interface InputViewProps {
  control: ReturnType<typeof useForm<ResetForm>>['control'];
  emailValue: string;
  emailError: string | undefined;
  submitting: boolean;
  onSubmit: () => void;
  insetsBottom: number;
}

function InputView({
  control,
  emailValue,
  emailError,
  submitting,
  onSubmit,
  insetsBottom,
}: InputViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      testID="forgot-password-screen-input"
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Eyebrow>PASSWORD RESET</Eyebrow>
          <Text style={styles.heading}>
            <Text style={styles.headingAccent}>이메일</Text>을{'\n'}알려주세요
          </Text>
          <Text style={styles.subheading}>가입하신 이메일로 재설정 링크를{'\n'}보내드릴게요.</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="이메일"
                placeholder="your@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={onSubmit}
                hint={emailError}
                hintType={emailError ? 'err' : 'default'}
                testID="forgot-password-email-input"
              />
            )}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insetsBottom + spacing[5] }]}>
        <CTA
          variant="amber"
          onPress={onSubmit}
          disabled={submitting || !emailValue}
          testID="forgot-password-submit-button"
        >
          {submitting ? '전송 중...' : '재설정 메일 받기'}
        </CTA>
      </View>
    </KeyboardAvoidingView>
  );
}

interface SentViewProps {
  email: string;
  insetsBottom: number;
  onBackToLogin: () => void;
  onResend: () => void;
}

function SentView({ email, insetsBottom, onBackToLogin, onResend }: SentViewProps) {
  return (
    <View style={styles.flex} testID="forgot-password-screen-sent">
      <View style={styles.sentContent}>
        <View style={[styles.iconCircle, shadows.sm]}>
          <MailIcon />
        </View>
        <Eyebrow>SENT</Eyebrow>
        <Text style={styles.sentHeading}>
          메일을 <Text style={styles.sentHeadingAccent}>보내드렸어요</Text>
        </Text>
        <Text style={styles.sentBody}>
          <Text style={styles.sentEmail}>{email || 'your@email.com'}</Text>
          {'\n'}으로 재설정 링크를 보냈어요.{'\n'}메일함을 확인해주세요.
        </Text>
        <Text style={styles.sentHint}>메일이 오지 않았다면{'\n'}스팸함도 확인해보세요.</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insetsBottom + spacing[5] }]}>
        <CTA variant="amber" onPress={onBackToLogin} testID="forgot-password-back-to-login-button">
          로그인으로 돌아가기
        </CTA>
        <Pressable
          onPress={onResend}
          hitSlop={6}
          style={styles.resendBtn}
          testID="forgot-password-resend-link"
        >
          <Text style={styles.resendText}>다시 받기</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MailIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Rect
        x={4}
        y={7}
        width={20}
        height={14}
        rx={2}
        stroke={colors.amber[400]}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4 9l10 7 10-7"
        stroke={colors.amber[400]}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
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
    paddingTop: spacing[5],
  },
  heading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h1,
    color: colors.ink[900],
    lineHeight: fontSize.h1 * lineHeight.tight,
    letterSpacing: -0.6,
    marginTop: spacing[2],
    marginBottom: spacing[3],
  },
  headingAccent: {
    fontFamily: fontFamily.serif.bold,
    color: colors.amber[400],
    fontStyle: 'italic',
  },
  subheading: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    lineHeight: fontSize.md * lineHeight.relaxed,
    marginBottom: spacing[6],
    maxWidth: 280,
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
    backgroundColor: colors.paper[50],
    gap: spacing[3],
  },
  // Sent view
  sentContent: {
    flex: 1,
    paddingHorizontal: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  sentHeading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h2,
    color: colors.ink[900],
    lineHeight: fontSize.h2 * lineHeight.tight,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[3],
  },
  sentHeadingAccent: {
    fontFamily: fontFamily.serif.bold,
    color: colors.amber[400],
    fontStyle: 'italic',
  },
  sentBody: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.ink[800],
    lineHeight: fontSize.md * lineHeight.relaxed,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing[3],
  },
  sentEmail: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.sm,
    color: colors.amber[500],
  },
  sentHint: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
    lineHeight: fontSize.sm * lineHeight.normal,
    textAlign: 'center',
    maxWidth: 240,
  },
  resendBtn: {
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  resendText: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.sm,
    color: colors.brass.ink,
    letterSpacing: -0.1,
  },
});

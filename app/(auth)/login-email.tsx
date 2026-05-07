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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { AppBar, BackBtn, CTA, Eyebrow, Input } from '@/components/ui';
import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { parseApiError } from '@/utils/parseApiError';

const schema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

type LoginEmailForm = z.infer<typeof schema>;

export default function LoginEmailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser: _setUser } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginEmailForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (values: LoginEmailForm) => {
    // UI 단계: 백엔드 미연동. 작업 18에서 BACKEND_ENABLED=true로 활성.
    if (!BACKEND_ENABLED) {
      router.replace('/(tabs)');
      return;
    }
    setSubmitting(true);
    try {
      // 백엔드 username 필드를 email로 사용 (작업 18에서 정리 예정).
      await authApi.login({ username: values.email, password: values.password });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('로그인 실패', parseApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} testID="login-back-button" />}
        title="로그인"
        serif={false}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Eyebrow>WELCOME BACK</Eyebrow>
            <Text style={styles.heading}>
              다시 오신 걸{'\n'}
              <Text style={styles.headingAccent}>환영해요</Text>
            </Text>

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
                  returnKeyType="next"
                  hint={errors.email?.message}
                  hintType={errors.email ? 'err' : 'default'}
                  testID="login-email-input"
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="비밀번호"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  hint={errors.password?.message}
                  hintType={errors.password ? 'err' : 'default'}
                  testID="login-password-input"
                />
              )}
            />

            <View style={styles.forgotRow}>
              <Pressable
                onPress={() => router.push('/(auth)/forgot-password')}
                hitSlop={6}
                testID="login-forgot-link"
              >
                <Text style={styles.forgotText}>비밀번호를 잊으셨나요?</Text>
              </Pressable>
            </View>

            <View style={styles.ctaWrap}>
              <CTA
                variant="amber"
                onPress={handleSubmit(onSubmit)}
                disabled={submitting}
                testID="login-submit-button"
              >
                {submitting ? '로그인 중...' : '로그인'}
              </CTA>
            </View>
          </View>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[6] }]}>
            <Text style={styles.footerText}>
              계정이 없으신가요?{' '}
              <Text
                style={styles.footerLink}
                onPress={() => router.push('/(auth)/register')}
                testID="login-signup-link"
              >
                가입하기
              </Text>
            </Text>
          </View>
        </ScrollView>
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
    paddingTop: spacing[5],
  },
  heading: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.h1,
    color: colors.ink[900],
    lineHeight: fontSize.h1 * lineHeight.tight,
    letterSpacing: -0.6,
    marginTop: spacing[2],
    marginBottom: spacing[6] + spacing[1], // 28 ≈ 24 + 4
  },
  headingAccent: {
    fontFamily: fontFamily.serif.semibold,
    color: colors.amber[400],
    fontStyle: 'italic',
  },
  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing[1],
  },
  forgotText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.brass.ink,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[1],
    letterSpacing: -0.1,
  },
  ctaWrap: {
    marginTop: spacing[5],
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.paper[300],
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
  },
  footerLink: {
    fontFamily: fontFamily.sans.semibold,
    color: colors.amber[500],
    textDecorationLine: 'underline',
  },
});

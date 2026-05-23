import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { userApi } from '@/api/user';
import type { AgeGroup, ExperienceLevel } from '@/types/user';
import { AppBar, BackBtn, Chip, CTA, Eyebrow, Input, ProgressDots } from '@/components/ui';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { parseApiError } from '@/utils/parseApiError';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';

const LEVELS = ['입문', '즐김', '애호', '전문'] as const;
type Level = (typeof LEVELS)[number];

const currentYear = new Date().getFullYear();

const schema = z.object({
  nickname: z.string().trim().min(1, '닉네임을 입력해주세요.'),
  level: z.enum(LEVELS, { message: '음주 경력을 선택해주세요.' }),
  birthYear: z
    .string()
    .regex(/^\d{4}$/, '연도 4자리')
    .refine(
      (v) => {
        const n = Number(v);
        return n >= 1900 && n <= currentYear;
      },
      { message: '올바른 연도가 아닙니다.' },
    ),
  birthMonth: z
    .string()
    .regex(/^\d{1,2}$/, '월')
    .refine(
      (v) => {
        const n = Number(v);
        return n >= 1 && n <= 12;
      },
      { message: '1~12' },
    ),
  birthDay: z
    .string()
    .regex(/^\d{1,2}$/, '일')
    .refine(
      (v) => {
        const n = Number(v);
        return n >= 1 && n <= 31;
      },
      { message: '1~31' },
    ),
});

type Step1Form = z.infer<typeof schema>;

export default function OnboardingStep1Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const kbVisible = useKeyboardVisible();
  const footerPadBottom = kbVisible ? spacing[3] : insets.bottom + spacing[5];

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      nickname: '',
      level: undefined as unknown as Level,
      birthYear: '',
      birthMonth: '',
      birthDay: '',
    },
    mode: 'onChange',
  });

  /** 4단계 디자인 레벨 → BE 3단계 ExperienceLevel 매핑. */
  const mapLevelToExperience = (level: Level): ExperienceLevel => {
    switch (level) {
      case '입문':
        return 'BEGINNER';
      case '즐김':
      case '애호':
        return 'INTERMEDIATE';
      case '전문':
        return 'ADVANCED';
    }
  };

  /**
   * 생일 → BE AgeGroup enum 4종 매핑.
   * BE는 생년월일을 직접 저장하지 않고 ageGroup만 받음. UserService에서
   * onboarding 완료 처리 조건이 (ageGroup != null && user_preferences 존재)이라
   * step1에서 반드시 전송해야 한다.
   * 만 19세 미만은 서비스 정책상 미성년 가입 제외 가정 → TWENTIES 폴백.
   */
  const computeAgeGroup = (birthYear: string): AgeGroup => {
    const age = new Date().getFullYear() - Number(birthYear);
    if (age >= 50) return 'FIFTIES_PLUS';
    if (age >= 40) return 'FORTIES';
    if (age >= 30) return 'THIRTIES';
    return 'TWENTIES';
  };

  const onSubmit = async (values: Step1Form) => {
    // UI 단계: 백엔드 미연동. 작업 18에서 BACKEND_ENABLED=true로 활성.
    if (!BACKEND_ENABLED) {
      router.push('/(onboarding)/step2');
      return;
    }
    setSubmitting(true);
    try {
      // 1) 닉네임 → BE username 업데이트 (가입 시 자동 생성 username을 사용자 입력으로 교체).
      await userApi.updateUsername({ username: values.nickname });

      // 2) 생일 → ageGroup(BE onboarding 자동완료 조건) + birthDate(BE PR #20 정확값) 둘 다 전송.
      const birthDate = `${values.birthYear}-${values.birthMonth.padStart(2, '0')}-${values.birthDay.padStart(2, '0')}`;
      await userApi.updateProfile({
        ageGroup: computeAgeGroup(values.birthYear),
        birthDate,
      });

      // 3) level은 step2의 savePreferences에 합쳐 보내야 함 → router param으로 전달.
      const experienceLevel = mapLevelToExperience(values.level);
      router.push({
        pathname: '/(onboarding)/step2',
        params: { experienceLevel },
      });
    } catch (error) {
      Alert.alert('오류', parseApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="onboarding-step1-screen">
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} testID="onboarding-step1-back-button" />}
        title="02 / 03"
        serif={false}
      />
      <ProgressDots step={2} total={3} />

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
            <Eyebrow>STEP TWO</Eyebrow>
            <Text style={styles.heading}>
              어떻게 <Text style={styles.headingAccent}>불러드릴까요?</Text>
            </Text>

            <Controller
              control={control}
              name="nickname"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="닉네임"
                  placeholder="바텐더 김"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  returnKeyType="next"
                  hint={errors.nickname?.message}
                  hintType={errors.nickname ? 'err' : 'default'}
                  testID="onboarding-step1-nickname-input"
                />
              )}
            />

            <Text style={styles.label}>음주 경력</Text>
            <Controller
              control={control}
              name="level"
              render={({ field: { value, onChange } }) => (
                <View style={styles.levelRow}>
                  {LEVELS.map((lvl) => (
                    <Chip
                      key={lvl}
                      active={value === lvl}
                      onPress={() => onChange(lvl)}
                      testID={`onboarding-step1-level-${lvl}`}
                    >
                      {lvl}
                    </Chip>
                  ))}
                </View>
              )}
            />

            <Text style={styles.label}>생년월일</Text>
            <View style={styles.birthRow}>
              <Controller
                control={control}
                name="birthYear"
                render={({ field: { value, onChange, onBlur } }) => (
                  <BirthBox
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="1995"
                    maxLength={4}
                    flex={2}
                    testID="onboarding-step1-birthyear-input"
                  />
                )}
              />
              <Controller
                control={control}
                name="birthMonth"
                render={({ field: { value, onChange, onBlur } }) => (
                  <BirthBox
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="03"
                    maxLength={2}
                    flex={1}
                    testID="onboarding-step1-birthmonth-input"
                  />
                )}
              />
              <Controller
                control={control}
                name="birthDay"
                render={({ field: { value, onChange, onBlur } }) => (
                  <BirthBox
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="14"
                    maxLength={2}
                    flex={1}
                    testID="onboarding-step1-birthday-input"
                  />
                )}
              />
            </View>
            <Text style={styles.birthHint}>만 19세 이상 확인용 · 공개되지 않아요</Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: footerPadBottom }]}>
          <CTA
            variant="amber"
            onPress={handleSubmit(onSubmit)}
            disabled={submitting || !isValid}
            testID="onboarding-step1-next-button"
          >
            {submitting ? '저장 중...' : '다음으로'}
          </CTA>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

interface BirthBoxProps {
  value: string;
  onChangeText: (v: string) => void;
  onBlur: () => void;
  placeholder: string;
  maxLength: number;
  flex: number;
  testID: string;
}

function BirthBox({
  value,
  onChangeText,
  onBlur,
  placeholder,
  maxLength,
  flex,
  testID,
}: BirthBoxProps) {
  return (
    <TextInput
      style={[styles.birthBox, { flex }]}
      value={value}
      onChangeText={(v) => onChangeText(v.replace(/[^0-9]/g, ''))}
      onBlur={onBlur}
      placeholder={placeholder}
      placeholderTextColor={colors.paper[400]}
      keyboardType="number-pad"
      maxLength={maxLength}
      testID={testID}
    />
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
  label: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.paper[400],
    marginBottom: spacing[3],
    marginTop: spacing[2],
  },
  levelRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[6],
    flexWrap: 'wrap',
  },
  birthRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  birthBox: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3], // 16 → 12 (좁은 박스에서 콘텐츠 min-width로 밀려나는 것 완화)
    backgroundColor: colors.paper[100],
    borderRadius: radius.md,
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.ink[900],
    textAlign: 'center',
    letterSpacing: 0.7,
    // RN-Web에서 TextInput이 HTML input으로 렌더되면 기본 min-width가 flex 할당을 무시.
    // minWidth:0 명시로 flex 비율 정확히 적용.
    minWidth: 0,
  },
  birthHint: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    marginTop: spacing[2],
    paddingLeft: spacing[1],
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
    backgroundColor: colors.paper[50],
    borderTopWidth: 1,
    borderTopColor: colors.paper[200],
  },
});

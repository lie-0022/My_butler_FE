import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { userApi } from '@/api/user';
import {
  AppBar,
  BackBtn,
  Chip,
  CTA,
  Eyebrow,
  ProgressDots,
} from '@/components/ui';
import { Bottle, type BottleTone } from '@/components/illustrations';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { parseApiError } from '@/utils/parseApiError';

interface TasteCategory {
  id: string;
  label: string;
  tone: BottleTone;
}

const TASTES: TasteCategory[] = [
  { id: 'whisky', label: '위스키', tone: 'amber' },
  { id: 'gin', label: '진', tone: 'clear' },
  { id: 'rum', label: '럼', tone: 'amber' },
  { id: 'tequila', label: '테킬라', tone: 'clear' },
  { id: 'vodka', label: '보드카', tone: 'clear' },
  { id: 'liqueur', label: '리큐르', tone: 'green' },
  { id: 'wine', label: '와인', tone: 'red' },
  { id: 'beer', label: '맥주', tone: 'amber' },
];

const FLAVORS = ['스모키', '드라이', '스위트', '프루티', '허벌', '스파이시', '시트러스'];

export default function OnboardingStep2Screen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggleTaste = (id: string) => {
    setSelectedTastes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleFlavor = (f: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  };

  const handleNext = async () => {
    if (selectedTastes.length === 0) return;
    setSubmitting(true);
    try {
      await userApi.savePreferences({
        categories: selectedTastes,
        preferenceDetails:
          selectedFlavors.length > 0 ? { flavors: selectedFlavors } : undefined,
      });
      router.push('/(onboarding)/step3');
    } catch (error) {
      Alert.alert('오류', parseApiError(error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const ctaLabel =
    selectedTastes.length > 0
      ? `${selectedTastes.length}개 선택 · 다음으로`
      : '하나 이상 선택해주세요';

  return (
    <View
      style={[styles.root, { paddingTop: insets.top }]}
      testID="onboarding-step2-screen"
    >
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} testID="onboarding-step2-back-button" />}
        title="03 / 03"
        serif={false}
      />
      <ProgressDots step={3} total={3} />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Eyebrow>STEP THREE</Eyebrow>
          <Text style={styles.heading}>
            어떤 술을 <Text style={styles.headingAccent}>즐기시나요?</Text>
          </Text>
          <Text style={styles.subheading}>여러 개 선택 가능 · 추천에 사용됩니다</Text>

          <View style={styles.grid}>
            {TASTES.map((t) => {
              const on = selectedTastes.includes(t.id);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => toggleTaste(t.id)}
                  testID={`onboarding-step2-taste-${t.id}`}
                  style={({ pressed }) => [
                    styles.card,
                    on ? styles.cardOn : styles.cardOff,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <View style={styles.cardBottle}>
                    <Bottle tone={t.tone} height={52} />
                  </View>
                  <Text style={[styles.cardLabel, on && styles.cardLabelOn]}>
                    {t.label}
                  </Text>
                  {on ? (
                    <View style={styles.cardCheck}>
                      <Svg width={14} height={14} viewBox="0 0 14 14">
                        <Path
                          d="M2 7l3.5 3.5L12 4"
                          stroke={colors.amber[300]}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </Svg>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.flavorLabel}>선호 맛 프로필</Text>
          <View style={styles.flavorRow}>
            {FLAVORS.map((f) => (
              <Chip
                key={f}
                active={selectedFlavors.includes(f)}
                onPress={() => toggleFlavor(f)}
                testID={`onboarding-step2-flavor-${f}`}
              >
                {f}
              </Chip>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[5] }]}>
        <CTA
          variant="amber"
          onPress={handleNext}
          disabled={submitting || selectedTastes.length === 0}
          testID="onboarding-step2-next-button"
        >
          {submitting ? '저장 중...' : ctaLabel}
        </CTA>
      </View>
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
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[5],
  },
  heading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h1,
    color: colors.ink[900],
    lineHeight: fontSize.h1 * lineHeight.tight,
    letterSpacing: -0.6,
    marginTop: spacing[2],
    marginBottom: spacing[2],
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
    marginBottom: spacing[5],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  card: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  cardOff: {
    backgroundColor: colors.paper[100],
    borderColor: 'transparent',
  },
  cardOn: {
    backgroundColor: colors.ink[900],
    borderColor: colors.ink[900],
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardBottle: {
    width: 36,
    flexShrink: 0,
    alignItems: 'center',
  },
  cardLabel: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md + 2, // 16
    color: colors.ink[900],
    letterSpacing: -0.16,
    flex: 1,
  },
  cardLabelOn: {
    color: colors.paper[50],
  },
  cardCheck: {
    marginLeft: 'auto',
  },
  flavorLabel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.paper[400],
    marginBottom: spacing[3],
  },
  flavorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
    backgroundColor: colors.paper[50],
    borderTopWidth: 1,
    borderTopColor: colors.paper[200],
  },
});

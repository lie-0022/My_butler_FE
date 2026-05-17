import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, BackBtn, Chip, CTA, Eyebrow, Input } from '@/components/ui';
import { Bottle, type BottleTone } from '@/components/illustrations';
import { inventoryApi } from '@/api/inventory';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { parseApiError } from '@/utils/parseApiError';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import type { Category } from '@/types/inventory';

/** 디자인 한국어 카테고리 → BE Category enum. 와인/맥주는 BE에 enum 없음 → OTHER. */
const CATEGORY_MAP: Record<string, Category> = {
  위스키: 'WHISKEY',
  진: 'GIN',
  럼: 'RUM',
  보드카: 'VODKA',
  테킬라: 'TEQUILA',
  리큐르: 'LIQUEUR',
  와인: 'OTHER',
  맥주: 'OTHER',
  기타: 'OTHER',
};

const CATEGORIES = Object.keys(CATEGORY_MAP);
const TONES: { id: BottleTone; label: string }[] = [
  { id: 'amber', label: 'Amber' },
  { id: 'clear', label: 'Clear' },
  { id: 'green', label: 'Green' },
  { id: 'red', label: 'Red' },
];

export default function BottleNewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('위스키');
  const [tone, setTone] = useState<BottleTone>('amber');
  const [volume, setVolume] = useState('700');
  const [abv, setAbv] = useState('43');
  // BE PR #20 신규 필드. 디자인 시안 없어서 단순 텍스트 입력만 추가.
  const [tastingNotes, setTastingNotes] = useState('');
  const [purchasedAt, setPurchasedAt] = useState(''); // "YYYY-MM-DD"
  const [purchasePlace, setPurchasePlace] = useState('');
  const [origin, setOrigin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const kbVisible = useKeyboardVisible();
  const footerPadBottom = kbVisible ? spacing[3] : insets.bottom + spacing[5];

  const handleSubmit = async () => {
    if (!BACKEND_ENABLED) {
      router.back();
      return;
    }
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const beCategory = CATEGORY_MAP[category] ?? 'OTHER';
      // 빈 문자열은 undefined로 보내서 BE validation 통과 + null 저장.
      const trim = (v: string) => (v.trim() ? v.trim() : undefined);
      await inventoryApi.create({
        name: name.trim(),
        category: beCategory,
        capacityMl: volume ? Number(volume) : undefined,
        abv: abv ? Number(abv) : undefined,
        levelStatus: 'FULL',
        isOpened: false,
        tastingNotes: trim(tastingNotes),
        purchasedAt: trim(purchasedAt),
        purchasePlace: trim(purchasePlace),
        origin: trim(origin),
      });
      router.back();
    } catch (err) {
      Alert.alert('등록 실패', parseApiError(err).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="bottle-new-screen">
      <StatusBar style="dark" />
      <AppBar left={<BackBtn onPress={() => router.back()} />} title="재료 등록" serif={false} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Scan CTA */}
          <View style={styles.scanCard}>
            <View style={styles.scanIcon}>
              <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                <Path
                  d="M3 7V5a2 2 0 012-2h2M15 3h2a2 2 0 012 2v2M19 15v2a2 2 0 01-2 2h-2M7 19H5a2 2 0 01-2-2v-2"
                  stroke={colors.ink[900]}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
                <Path
                  d="M7 11h8"
                  stroke={colors.ink[900]}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View style={styles.scanText}>
              <Text style={styles.scanTitle}>라벨 스캔으로 자동 등록</Text>
              <Text style={styles.scanSub}>카메라로 비추면 정보가 채워져요</Text>
            </View>
            <Text style={styles.scanArrow}>→</Text>
          </View>

          <Text style={styles.divider}>— OR —</Text>

          <Eyebrow>STEP ONE · BASIC</Eyebrow>
          <Text style={styles.heading}>무엇을 추가하시나요?</Text>

          <Input
            label="제품명"
            placeholder="예: Lagavulin 16"
            value={name}
            onChangeText={setName}
            testID="bottle-new-name-input"
          />

          <Text style={styles.fieldLabel}>종류</Text>
          <View style={styles.catRow}>
            {CATEGORIES.map((c) => (
              <Chip
                key={c}
                size="sm"
                active={c === category}
                onPress={() => setCategory(c)}
                testID={`bottle-new-category-${c}`}
              >
                {c}
              </Chip>
            ))}
          </View>

          <Text style={styles.fieldLabel}>병 톤 선택</Text>
          <View style={styles.toneRow}>
            {TONES.map((t) => {
              const on = t.id === tone;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setTone(t.id)}
                  testID={`bottle-new-tone-${t.id}`}
                  style={[styles.toneItem, on && styles.toneItemActive]}
                >
                  <Bottle tone={t.id} height={60} />
                  <Text style={[styles.toneLabel, on && styles.toneLabelActive]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.numberRow}>
            <View style={styles.numberCol}>
              <Text style={styles.fieldLabelSm}>용량 (ml)</Text>
              <TextInput
                style={styles.numberInput}
                value={volume}
                onChangeText={(v) => setVolume(v.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                placeholder="700"
                placeholderTextColor={colors.paper[400]}
                testID="bottle-new-volume-input"
              />
            </View>
            <View style={styles.numberCol}>
              <Text style={styles.fieldLabelSm}>ABV (%)</Text>
              <TextInput
                style={styles.numberInput}
                value={abv}
                onChangeText={(v) => setAbv(v.replace(/[^0-9.]/g, ''))}
                keyboardType="decimal-pad"
                placeholder="43"
                placeholderTextColor={colors.paper[400]}
                testID="bottle-new-abv-input"
              />
            </View>
          </View>

          {/*
           * BE PR #20 신규 필드 4종 — 디자인 시안 없음.
           * MVP는 단순 텍스트 입력으로 받아두고, 디자인 받으면 칩/날짜피커로 교체.
           * NEEDS_DESIGN.md "보틀 추가/수정 폼" 항목 참조.
           */}
          <Input
            label="원산지/증류소 (선택)"
            placeholder="예: Islay · Scotland"
            value={origin}
            onChangeText={setOrigin}
            testID="bottle-new-origin-input"
          />
          <Input
            label="테이스팅 노트 (선택, 쉼표로 구분)"
            placeholder="예: 스모키, 피트, 바닐라"
            value={tastingNotes}
            onChangeText={setTastingNotes}
            testID="bottle-new-tasting-notes-input"
          />
          <Input
            label="구매일 (선택, YYYY-MM-DD)"
            placeholder="2026-05-18"
            value={purchasedAt}
            onChangeText={setPurchasedAt}
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
            testID="bottle-new-purchased-at-input"
          />
          <Input
            label="구매처 (선택)"
            placeholder="예: 신세계 와인앤스피릿"
            value={purchasePlace}
            onChangeText={setPurchasePlace}
            testID="bottle-new-purchase-place-input"
          />
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: footerPadBottom }]}>
          <CTA
            variant="amber"
            onPress={handleSubmit}
            disabled={!name.trim() || submitting}
            testID="bottle-new-submit-button"
          >
            {submitting ? '등록 중...' : '카운터에 추가'}
          </CTA>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper[50] },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
    paddingBottom: spacing[6],
  },
  scanCard: {
    backgroundColor: colors.ink[900],
    borderRadius: radius.lg,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[5],
  },
  scanIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.amber[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: { flex: 1 },
  scanTitle: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.paper[50],
  },
  scanSub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    marginTop: spacing[1],
  },
  scanArrow: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.lg,
    color: colors.amber[200],
  },
  divider: {
    textAlign: 'center',
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    letterSpacing: 2.4,
    color: colors.paper[400],
    marginBottom: spacing[5],
  },
  heading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.ink[900],
    letterSpacing: -0.4,
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  fieldLabel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.paper[400],
    marginBottom: spacing[3],
    marginTop: spacing[1],
  },
  fieldLabelSm: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.paper[400],
    marginBottom: spacing[2],
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  toneRow: {
    flexDirection: 'row',
    gap: spacing[2],
    padding: spacing[3],
    backgroundColor: colors.paper[100],
    borderRadius: radius.md,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: spacing[5],
  },
  toneItem: {
    alignItems: 'center',
    padding: spacing[2],
    borderRadius: radius.sm,
    backgroundColor: 'transparent',
  },
  toneItemActive: {
    backgroundColor: colors.ink[900],
  },
  toneLabel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.ink[900],
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: spacing[1],
  },
  toneLabelActive: {
    color: colors.paper[50],
  },
  numberRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  numberCol: { flex: 1, minWidth: 0 },
  numberInput: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.paper[100],
    borderRadius: radius.md,
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.lg,
    color: colors.ink[900],
    textAlign: 'center',
    minWidth: 0,
  },
  footer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
    backgroundColor: colors.paper[50],
    borderTopWidth: 1,
    borderTopColor: colors.paper[200],
  },
});

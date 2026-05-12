import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, BackBtn, Chip, CTA, Eyebrow, Input } from '@/components/ui';
import { Bottle, type BottleTone } from '@/components/illustrations';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';

const CATEGORIES = ['위스키', '진', '럼', '보드카', '리큐르', '와인', '맥주', '기타'];
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

  const handleSubmit = () => {
    // UI 단계: mock 추가만 하고 뒤로. 작업 18에서 실제 API 연결.
    router.back();
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
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing[5] }]}>
          <CTA
            variant="amber"
            onPress={handleSubmit}
            disabled={!name.trim()}
            testID="bottle-new-submit-button"
          >
            카운터에 추가
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

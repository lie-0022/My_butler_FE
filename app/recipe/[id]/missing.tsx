import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, BackBtn, Eyebrow } from '@/components/ui';
import { Bottle } from '@/components/illustrations';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';

interface IngHave {
  name: string;
  amt: string;
}
interface IngMissing extends IngHave {
  swap: string;
}

const HAVE: IngHave[] = [
  { name: 'Gin', amt: '45ml' },
  { name: 'Lemon Juice', amt: '15ml' },
  { name: 'Crème de Violette', amt: '7.5ml' },
];

const MISSING: IngMissing[] = [
  { name: 'Maraschino Liqueur', amt: '15ml', swap: 'Luxardo 추천' },
  { name: 'Lemon Peel', amt: '1 twist', swap: '가니시' },
];

export default function RecipeMissingScreen() {
  const { id: _id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const total = HAVE.length + MISSING.length;
  const ratio = HAVE.length / total;

  return (
    <View
      style={[styles.root, { paddingTop: insets.top }]}
      testID="recipe-missing-screen"
    >
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} />}
        title="재료 부족"
        serif={false}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing[6] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Glass — 작업 17에서 CocktailGlass로 교체 */}
        <View style={styles.glassWrap}>
          <Bottle tone="clear" height={140} />
        </View>

        <View style={styles.center}>
          <Eyebrow>ALMOST THERE</Eyebrow>
          <Text style={styles.heading}>
            <Text style={styles.headingAccent}>Aviation</Text>을 위해{'\n'}두 가지가 더 필요해요
          </Text>
          <Text style={styles.summary}>
            전체 재료 {total}개 중 <Text style={styles.summaryStrong}>{HAVE.length}개 보유</Text>
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>READY</Text>
            <Text style={styles.progressPct}>{Math.round(ratio * 100)}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[colors.amber[300], colors.amber[400]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${ratio * 100}%` }]}
            />
          </View>
        </View>

        {/* Have list */}
        <Eyebrow>보유 중 · {HAVE.length}</Eyebrow>
        <View style={styles.list}>
          {HAVE.map((ing) => (
            <View key={ing.name} style={styles.haveRow}>
              <View style={styles.ingChip} />
              <Text style={styles.haveName}>{ing.name}</Text>
              <Text style={styles.haveAmt}>{ing.amt}</Text>
              <Text style={styles.haveCheck}>✓</Text>
            </View>
          ))}
        </View>

        {/* Missing list */}
        <View style={styles.missHeader}>
          <Eyebrow>부족한 재료 · {MISSING.length}</Eyebrow>
          <Text style={styles.needed}>NEEDED</Text>
        </View>
        <View style={styles.list}>
          {MISSING.map((ing) => (
            <Pressable
              key={ing.name}
              testID={`recipe-missing-add-${ing.name}`}
              onPress={() => router.push('/bottle/new')}
              style={({ pressed }) => [styles.missRow, pressed && styles.missRowPressed]}
            >
              <View style={[styles.ingChip, styles.ingChipMiss]} />
              <View style={styles.missMeta}>
                <Text style={styles.missName}>{ing.name}</Text>
                <Text style={styles.missSwap}>↳ {ing.swap}</Text>
              </View>
              <Text style={styles.missAmt}>{ing.amt}</Text>
            </Pressable>
          ))}
        </View>

        {/* Alternative suggestion */}
        <View style={styles.alt}>
          <Text style={styles.altEyebrow}>ALTERNATIVE TONIGHT</Text>
          <Text style={styles.altText}>
            지금 바로 만들 수 있는 <Text style={styles.altAccent}>Gin Fizz</Text>는 어떠세요?
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper[50] },
  scroll: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
  },
  glassWrap: {
    alignItems: 'center',
    marginVertical: spacing[3],
  },
  center: { alignItems: 'center' },
  heading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h2,
    color: colors.ink[900],
    letterSpacing: -0.5,
    lineHeight: fontSize.h2 * lineHeight.tight,
    textAlign: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  headingAccent: {
    color: colors.amber[400],
    fontStyle: 'italic',
  },
  summary: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
    marginBottom: spacing[5],
  },
  summaryStrong: {
    fontFamily: fontFamily.sans.semibold,
    color: colors.ink[900],
  },
  progressCard: {
    padding: spacing[3],
    backgroundColor: colors.amber[50],
    borderWidth: 1,
    borderColor: 'rgba(200,162,101,0.3)',
    borderRadius: radius.md,
    marginBottom: spacing[6],
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  progressLabel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.amber[600],
  },
  progressPct: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.amber[600],
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(200,162,101,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%' },
  list: { marginTop: spacing[3], marginBottom: spacing[5], gap: spacing[2] },
  haveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.2)',
    borderRadius: radius.sm,
  },
  ingChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.amber[100],
  },
  ingChipMiss: {
    backgroundColor: colors.semanticBg.danger,
  },
  haveName: {
    flex: 1,
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  haveAmt: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
  },
  haveCheck: {
    fontSize: fontSize.md,
    color: colors.semantic.ok,
  },
  missHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  needed: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.semantic.danger,
    letterSpacing: 1,
  },
  missRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.paper[50],
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.semantic.danger,
    borderRadius: radius.sm,
  },
  missRowPressed: { opacity: 0.85 },
  missMeta: { flex: 1 },
  missName: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  missSwap: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.amber[500],
    letterSpacing: 1,
    marginTop: spacing[1],
    textTransform: 'uppercase',
  },
  missAmt: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.semantic.danger,
    fontWeight: '600',
  },
  alt: {
    padding: spacing[4],
    backgroundColor: colors.ink[900],
    borderRadius: radius.md,
    marginTop: spacing[2],
  },
  altEyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.brass.base,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  altText: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md + 2,
    color: colors.paper[50],
    marginTop: spacing[2],
    lineHeight: (fontSize.md + 2) * 1.3,
  },
  altAccent: {
    color: colors.amber[200],
    fontStyle: 'italic',
  },
});

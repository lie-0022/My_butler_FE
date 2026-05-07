import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, BackBtn, Eyebrow } from '@/components/ui';
import { type BottleTone } from '@/components/illustrations';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';

interface PourData {
  name: string;
  consumed: number;
  tone: BottleTone;
}

const DATA: PourData[] = [
  { name: 'Lagavulin 16', consumed: 420, tone: 'amber' },
  { name: 'Hendricks Gin', consumed: 280, tone: 'clear' },
  { name: 'Campari', consumed: 180, tone: 'red' },
  { name: 'Green Chartreuse', consumed: 90, tone: 'green' },
  { name: 'Dolin Rouge', consumed: 70, tone: 'red' },
];

const BAR_GRADIENTS: Record<BottleTone, [string, string]> = {
  amber: ['#e4a83c', '#8b4f10'],
  clear: ['#d9c89a', '#7a6138'],
  green: ['#7a8a4a', '#2e3a14'],
  red: ['#c63820', '#6d2011'],
  blue: ['#3a5a7a', '#16263e'],
};

export default function BarInsightScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const max = Math.max(...DATA.map((d) => d.consumed));

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="bar-insight-screen">
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} />}
        title="지난 30일"
        serif={false}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing[6] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow>MONTHLY COUNTER</Eyebrow>
        <Text style={styles.heading}>
          <Text style={styles.headingAccent}>1,420ml</Text>의{'\n'}한 달이었어요
        </Text>
        <Text style={styles.sub}>
          지난 달 대비 <Text style={styles.subOk}>↑ 18% 증가</Text>
        </Text>

        {/* Big number cards */}
        <View style={styles.cards}>
          <View style={[styles.card, styles.cardDark]}>
            <Text style={styles.cardEyebrow}>DRINKS MADE</Text>
            <Text style={[styles.cardNumber, styles.cardNumberDark]}>23</Text>
            <Text style={styles.cardSub}>평균 매주 5.7잔</Text>
          </View>
          <View style={[styles.card, styles.cardAmber]}>
            <Text style={[styles.cardEyebrow, styles.cardEyebrowAmber]}>TOP FLAVOR</Text>
            <Text style={[styles.cardNumber, styles.cardNumberAmber]}>
              스모키{'\n'}& 드라이
            </Text>
          </View>
        </View>

        {/* Top pours bar chart */}
        <View style={styles.chart}>
          <Eyebrow>TOP POURS</Eyebrow>
          <View style={styles.barList}>
            {DATA.map((d, i) => (
              <View key={d.name} style={styles.barItem}>
                <View style={styles.barLabelRow}>
                  <Text style={styles.barName}>
                    <Text style={styles.barRank}>{String(i + 1).padStart(2, '0')}</Text>{' '}
                    {d.name}
                  </Text>
                  <Text style={styles.barAmount}>{d.consumed}ml</Text>
                </View>
                <View style={styles.barTrack}>
                  <LinearGradient
                    colors={BAR_GRADIENTS[d.tone]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.barFill, { width: `${(d.consumed / max) * 100}%` }]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Butler suggestion */}
        <View style={styles.suggestion}>
          <Eyebrow>BUTLER SUGGESTS</Eyebrow>
          <Text style={styles.suggestionText}>
            곧 <Text style={styles.suggestionAccent}>Campari</Text>가 바닥날 것 같아요. 다음 주에
            구비하면 좋겠어요.
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
  heading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h1,
    color: colors.ink[900],
    letterSpacing: -0.6,
    lineHeight: fontSize.h1 * 1.1,
    marginTop: spacing[2],
  },
  headingAccent: {
    fontFamily: fontFamily.serif.bold,
    color: colors.amber[400],
    fontStyle: 'italic',
  },
  sub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    marginTop: spacing[2],
    lineHeight: fontSize.md * lineHeight.normal,
  },
  subOk: {
    color: colors.semantic.ok,
    fontFamily: fontFamily.sans.semibold,
  },
  cards: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[5],
  },
  card: {
    flex: 1,
    borderRadius: radius.md,
    padding: spacing[4],
    minHeight: 120,
  },
  cardDark: { backgroundColor: colors.ink[900] },
  cardAmber: { backgroundColor: colors.amber[300] },
  cardEyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.brass.base,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  cardEyebrowAmber: {
    color: colors.ink[900],
    opacity: 0.7,
  },
  cardNumber: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h1,
    letterSpacing: -0.6,
    marginTop: spacing[1],
  },
  cardNumberDark: { color: colors.paper[50] },
  cardNumberAmber: {
    color: colors.ink[900],
    fontSize: 24,
    lineHeight: 24 * 1.1,
  },
  cardSub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    marginTop: spacing[1],
  },
  chart: { marginTop: spacing[7] },
  barList: { marginTop: spacing[3], gap: spacing[3] },
  barItem: {},
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing[1],
  },
  barName: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  barRank: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.paper[400],
  },
  barAmount: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.ink[900],
  },
  barTrack: {
    height: 10,
    backgroundColor: colors.paper[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
  suggestion: {
    marginTop: spacing[6],
    padding: spacing[4],
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.3)',
    borderRadius: radius.md,
  },
  suggestionText: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md + 2,
    color: colors.ink[900],
    marginTop: spacing[2],
    lineHeight: (fontSize.md + 2) * 1.35,
  },
  suggestionAccent: {
    color: colors.amber[500],
    fontStyle: 'italic',
  },
});

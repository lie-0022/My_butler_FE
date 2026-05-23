import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, BackBtn, Eyebrow } from '@/components/ui';
import { inventoryApi } from '@/api/inventory';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { CATEGORY_LABEL, CATEGORY_TO_BOTTLE_TONE } from '@/utils/domainMappers';
import type { BottleTone } from '@/components/illustrations';
import type { InventoryInsightsResponse } from '@/types/inventory';

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
  const [insights, setInsights] = useState<InventoryInsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!BACKEND_ENABLED) return;
    try {
      const res = await inventoryApi.getInsights();
      setInsights(res.data);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    void fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  if (loading) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.amber[500]} />
      </View>
    );
  }

  const breakdown = insights?.categoryBreakdown ?? [];
  const max = Math.max(1, ...breakdown.map((d) => d.count));
  const totalValue = insights?.totalValue ?? 0;
  const totalItems = insights?.totalItemCount ?? 0;
  const recipeCount = insights?.availableRecipeCount ?? 0;
  const warningCount = insights?.expiryWarningCount ?? 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="bar-insight-screen">
      <StatusBar style="dark" />
      <AppBar left={<BackBtn onPress={() => router.back()} />} title="인벤토리 인사이트" serif={false} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing[6] }]}
        showsVerticalScrollIndicator={false}
      >
        <Eyebrow>MY COLLECTION</Eyebrow>
        <Text style={styles.heading}>
          <Text style={styles.headingAccent}>{totalItems}병</Text>의{'\n'}나만의 카운터
        </Text>
        <Text style={styles.sub}>
          총 가치 <Text style={styles.subOk}>{totalValue.toLocaleString()}원</Text>
        </Text>

        <View style={styles.cards}>
          <View style={[styles.card, styles.cardDark]}>
            <Text style={styles.cardEyebrow}>POSSIBLE RECIPES</Text>
            <Text style={[styles.cardNumber, styles.cardNumberDark]}>{recipeCount}</Text>
            <Text style={styles.cardSub}>지금 만들 수 있는 칵테일</Text>
          </View>
          <View style={[styles.card, styles.cardAmber]}>
            <Text style={[styles.cardEyebrow, styles.cardEyebrowAmber]}>EXPIRY ALERT</Text>
            <Text style={[styles.cardNumber, styles.cardNumberAmber]}>{warningCount}</Text>
          </View>
        </View>

        {breakdown.length > 0 ? (
          <View style={styles.chart}>
            <Eyebrow>BY CATEGORY</Eyebrow>
            <View style={styles.barList}>
              {breakdown.map((d, i) => {
                const tone = CATEGORY_TO_BOTTLE_TONE[d.category];
                return (
                  <View key={d.category} style={styles.barItem}>
                    <View style={styles.barLabelRow}>
                      <Text style={styles.barName}>
                        <Text style={styles.barRank}>{String(i + 1).padStart(2, '0')}</Text>{' '}
                        {CATEGORY_LABEL[d.category]}
                      </Text>
                      <Text style={styles.barAmount}>
                        {d.count}병 · {Math.round(d.percentage)}%
                      </Text>
                    </View>
                    <View style={styles.barTrack}>
                      <LinearGradient
                        colors={BAR_GRADIENTS[tone]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.barFill, { width: `${(d.count / max) * 100}%` }]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {insights && insights.expiryWarningItems.length > 0 ? (
          <View style={styles.suggestion}>
            <Eyebrow>BUTLER SUGGESTS</Eyebrow>
            <Text style={styles.suggestionText}>
              <Text style={styles.suggestionAccent}>
                {insights.expiryWarningItems[0]?.name}
              </Text>
              {' '}의 유통기한이 임박했어요.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper[50] },
  center: { alignItems: 'center', justifyContent: 'center' },
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

import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, Chip, Eyebrow, IconBtn } from '@/components/ui';
import { CocktailGlass, type BottleTone } from '@/components/illustrations';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';

type GlassToneCompat = Extract<BottleTone, 'amber' | 'clear' | 'red'>;
const fallbackTone = (t: BottleTone): GlassToneCompat =>
  t === 'amber' || t === 'clear' || t === 'red' ? t : 'amber';

interface Recipe {
  id: string;
  name: string;
  abv: number;
  time: number;
  tone: BottleTone;
  canMake: boolean;
  missing?: number;
  tag: string;
}

// 작업 18에서 실제 레시피 API로 교체.
const MOCK_RECIPES: Recipe[] = [
  { id: '1', name: 'Penicillin', abv: 22, time: 3, tone: 'amber', canMake: true, tag: 'SMOKY' },
  { id: '2', name: 'Negroni', abv: 28, time: 2, tone: 'red', canMake: true, tag: 'BITTER' },
  {
    id: '3',
    name: 'Gin Basil Smash',
    abv: 18,
    time: 4,
    tone: 'green',
    canMake: false,
    missing: 1,
    tag: 'HERBAL',
  },
  {
    id: '4',
    name: 'Espresso Martini',
    abv: 20,
    time: 3,
    tone: 'amber',
    canMake: true,
    tag: 'RICH',
  },
  {
    id: '5',
    name: 'Aviation',
    abv: 24,
    time: 3,
    tone: 'clear',
    canMake: false,
    missing: 2,
    tag: 'FLORAL',
  },
];

const FILTERS = ['All', '위스키 베이스', '진 베이스', '논알콜', '클래식', '시그니처'];

export default function RecipesTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="tab-recipes-screen">
      <StatusBar style="dark" />
      <AppBar
        title="Recipe Book"
        right={
          <IconBtn onPress={() => router.push('/_debug')} testID="recipes-search-button">
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path
                d="M11 11l3 3"
                stroke={colors.ink[900]}
                strokeWidth={1.7}
                strokeLinecap="round"
              />
              <Path
                d="M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"
                stroke={colors.ink[900]}
                strokeWidth={1.7}
              />
            </Svg>
          </IconBtn>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing[6] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tonight hero */}
        <Pressable
          onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: 'tonight' } })}
          style={({ pressed }) => [styles.hero, pressed && styles.heroPressed]}
          testID="recipes-tonight-card"
        >
          <View style={styles.heroGlassWrap} pointerEvents="none">
            <CocktailGlass style="rocks" tone="amber" size="lg" />
          </View>
          <Text style={styles.heroEyebrow}>TONIGHT&apos;S POUR</Text>
          <Text style={styles.heroTitle}>
            Smoky{'\n'}Old{'\n'}
            <Text style={styles.heroTitleAccent}>Fashioned</Text>
          </Text>
          <Text style={styles.heroSub}>오늘 밤, 당신의 라가불린을 위해</Text>
          <View style={styles.heroFooter}>
            <Text style={styles.heroMeta}>● 3 min ● 28% ABV ● 재료 OK</Text>
            <View style={styles.heroArrow}>
              <Text style={styles.heroArrowText}>→</Text>
            </View>
          </View>
        </Pressable>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <Chip
              key={f}
              active={f === filter}
              onPress={() => setFilter(f)}
              testID={`recipes-filter-${f}`}
            >
              {f}
            </Chip>
          ))}
        </ScrollView>

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <View>
            <Eyebrow>NOW MAKEABLE</Eyebrow>
            <Text style={styles.sectionTitle}>지금 바로 만들 수 있어요</Text>
          </View>
          <Text style={styles.sectionMore}>더보기 →</Text>
        </View>

        {/* Recipe list */}
        <View style={styles.list}>
          {MOCK_RECIPES.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: r.id } })}
              testID={`recipes-card-${r.id}`}
              style={({ pressed }) => [
                styles.card,
                !r.canMake && styles.cardDisabled,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardThumb}>
                <CocktailGlass style="rocks" tone={fallbackTone(r.tone)} size="sm" />
              </View>
              <View style={styles.cardMeta}>
                <Text style={[styles.cardTag, !r.canMake && styles.cardTagDim]}>{r.tag}</Text>
                <Text style={styles.cardName} numberOfLines={1}>
                  {r.name}
                </Text>
                <Text style={styles.cardSub}>
                  {r.abv}% ABV · {r.time} min
                  {!r.canMake && r.missing !== undefined ? (
                    <>
                      {' · '}
                      <Text style={styles.cardMissing}>재료 {r.missing} 부족</Text>
                    </>
                  ) : null}
                </Text>
              </View>
              <View style={[styles.cardArrow, !r.canMake && styles.cardArrowWarn]}>
                <Text style={[styles.cardArrowText, !r.canMake && styles.cardArrowTextWarn]}>
                  {r.canMake ? '→' : '!'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper[50],
  },
  scroll: {
    paddingTop: spacing[3],
  },
  hero: {
    marginHorizontal: spacing[5],
    marginBottom: spacing[5],
    backgroundColor: colors.ink[900],
    borderRadius: radius.lg,
    padding: spacing[5],
    minHeight: 220,
    overflow: 'hidden',
  },
  heroPressed: {
    opacity: 0.92,
  },
  heroGlassWrap: {
    position: 'absolute',
    top: 30,
    right: -10,
    opacity: 0.95,
  },
  heroEyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.brass.base,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h1,
    color: colors.paper[50],
    letterSpacing: -0.6,
    lineHeight: fontSize.h1 * 1.05,
    marginTop: spacing[2],
    maxWidth: 200,
  },
  heroTitleAccent: {
    fontFamily: fontFamily.serif.regular,
    color: colors.amber[200],
    fontStyle: 'italic',
  },
  heroSub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    marginTop: spacing[3],
    maxWidth: 180,
    lineHeight: fontSize.xs * lineHeight.normal,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[4],
  },
  heroMeta: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
  },
  heroArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.amber[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroArrowText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[1],
  },
  sectionTitle: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.ink[900],
    letterSpacing: -0.4,
    marginTop: spacing[1],
  },
  sectionMore: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.amber[500],
  },
  list: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    gap: spacing[2],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.paper[100],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.2)',
  },
  cardDisabled: {
    opacity: 0.72,
  },
  cardPressed: {
    opacity: 0.85,
  },
  cardThumb: {
    width: 68,
    height: 68,
    backgroundColor: colors.paper[200],
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardMeta: {
    flex: 1,
    minWidth: 0,
  },
  cardTag: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    letterSpacing: 1.8,
    color: colors.amber[500],
  },
  cardTagDim: {
    color: colors.paper[400],
  },
  cardName: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.lg,
    color: colors.ink[900],
    letterSpacing: -0.16,
    lineHeight: fontSize.lg * 1.15,
    marginTop: spacing[1],
  },
  cardSub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    marginTop: spacing[1],
  },
  cardMissing: {
    color: colors.semantic.danger,
    fontFamily: fontFamily.sans.semibold,
  },
  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ink[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArrowWarn: {
    backgroundColor: colors.paper[200],
  },
  cardArrowText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.md,
    color: colors.paper[50],
  },
  cardArrowTextWarn: {
    color: colors.paper[400],
  },
});

import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, Chip, Eyebrow, IconBtn } from '@/components/ui';
import { CocktailGlass, type BottleTone } from '@/components/illustrations';
import { recipeApi } from '@/api/recipe';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import type { RecipeHomeResponse, RecipeSummary , BaseSpirit } from '@/types/recipe';

/**
 * 칩 라벨 ↔ BE filter (baseSpirit 또는 category).
 * "All" = 필터 없음 → /recipes/home 호출.
 * 나머지 = /recipes 검색 호출.
 * "시그니처"는 BE에 매칭 enum 없음 → isCustom=true로 대응 (커스텀 레시피 = 사용자 작성).
 */
interface RecipeFilter {
  label: string;
  /** /recipes 호출 시 query params. undefined면 home으로 폴백. */
  params?: {
    baseSpirit?: 'WHISKEY' | 'GIN' | 'VODKA' | 'RUM' | 'TEQUILA' | 'LIQUEUR';
    category?: 'CLASSIC' | 'TROPICAL' | 'NON_ALCOHOLIC';
  };
}
const FILTERS: RecipeFilter[] = [
  { label: 'All' },
  { label: '위스키 베이스', params: { baseSpirit: 'WHISKEY' } },
  { label: '진 베이스', params: { baseSpirit: 'GIN' } },
  { label: '논알콜', params: { category: 'NON_ALCOHOLIC' } },
  { label: '클래식', params: { category: 'CLASSIC' } },
  { label: '트로피컬', params: { category: 'TROPICAL' } },
];

/** baseSpirit → CocktailGlass tone (rocks/coupe/highball 3 가지 톤만 지원). */
type GlassTone = Extract<BottleTone, 'amber' | 'clear' | 'red'>;
const baseSpiritToTone = (s?: BaseSpirit | null): GlassTone => {
  if (s === 'GIN' || s === 'VODKA' || s === 'TEQUILA') return 'clear';
  if (s === 'LIQUEUR') return 'red';
  return 'amber'; // WHISKEY / RUM / OTHER / NONE
};

export default function RecipesTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<string>('All');
  const [home, setHome] = useState<RecipeHomeResponse | null>(null);
  const [searchResults, setSearchResults] = useState<RecipeSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const activeFilter = FILTERS.find((f) => f.label === filter);

  const fetch = useCallback(async () => {
    if (!BACKEND_ENABLED) return;
    try {
      if (activeFilter?.params) {
        // 필터 적용: /recipes 검색 호출
        const res = await recipeApi.search({ ...activeFilter.params, size: 20 });
        setSearchResults(res.data.content);
      } else {
        // All: home 묶음 호출
        const res = await recipeApi.getHome();
        setHome(res.data);
        setSearchResults(null);
      }
    } catch {
      /* noop */
    }
  }, [activeFilter]);

  useEffect(() => {
    void fetch().finally(() => setLoading(false));
  }, [fetch]);

  useFocusEffect(
    useCallback(() => {
      if (!loading) void fetch();
    }, [fetch, loading]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  }, [fetch]);

  // 필터 적용 중: tonight hero는 숨김 + 검색 결과 리스트만 표시.
  // 필터 없음: home의 preference + availableRecipes 사용.
  const tonight: RecipeSummary | undefined = searchResults
    ? undefined
    : home?.preferenceRecommendations?.[0] ?? home?.availableRecipes?.[0];
  const makeable: RecipeSummary[] = searchResults ?? home?.availableRecipes ?? [];

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Tonight hero */}
        {tonight ? (
          <Pressable
            onPress={() =>
              router.push({ pathname: '/recipe/[id]', params: { id: String(tonight.id) } })
            }
            style={({ pressed }) => [styles.hero, pressed && styles.heroPressed]}
            testID="recipes-tonight-card"
          >
            <View style={styles.heroGlassWrap} pointerEvents="none">
              <CocktailGlass style="rocks" tone={baseSpiritToTone(tonight.baseSpirit)} size="lg" />
            </View>
            <Text style={styles.heroEyebrow}>TONIGHT&apos;S POUR</Text>
            <Text style={styles.heroTitle}>{tonight.name}</Text>
            <Text style={styles.heroSub} numberOfLines={2}>
              {tonight.description ?? '오늘 밤, 당신을 위한 한 잔'}
            </Text>
            <View style={styles.heroFooter}>
              <Text style={styles.heroMeta}>
                ● {tonight.estimatedMinutes ?? 3} min ● {tonight.abv ?? '—'}% ABV
              </Text>
              <View style={styles.heroArrow}>
                <Text style={styles.heroArrowText}>→</Text>
              </View>
            </View>
          </Pressable>
        ) : null}

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <Chip
              key={f.label}
              active={f.label === filter}
              onPress={() => setFilter(f.label)}
              testID={`recipes-filter-${f.label}`}
            >
              {f.label}
            </Chip>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Eyebrow>NOW MAKEABLE</Eyebrow>
            <Text style={styles.sectionTitle}>지금 바로 만들 수 있어요</Text>
          </View>
          <Text style={styles.sectionMore}>더보기 →</Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.amber[500]} />
          </View>
        ) : makeable.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>아직 만들 수 있는 레시피가 없어요</Text>
            <Text style={styles.emptySub}>My Bar에 보틀을 추가해보세요.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {makeable.map((r) => (
              <Pressable
                key={r.id}
                onPress={() =>
                  router.push({ pathname: '/recipe/[id]', params: { id: String(r.id) } })
                }
                testID={`recipes-card-${r.id}`}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.cardThumb}>
                  <CocktailGlass style="rocks" tone={baseSpiritToTone(r.baseSpirit)} size="sm" />
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardTag}>{r.tasteTags[0] ?? 'COCKTAIL'}</Text>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {r.name}
                  </Text>
                  <Text style={styles.cardSub}>
                    {r.abv != null ? `${r.abv}% ABV` : ''}
                    {r.estimatedMinutes ? ` · ${r.estimatedMinutes} min` : ''}
                  </Text>
                </View>
                <View style={styles.cardArrow}>
                  <Text style={styles.cardArrowText}>→</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
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
  center: {
    paddingVertical: spacing[6],
    alignItems: 'center',
  },
  empty: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyTitle: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.lg,
    color: colors.ink[900],
  },
  emptySub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
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
  cardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ink[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArrowText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.md,
    color: colors.paper[50],
  },
});

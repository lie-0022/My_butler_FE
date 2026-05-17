import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, BackBtn, CTA, Eyebrow, IconBtn } from '@/components/ui';
import { CocktailGlass, IngChip, type IngChipType , BottleTone } from '@/components/illustrations';
import { recipeApi } from '@/api/recipe';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { parseApiError } from '@/utils/parseApiError';
import type { BaseSpirit, RecipeDetailResponse } from '@/types/recipe';

type GlassTone = Extract<BottleTone, 'amber' | 'clear' | 'red'>;

const baseSpiritToTone = (s?: BaseSpirit | null): GlassTone => {
  if (s === 'GIN' || s === 'VODKA' || s === 'TEQUILA') return 'clear';
  if (s === 'LIQUEUR') return 'red';
  return 'amber';
};

/** 재료명에서 대략적 IngChip 종류 추정 (BE에 카테고리 컬럼 없음). */
const guessIngChip = (name: string): IngChipType => {
  const n = name.toLowerCase();
  if (n.includes('lemon') || n.includes('레몬')) return 'lemon';
  if (n.includes('lime') || n.includes('라임')) return 'lime';
  if (n.includes('orange') || n.includes('오렌지')) return 'orange';
  if (n.includes('cherry') || n.includes('체리') || n.includes('bitter')) return 'cherry';
  if (n.includes('sugar') || n.includes('syrup') || n.includes('시럽') || n.includes('설탕'))
    return 'sugar';
  if (n.includes('salt') || n.includes('소금')) return 'salt';
  return 'lemon';
};

const difficultyLabel = (d: number): string => {
  if (d <= 1) return '초급';
  if (d === 2) return '중급';
  return '고급';
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recipe, setRecipe] = useState<RecipeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!BACKEND_ENABLED || !id) return;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    try {
      const res = await recipeApi.getById(numericId);
      setRecipe(res.data);
    } catch (err) {
      Alert.alert('레시피 불러오기 실패', parseApiError(err).message);
    }
  }, [id]);

  useEffect(() => {
    void fetchDetail().finally(() => setLoading(false));
  }, [fetchDetail]);

  if (loading) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.amber[500]} />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>레시피 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const tone = baseSpiritToTone(recipe.baseSpirit);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="recipe-detail-screen">
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} />}
        title=""
        right={
          <IconBtn onPress={() => setFavorited((v) => !v)} testID="recipe-detail-favorite-button">
            <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <Path
                d="M3 2h8v10l-4-2.5L3 12V2z"
                stroke={colors.ink[900]}
                strokeWidth={1.7}
                strokeLinejoin="round"
                fill={favorited ? colors.amber[300] : 'none'}
              />
            </Svg>
          </IconBtn>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{recipe.tasteTags.join(' · ') || 'COCKTAIL'}</Text>
          <Text style={styles.title}>{recipe.name}</Text>
          {recipe.description ? (
            <Text style={styles.subtitle}>{recipe.description}</Text>
          ) : null}
        </View>

        <View style={styles.glassCard}>
          <CocktailGlass style="rocks" tone={tone} size="lg" />
        </View>

        <View style={styles.stats}>
          {[
            { k: 'ABV', v: recipe.abv != null ? `${recipe.abv}%` : '—' },
            { k: 'TIME', v: recipe.estimatedMinutes ? `${recipe.estimatedMinutes} min` : '—' },
            { k: 'LEVEL', v: difficultyLabel(recipe.difficulty) },
          ].map((s, i) => (
            <View key={s.k} style={[styles.statCol, i < 2 && styles.statColBorder]}>
              <Text style={styles.statK}>{s.k}</Text>
              <Text style={styles.statV}>{s.v}</Text>
            </View>
          ))}
        </View>

        <View style={styles.body}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/recipe/[id]/missing',
                params: { id: String(recipe.id) },
              })
            }
            testID="recipe-detail-missing-link"
            style={styles.missingLink}
          >
            <Text style={styles.missingLinkText}>내 인벤토리와 비교하기 →</Text>
          </Pressable>

          <Eyebrow>INGREDIENTS · 1 SERVE</Eyebrow>
          <View style={styles.ingList}>
            {recipe.ingredients.map((ing, i) => (
              <View
                key={ing.id}
                style={[
                  styles.ingRow,
                  i < recipe.ingredients.length - 1 && styles.ingRowBorder,
                ]}
              >
                <IngChip type={guessIngChip(ing.name)} size="sm" />
                <View style={styles.ingMeta}>
                  <Text style={styles.ingName}>{ing.name}</Text>
                </View>
                <Text style={styles.ingAmt}>
                  {ing.amount ?? ''}
                  <Text style={styles.ingUnit}> {ing.unit ?? ''}</Text>
                </Text>
              </View>
            ))}
            {recipe.ingredients.length === 0 ? (
              <Text style={styles.emptyMsg}>재료 정보가 없습니다.</Text>
            ) : null}
          </View>

          <View style={styles.methodSection}>
            <Eyebrow>METHOD</Eyebrow>
            <View style={styles.steps}>
              {recipe.steps.map((s, i) => (
                <View key={s.id} style={styles.step}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>
                      {String(i + 1).padStart(2, '0')}
                    </Text>
                  </View>
                  <View style={styles.stepBody}>
                    <Text style={styles.stepDesc}>{s.description}</Text>
                  </View>
                </View>
              ))}
              {recipe.steps.length === 0 ? (
                <Text style={styles.emptyMsg}>조리 단계가 없습니다.</Text>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing[4] }]}>
        <Pressable style={styles.heartBtn} onPress={() => setFavorited((v) => !v)}>
          <Text style={styles.heartText}>{favorited ? '♥' : '♡'}</Text>
        </Pressable>
        <View style={styles.actionCtaWrap}>
          <CTA
            variant="amber"
            onPress={() => router.back()}
            testID="recipe-detail-made-button"
          >
            만들기 완료
          </CTA>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper[50] },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
  },
  emptyMsg: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
    paddingVertical: spacing[4],
    textAlign: 'center',
  },
  scroll: { paddingBottom: spacing[6] },
  header: { paddingHorizontal: spacing[6], marginBottom: spacing[4] },
  eyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.amber[500],
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h1,
    color: colors.ink[900],
    letterSpacing: -0.6,
    lineHeight: fontSize.h1 * 1.02,
    marginTop: spacing[2],
  },
  subtitle: {
    fontFamily: fontFamily.serif.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    marginTop: spacing[2],
    fontStyle: 'italic',
  },
  glassCard: {
    marginHorizontal: spacing[5],
    marginBottom: spacing[5],
    paddingVertical: spacing[5],
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.25)',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginHorizontal: spacing[6],
    marginBottom: spacing[6],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.paper[300],
  },
  statCol: { flex: 1, alignItems: 'center' },
  statColBorder: { borderRightWidth: 1, borderColor: colors.paper[300] },
  statK: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.paper[400],
    letterSpacing: 1.8,
  },
  statV: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.ink[900],
    marginTop: spacing[1],
  },
  body: { paddingHorizontal: spacing[6] },
  missingLink: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.amber[50],
    borderRadius: radius.md,
    marginBottom: spacing[5],
    alignItems: 'center',
  },
  missingLinkText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.amber[600],
  },
  ingList: { marginTop: spacing[3], marginBottom: spacing[7] },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  ingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.paper[200],
  },
  ingMeta: { flex: 1, minWidth: 0 },
  ingName: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  ingAmt: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.md + 2,
    color: colors.ink[900],
    letterSpacing: -0.16,
  },
  ingUnit: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    fontWeight: '500',
  },
  methodSection: { marginBottom: spacing[5] },
  steps: { marginTop: spacing[3], gap: spacing[4] },
  step: { flexDirection: 'row', gap: spacing[3] },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ink[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.md,
    color: colors.amber[200],
  },
  stepBody: { flex: 1, paddingTop: spacing[1] },
  stepDesc: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.ink[800],
    lineHeight: fontSize.sm * lineHeight.normal,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    flexDirection: 'row',
    gap: spacing[2],
    backgroundColor: colors.paper[50],
    borderTopWidth: 1,
    borderTopColor: colors.paper[200],
  },
  heartBtn: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: colors.paper[300],
    borderRadius: radius.md,
  },
  heartText: {
    fontSize: fontSize.lg,
    color: colors.semantic.danger,
  },
  actionCtaWrap: { flex: 1 },
});

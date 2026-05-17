import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, BackBtn, Eyebrow } from '@/components/ui';
import { CocktailGlass, IngChip, type IngChipType } from '@/components/illustrations';
import { recipeApi } from '@/api/recipe';
import { inventoryApi } from '@/api/inventory';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import type { RecipeDetailResponse, RecipeIngredient } from '@/types/recipe';
import type { InventoryItemSummary } from '@/types/inventory';

const guessIngChip = (name: string): IngChipType => {
  const n = name.toLowerCase();
  if (n.includes('lemon') || n.includes('레몬')) return 'lemon';
  if (n.includes('lime') || n.includes('라임')) return 'lime';
  if (n.includes('orange') || n.includes('오렌지')) return 'orange';
  if (n.includes('cherry') || n.includes('체리') || n.includes('bitter')) return 'cherry';
  if (n.includes('sugar') || n.includes('syrup') || n.includes('시럽')) return 'sugar';
  if (n.includes('salt') || n.includes('소금')) return 'salt';
  return 'lemon';
};

/**
 * 인벤토리에 해당 재료가 있는지 검사 (단순 substring 매칭).
 * BE에 ingredient master 매핑 테이블이 없어 휴리스틱이 최선.
 */
const hasIngredient = (ing: RecipeIngredient, inv: InventoryItemSummary[]): boolean => {
  const ingName = ing.name.toLowerCase().trim();
  return inv.some((b) => {
    const bn = b.name.toLowerCase();
    return bn.includes(ingName) || ingName.includes(bn);
  });
};

export default function RecipeMissingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [recipe, setRecipe] = useState<RecipeDetailResponse | null>(null);
  const [inventory, setInventory] = useState<InventoryItemSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!BACKEND_ENABLED || !id) return;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    try {
      const [r, inv] = await Promise.all([
        recipeApi.getById(numericId),
        inventoryApi.list({ size: 100 }),
      ]);
      setRecipe(r.data);
      setInventory(inv.data.content);
    } catch {
      /* noop */
    }
  }, [id]);

  useEffect(() => {
    void fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  const { have, missing } = useMemo(() => {
    if (!recipe) return { have: [], missing: [] };
    const h: RecipeIngredient[] = [];
    const m: RecipeIngredient[] = [];
    recipe.ingredients.forEach((ing) => {
      (hasIngredient(ing, inventory) ? h : m).push(ing);
    });
    return { have: h, missing: m };
  }, [recipe, inventory]);

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

  const total = recipe.ingredients.length;
  const ratio = total > 0 ? have.length / total : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="recipe-missing-screen">
      <StatusBar style="dark" />
      <AppBar left={<BackBtn onPress={() => router.back()} />} title="재료 비교" serif={false} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing[6] }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.glassWrap}>
          <CocktailGlass style="coupe" tone="clear" size="md" />
        </View>

        <View style={styles.centerRow}>
          <Eyebrow>{missing.length === 0 ? 'READY' : 'ALMOST THERE'}</Eyebrow>
          <Text style={styles.heading}>
            <Text style={styles.headingAccent}>{recipe.name}</Text>
            {missing.length === 0 ? '\n바로 만들 수 있어요' : `\n${missing.length}개가 더 필요해요`}
          </Text>
          <Text style={styles.summary}>
            전체 재료 {total}개 중 <Text style={styles.summaryStrong}>{have.length}개 보유</Text>
          </Text>
        </View>

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

        {have.length > 0 ? (
          <>
            <Eyebrow>보유 중 · {have.length}</Eyebrow>
            <View style={styles.list}>
              {have.map((ing) => (
                <View key={ing.id} style={styles.haveRow}>
                  <IngChip type={guessIngChip(ing.name)} size="sm" />
                  <Text style={styles.haveName}>{ing.name}</Text>
                  <Text style={styles.haveAmt}>
                    {ing.amount ?? ''} {ing.unit ?? ''}
                  </Text>
                  <Text style={styles.haveCheck}>✓</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {missing.length > 0 ? (
          <>
            <View style={styles.missHeader}>
              <Eyebrow>부족한 재료 · {missing.length}</Eyebrow>
              <Text style={styles.needed}>NEEDED</Text>
            </View>
            <View style={styles.list}>
              {missing.map((ing) => (
                <Pressable
                  key={ing.id}
                  testID={`recipe-missing-add-${ing.id}`}
                  onPress={() => router.push('/bottle/new')}
                  style={({ pressed }) => [styles.missRow, pressed && styles.missRowPressed]}
                >
                  <IngChip type={guessIngChip(ing.name)} size="sm" />
                  <View style={styles.missMeta}>
                    <Text style={styles.missName}>{ing.name}</Text>
                    <Text style={styles.missSwap}>↳ 추가하기</Text>
                  </View>
                  <Text style={styles.missAmt}>
                    {ing.amount ?? ''} {ing.unit ?? ''}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
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
  scroll: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[3],
  },
  glassWrap: {
    alignItems: 'center',
    marginVertical: spacing[3],
  },
  centerRow: { alignItems: 'center' },
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
});

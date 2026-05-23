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
import { inventoryApi } from '@/api/inventory';
import { userApi } from '@/api/user';
import { AppBar, Chip, IconBtn } from '@/components/ui';
import { Bottle } from '@/components/illustrations';
import { useAuthStore } from '@/store/authStore';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import {
  CATEGORY_LABEL,
  CATEGORY_TO_BOTTLE_TONE,
  LEVEL_TO_RATIO,
  isLowStock,
} from '@/utils/domainMappers';
import type { Category, InventoryHomeResponse, InventoryItemSummary } from '@/types/inventory';

/**
 * 칩 라벨 ↔ BE Category enum.
 * "전체"는 필터 없음. "믹서"는 BE enum에 없어서 제거 (대신 "보드카"/"테킬라" 추가).
 */
const CATEGORY_FILTERS: { label: string; value: Category | null }[] = [
  { label: '전체', value: null },
  { label: '위스키', value: 'WHISKEY' },
  { label: '진', value: 'GIN' },
  { label: '럼', value: 'RUM' },
  { label: '보드카', value: 'VODKA' },
  { label: '테킬라', value: 'TEQUILA' },
  { label: '리큐르', value: 'LIQUEUR' },
  { label: '기타', value: 'OTHER' },
];

export default function BarHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser } = useAuthStore();
  const [home, setHome] = useState<InventoryHomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchAll = useCallback(async () => {
    if (!BACKEND_ENABLED) return;
    try {
      const [homeRes, profileRes] = await Promise.all([
        inventoryApi.getHome({ size: 20 }),
        userApi.getMyProfile(),
      ]);
      setHome(homeRes.data);
      setUser(profileRes.data);
    } catch {
      /* 토큰 만료 등은 client.ts 인터셉터가 처리 */
    }
  }, [setUser]);

  // 최초 로드
  useEffect(() => {
    void fetchAll().finally(() => setLoading(false));
  }, [fetchAll]);

  // 탭 재진입 시 최신화 (잔량 변경 후 돌아왔을 때)
  useFocusEffect(
    useCallback(() => {
      if (!loading) void fetchAll();
    }, [fetchAll, loading]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }, [fetchAll]);

  const allItems: InventoryItemSummary[] = home?.inventory.content ?? [];
  // 칩 필터는 클라이언트 사이드 (MVP. 보틀 많아지면 inventoryApi.list({ category }) 호출로 교체).
  const items = selectedCategory
    ? allItems.filter((i) => i.category === selectedCategory)
    : allItems;
  const total = home?.insights.totalItemCount ?? 0;
  const lowStock = items.filter((i) => isLowStock(i.levelStatus)).length;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="tab-bar-home-screen">
      <StatusBar style="dark" />
      <AppBar
        title="My Bar"
        right={
          <IconBtn onPress={() => router.push('/bottle/new')} testID="bar-add-bottle-button">
            <Svg width={14} height={14} viewBox="0 0 14 14">
              <Path
                d="M7 2v10M2 7h10"
                stroke={colors.ink[900]}
                strokeWidth={1.8}
                strokeLinecap="round"
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
        {/* Hero counter — 다크 카드 */}
        <View style={styles.hero} testID="bar-counter">
          <Text style={styles.heroEyebrow}>TONIGHT&apos;S COUNTER</Text>
          <View style={styles.heroNumberRow}>
            <Text style={styles.heroNumber}>{total}</Text>
            <Text style={styles.heroLabel}>bottles on the shelf</Text>
          </View>
          <View style={styles.heroStatus}>
            <Text style={styles.heroStatusText}>
              <Text style={styles.dotOk}>● </Text>
              충분 {Math.max(0, items.length - lowStock)}
            </Text>
            <Text style={styles.heroStatusText}>
              <Text style={styles.dotDanger}>● </Text>
              부족 {lowStock}
            </Text>
          </View>

          {/* Shelf — 미니 병들 */}
          <View style={styles.shelfRow}>
            {items.slice(0, 5).map((b) => (
              <View key={b.id} style={styles.shelfBottle}>
                <Bottle
                  tone={CATEGORY_TO_BOTTLE_TONE[b.category]}
                  level={LEVEL_TO_RATIO[b.levelStatus]}
                  height={64}
                />
              </View>
            ))}
          </View>
          <View style={styles.shelfBoard} />
        </View>

        {/* Category chips — 클라이언트 필터 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORY_FILTERS.map((c) => (
            <Chip
              key={c.label}
              active={c.value === selectedCategory}
              onPress={() => setSelectedCategory(c.value)}
              testID={`bar-category-${c.label}`}
            >
              {c.label}
            </Chip>
          ))}
        </ScrollView>

        {/* Loading / Empty state */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.amber[500]} />
          </View>
        ) : items.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>아직 등록된 보틀이 없어요</Text>
            <Text style={styles.emptySub}>우측 상단 + 버튼으로 첫 병을 추가해보세요.</Text>
          </View>
        ) : (
          <View style={styles.invList}>
            {items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({ pathname: '/bottle/[id]', params: { id: String(item.id) } })
                }
                testID={`bar-inventory-item-${item.id}`}
                style={({ pressed }) => [styles.invRow, pressed && styles.invRowPressed]}
              >
                <View style={styles.invBottle}>
                  <Bottle
                    tone={CATEGORY_TO_BOTTLE_TONE[item.category]}
                    level={LEVEL_TO_RATIO[item.levelStatus]}
                    height={56}
                  />
                </View>
                <View style={styles.invMeta}>
                  <Text style={styles.invName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.invSub}>
                    {CATEGORY_LABEL[item.category]}
                    {item.isOpened ? ' · 개봉' : ''}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.invLevel,
                    {
                      color: isLowStock(item.levelStatus)
                        ? colors.semantic.danger
                        : colors.ink[900],
                    },
                  ]}
                >
                  {Math.round(LEVEL_TO_RATIO[item.levelStatus] * 100)}%
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Insight CTA */}
        <Pressable
          onPress={() => router.push('/bar/insight')}
          style={({ pressed }) => [styles.insightBtn, pressed && styles.insightBtnPressed]}
        >
          <Text style={styles.insightText}>지난 30일 소비 인사이트 보기</Text>
          <Text style={styles.insightArrow}>→</Text>
        </Pressable>
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
    backgroundColor: colors.ink[900],
    borderRadius: radius.lg,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[5],
    overflow: 'hidden',
  },
  heroEyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.brass.base,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  heroNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  heroNumber: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.display,
    color: colors.paper[50],
    letterSpacing: -1.5,
    lineHeight: fontSize.display,
  },
  heroLabel: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
  },
  heroStatus: {
    flexDirection: 'row',
    gap: spacing[4],
    marginTop: spacing[3],
  },
  heroStatusText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[50],
  },
  dotOk: { color: colors.amber[200] },
  dotDanger: { color: colors.semantic.danger },
  shelfRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: spacing[4],
    paddingBottom: spacing[1],
    borderBottomWidth: 3,
    borderBottomColor: colors.brass.base,
    gap: -4,
  },
  shelfBottle: {
    marginRight: -4,
  },
  shelfBoard: {
    height: 6,
    backgroundColor: colors.amber[600],
  },
  catRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
    paddingBottom: spacing[2],
  },
  center: {
    paddingVertical: spacing[7],
    alignItems: 'center',
  },
  empty: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[7],
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
    textAlign: 'center',
  },
  invList: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    gap: spacing[2],
  },
  invRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.paper[100],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.2)',
  },
  invRowPressed: {
    opacity: 0.85,
  },
  invBottle: {
    width: 28,
    flexShrink: 0,
    alignItems: 'center',
  },
  invMeta: {
    flex: 1,
    minWidth: 0,
  },
  invName: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md + 2,
    color: colors.ink[900],
    letterSpacing: -0.16,
    marginBottom: spacing[1],
    lineHeight: (fontSize.md + 2) * lineHeight.tight,
  },
  invSub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
  },
  invLevel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },
  insightBtn: {
    marginHorizontal: spacing[5],
    marginTop: spacing[4],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.paper[100],
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.paper[300],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightBtnPressed: {
    opacity: 0.85,
  },
  insightText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  insightArrow: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.lg,
    color: colors.ink[900],
  },
});

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { userApi } from '@/api/user';
import { AppBar, Chip, IconBtn } from '@/components/ui';
import { Bottle, type BottleTone } from '@/components/illustrations';
import { useAuthStore } from '@/store/authStore';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';

interface BottleItem {
  id: string;
  name: string;
  category: string;
  tone: BottleTone;
  level: number;
  volume: number;
  abv: number;
  label: string;
}

// 작업 18(백엔드 연동)에서 실제 인벤토리 API로 교체.
const MOCK_INVENTORY: BottleItem[] = [
  { id: '1', name: 'Lagavulin 16', category: '위스키', tone: 'amber', level: 0.42, volume: 700, abv: 43, label: 'LAGAVULIN' },
  { id: '2', name: 'Hendricks Gin', category: '진', tone: 'clear', level: 0.78, volume: 700, abv: 41.4, label: 'HENDRICKS' },
  { id: '3', name: 'Campari', category: '리큐르', tone: 'red', level: 0.22, volume: 750, abv: 25, label: 'CAMPARI' },
  { id: '4', name: 'Green Chartreuse', category: '리큐르', tone: 'green', level: 0.65, volume: 700, abv: 55, label: 'CHARTREUSE' },
  { id: '5', name: 'Bulleit Bourbon', category: '위스키', tone: 'amber', level: 0.88, volume: 700, abv: 45, label: 'BULLEIT' },
  { id: '6', name: 'Plantation Rum', category: '럼', tone: 'amber', level: 0.55, volume: 700, abv: 40, label: 'PLANTATION' },
];

const CATEGORIES = ['전체', '위스키', '진', '럼', '리큐르', '믹서'];

export default function BarHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setUser } = useAuthStore();

  useEffect(() => {
    // UI 단계: 백엔드 미연동. 작업 18에서 BACKEND_ENABLED=true로 활성.
    if (!BACKEND_ENABLED) return;
    const fetchProfile = async () => {
      try {
        const res = await userApi.getMyProfile();
        setUser(res.data);
      } catch {
        /* noop */
      }
    };
    void fetchProfile();
  }, [setUser]);

  const inventory = MOCK_INVENTORY;
  const total = inventory.length;
  const lowStock = inventory.filter((i) => i.level < 0.3).length;

  return (
    <View
      style={[styles.root, { paddingTop: insets.top }]}
      testID="tab-bar-home-screen"
    >
      <StatusBar style="dark" />
      <AppBar
        title="My Bar"
        right={
          <IconBtn onPress={() => router.push('/_debug')} testID="bar-add-bottle-button">
            <Svg width={14} height={14} viewBox="0 0 14 14">
              <Path d="M7 2v10M2 7h10" stroke={colors.ink[900]} strokeWidth={1.8} strokeLinecap="round" />
            </Svg>
          </IconBtn>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing[6] },
        ]}
        showsVerticalScrollIndicator={false}
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
              <Text style={{ color: colors.amber[200] }}>● </Text>
              충분 {total - lowStock}
            </Text>
            <Text style={styles.heroStatusText}>
              <Text style={{ color: colors.semantic.danger }}>● </Text>
              부족 {lowStock}
            </Text>
          </View>

          {/* Shelf — 미니 병들 */}
          <View style={styles.shelfRow}>
            {inventory.slice(0, 5).map((b) => (
              <View key={b.id} style={styles.shelfBottle}>
                <Bottle tone={b.tone} level={b.level} height={64} />
              </View>
            ))}
          </View>
          <View style={styles.shelfBoard} />
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORIES.map((c, i) => (
            <Chip key={c} active={i === 0}>
              {c}
            </Chip>
          ))}
        </ScrollView>

        {/* Inventory list */}
        <View style={styles.invList}>
          {inventory.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push('/_debug')}
              testID={`bar-inventory-item-${item.id}`}
              style={({ pressed }) => [styles.invRow, pressed && styles.invRowPressed]}
            >
              <View style={styles.invBottle}>
                <Bottle tone={item.tone} level={item.level} height={56} />
              </View>
              <View style={styles.invMeta}>
                <Text style={styles.invName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.invSub}>
                  {item.category} · {item.volume}ml · {item.abv}%
                </Text>
              </View>
              <Text
                style={[
                  styles.invLevel,
                  { color: item.level < 0.3 ? colors.semantic.danger : colors.ink[900] },
                ]}
              >
                {Math.round(item.level * 100)}%
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Insight CTA */}
        <Pressable
          onPress={() => router.push('/_debug')}
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

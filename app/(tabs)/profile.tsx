import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, Eyebrow, IconBtn } from '@/components/ui';
import { Bottle } from '@/components/illustrations';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/api/user';
import { inventoryApi } from '@/api/inventory';
import { colors, fontFamily, fontSize, lineHeight, radius, shadows, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { CATEGORY_TO_BOTTLE_TONE, LEVEL_TO_RATIO } from '@/utils/domainMappers';
import type { MyProfileStats } from '@/types/user';
import type { InventoryItemSummary } from '@/types/inventory';

/** 큰 숫자(1k+) 압축 표시 — 1234 → "1.2k" */
const compactNumber = (n: number | undefined): string => {
  if (n == null) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
};

const TABS = ['POSTS', 'RECIPES', 'SAVED'] as const;
type ProfileTab = (typeof TABS)[number];

export default function ProfileTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>('POSTS');
  const [loggingOut, setLoggingOut] = useState(false);
  const [stats, setStats] = useState<MyProfileStats | null>(null);
  const [shelfBottles, setShelfBottles] = useState<InventoryItemSummary[]>([]);
  const [shelfTotal, setShelfTotal] = useState<number>(0);

  const nickname = user?.username ?? '바텐더';

  // BE 병합 API + 인벤토리 동시 호출
  const fetchAll = useCallback(async () => {
    if (!BACKEND_ENABLED) return;
    try {
      const [profileRes, inventoryRes] = await Promise.all([
        userApi.getMyProfilePage(),
        inventoryApi.getHome({ size: 9 }),
      ]);
      setStats(profileRes.data.stats);
      setShelfBottles(inventoryRes.data.inventory.content.slice(0, 7));
      setShelfTotal(inventoryRes.data.insights.totalItemCount);
    } catch {
      /* noop — 인터셉터가 처리 */
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  useFocusEffect(
    useCallback(() => {
      void fetchAll();
    }, [fetchAll]),
  );

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          await logout();
          setLoggingOut(false);
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="tab-profile-screen">
      <StatusBar style="dark" />
      <AppBar
        title=""
        right={
          <IconBtn onPress={handleLogout} testID="profile-logout-button">
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Path
                d="M3 8h1.3M7.4 8h1.3M11.7 8h1.3"
                stroke={colors.ink[900]}
                strokeWidth={1.7}
                strokeLinecap="round"
              />
            </Svg>
          </IconBtn>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing[6] }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + stats */}
        <View style={styles.headerRow} testID="profile-avatar">
          <LinearGradient
            colors={['#e4a83c', '#6d4410']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.avatar, shadows.md]}
          />
          <View style={styles.statsGrid}>
            <View style={styles.statCol}>
              <Text style={styles.statN}>{compactNumber(stats?.postCount)}</Text>
              <Text style={styles.statL}>POSTS</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statN}>{compactNumber(stats?.receivedLikeCount)}</Text>
              <Text style={styles.statL}>LIKES</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statN}>{compactNumber(stats?.myRecipeCount)}</Text>
              <Text style={styles.statL}>RECIPES</Text>
            </View>
          </View>
        </View>

        <Text style={styles.bioEyebrow}>SEOUL · HOME BAR</Text>
        <Text style={styles.bioName}>{nickname}</Text>
        <Text style={styles.bioBody}>
          위스키 3년차 · 스모키한 한 잔을 사랑하는 사람{'\n'}
          매주 수요일 실험 기록 공유합니다.
        </Text>

        <View style={styles.actionRow}>
          <Pressable style={styles.followBtn} onPress={() => router.push('/_debug')}>
            <Text style={styles.followText}>팔로우</Text>
          </Pressable>
          <Pressable style={styles.messageBtn} onPress={() => router.push('/_debug')}>
            <Text style={styles.messageText}>메시지</Text>
          </Pressable>
        </View>

        {/* My shelf — 실제 인벤토리 상위 7병 */}
        <View style={styles.shelfSection}>
          <Eyebrow>THE SHELF · {shelfTotal} BOTTLES</Eyebrow>
          <View style={styles.shelfBox}>
            <View style={styles.shelfRow}>
              {shelfBottles.length > 0 ? (
                shelfBottles.map((b, j) => (
                  <View key={b.id} style={styles.shelfBottle}>
                    <Bottle
                      tone={CATEGORY_TO_BOTTLE_TONE[b.category]}
                      height={62 + (j % 2 === 0 ? 6 : 0)}
                      level={LEVEL_TO_RATIO[b.levelStatus]}
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.shelfEmpty}>My Bar에 보틀을 추가해보세요</Text>
              )}
            </View>
            <View style={styles.shelfBoard} />
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setActiveTab(t)}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              testID={`profile-tab-${t}`}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.emptyGrid}>
          <Text style={styles.emptyText}>
            {activeTab === 'POSTS' ? '아직 게시글이 없어요' : null}
            {activeTab === 'RECIPES' ? '아직 등록한 레시피가 없어요' : null}
            {activeTab === 'SAVED' ? '저장한 항목이 없어요' : null}
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          style={[styles.logoutLink, loggingOut && styles.logoutLinkDisabled]}
        >
          <Text style={styles.logoutText}>{loggingOut ? '로그아웃 중...' : '로그아웃'}</Text>
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
    paddingHorizontal: spacing[6],
    paddingTop: spacing[1],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    marginBottom: spacing[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.brass.base,
  },
  statsGrid: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing[2],
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statN: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.ink[900],
  },
  statL: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.paper[400],
    letterSpacing: 1.8,
    marginTop: 2,
  },
  bioEyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.amber[500],
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  bioName: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h2,
    color: colors.ink[900],
    letterSpacing: -0.5,
    lineHeight: fontSize.h2 * 1.1,
    marginTop: spacing[2],
  },
  bioBody: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    marginTop: spacing[2],
    lineHeight: fontSize.md * lineHeight.normal,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[4],
  },
  followBtn: {
    flex: 1,
    paddingVertical: spacing[3],
    backgroundColor: colors.ink[900],
    borderRadius: radius.md,
    alignItems: 'center',
  },
  followText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.md,
    color: colors.paper[50],
  },
  messageBtn: {
    flex: 1,
    paddingVertical: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.paper[300],
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  messageText: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  shelfSection: {
    marginTop: spacing[5],
  },
  shelfBox: {
    marginTop: spacing[3],
    backgroundColor: colors.ink[900],
    borderRadius: radius.md,
    paddingTop: spacing[5],
    overflow: 'hidden',
  },
  shelfRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
    gap: -4,
  },
  shelfBottle: {
    marginRight: -2,
  },
  shelfBoard: {
    height: 4,
    backgroundColor: colors.brass.base,
    marginTop: spacing[1],
  },
  shelfEmpty: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
    paddingVertical: spacing[5],
    textAlign: 'center',
    width: '100%',
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.paper[200],
    marginTop: spacing[5],
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.amber[400],
  },
  tabText: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    letterSpacing: 1.8,
  },
  tabTextActive: {
    color: colors.ink[900],
  },
  emptyGrid: {
    paddingVertical: spacing[7],
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
  },
  logoutLink: {
    alignItems: 'center',
    paddingVertical: spacing[3],
    marginTop: spacing[2],
  },
  logoutLinkDisabled: {
    opacity: 0.5,
  },
  logoutText: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.sm,
    color: colors.semantic.danger,
  },
});

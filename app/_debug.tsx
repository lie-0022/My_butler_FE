/**
 * TEMP-DEBUG: 개발 중 화면 네비게이션 + 인증 토글 메뉴.
 * 배포 전 삭제. 작업 24 또는 배포 직전 일괄 정리.
 */
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, type Href } from 'expo-router';
import { Eyebrow } from '@/components/ui';
import { tokenStorage } from '@/api/client';
import { useAuthStore } from '@/store/authStore';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';

type Status = 'done' | 'wip' | 'todo' | 'new';

interface DebugItem {
  label: string;
  href?: Href;
  status: Status;
  onPress?: () => void;
}

interface DebugGroup {
  category: string;
  items: DebugItem[];
}

const STATUS_BADGE: Record<Status, string> = {
  done: '✅',
  wip: '⏳',
  todo: '⬜',
  new: '🆕',
};

export default function DebugScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setAuthFromToken = useAuthStore((s) => s.initialize);

  const handleLogout = async () => {
    await tokenStorage.clear();
    await setAuthFromToken();
    Alert.alert('로그아웃 완료', '토큰을 모두 삭제했습니다.');
  };

  const handleCheckToken = async () => {
    const access = await tokenStorage.getAccessToken();
    const refresh = await tokenStorage.getRefreshCookie();
    Alert.alert(
      '토큰 상태',
      [
        `access_token: ${access ? `${access.slice(0, 16)}…` : '(없음)'}`,
        `refresh_token: ${refresh ? `${refresh.slice(0, 16)}…` : '(없음)'}`,
      ].join('\n'),
    );
  };

  const groups: DebugGroup[] = [
    {
      category: 'TEST',
      items: [{ label: 'Bottle SVG 테스트', href: '/_test-bottle', status: 'new' }],
    },
    {
      category: 'AUTH',
      items: [
        { label: 'login (Front Door)', href: '/(auth)/login', status: 'done' },
        { label: 'loginEmail (신규)', href: '/(auth)/login-email', status: 'done' },
        { label: 'register', href: '/(auth)/register', status: 'done' },
        { label: 'forgot-password', href: '/(auth)/forgot-password', status: 'done' },
      ],
    },
    {
      category: 'ONBOARDING',
      items: [
        { label: 'step1 (signup2)', href: '/(onboarding)/step1', status: 'done' },
        { label: 'step2 (signup3)', href: '/(onboarding)/step2', status: 'done' },
        { label: 'step3 (welcome)', href: '/(onboarding)/step3', status: 'done' },
      ],
    },
    {
      category: 'TABS (메인)',
      items: [
        { label: '(tabs) 홈 (My Bar)', href: '/(tabs)', status: 'done' },
        { label: '(tabs) Recipes', href: '/(tabs)/recipes', status: 'done' },
        { label: '(tabs) AR (placeholder)', href: '/(tabs)/ar', status: 'done' },
        { label: '(tabs) Feed', href: '/(tabs)/feed', status: 'done' },
        { label: '(tabs) Profile', href: '/(tabs)/profile', status: 'done' },
      ],
    },
    {
      category: 'STACK (상세)',
      items: [
        {
          label: 'bottle/[id] (barDetail)',
          href: { pathname: '/bottle/[id]', params: { id: 'test-id' } },
          status: 'done',
        },
        { label: 'bottle/new (barAdd)', href: '/bottle/new', status: 'done' },
        { label: 'bar/insight', href: '/bar/insight', status: 'done' },
        {
          label: 'recipe/[id] (Detail)',
          href: { pathname: '/recipe/[id]', params: { id: 'test-id' } },
          status: 'done',
        },
        {
          label: 'recipe/[id]/missing',
          href: { pathname: '/recipe/[id]/missing', params: { id: 'test-id' } },
          status: 'done',
        },
        {
          label: 'post/[id]',
          href: { pathname: '/post/[id]', params: { id: 'test-id' } },
          status: 'done',
        },
      ],
    },
    {
      category: 'AUTH STATE',
      items: [
        { label: '로그아웃 (토큰 클리어)', status: 'new', onPress: handleLogout },
        { label: '토큰 상태 확인', status: 'new', onPress: handleCheckToken },
      ],
    },
  ];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={styles.warningBanner}>
        <Text style={styles.warningText}>DEBUG MENU — 프로덕션 빌드 시 제거</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing[6] }]}
      >
        {groups.map((group) => (
          <View key={group.category} style={styles.group}>
            <Eyebrow style={styles.groupHeader}>{group.category}</Eyebrow>
            <View style={styles.itemList}>
              {group.items.map((item, i) => (
                <DebugRow
                  key={item.label}
                  label={item.label}
                  status={item.status}
                  isLast={i === group.items.length - 1}
                  onPress={() => {
                    if (item.onPress) {
                      item.onPress();
                    } else if (item.href) {
                      router.push(item.href);
                    }
                  }}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

interface DebugRowProps {
  label: string;
  status: Status;
  isLast: boolean;
  onPress: () => void;
}

function DebugRow({ label, status, isLast, onPress }: DebugRowProps) {
  return (
    <Pressable
      onPress={onPress}
      testID={`debug-row-${label}`}
      style={({ pressed }) => [
        styles.row,
        !isLast && styles.rowDivider,
        pressed && styles.rowPressed,
      ]}
    >
      <Text style={styles.rowBadge}>{STATUS_BADGE[status]}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowChevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper[50],
  },
  warningBanner: {
    backgroundColor: colors.semantic.danger,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    alignItems: 'center',
  },
  warningText: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.paper[50],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  scroll: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    gap: spacing[5],
  },
  group: {
    gap: spacing[2],
  },
  groupHeader: {
    paddingLeft: spacing[1],
  },
  itemList: {
    backgroundColor: colors.paper[100],
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.paper[300],
  },
  rowPressed: {
    backgroundColor: colors.paper[200],
  },
  rowBadge: {
    fontSize: fontSize.md,
  },
  rowLabel: {
    flex: 1,
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  rowChevron: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xl,
    color: colors.paper[400],
  },
});

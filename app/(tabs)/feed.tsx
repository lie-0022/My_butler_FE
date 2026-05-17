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
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, Chip, IconBtn } from '@/components/ui';
import { CocktailGlass, type BottleTone } from '@/components/illustrations';
import { postApi } from '@/api/post';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import type { PostSortKey, PostSummaryResponse } from '@/types/post';

const FILTERS: { label: string; sort: PostSortKey }[] = [
  { label: 'All', sort: 'LATEST' },
  { label: '인기', sort: 'POPULAR' },
];

/** username 첫 글자 hash → 아바타 그라데이션 톤 결정 (시각적 다양성용) */
const tones: BottleTone[] = ['amber', 'clear', 'green', 'red'];
const pickAvatarTone = (username: string): BottleTone => {
  const code = username.charCodeAt(0) || 0;
  return tones[code % tones.length] ?? 'amber';
};

const AVATAR_GRADIENTS: Record<BottleTone, [string, string]> = {
  amber: ['#e4a83c', '#6d4410'],
  clear: ['#e8dfc9', '#70583a'],
  green: ['#7a8a4a', '#2e3a14'],
  red: ['#c63820', '#4a0e05'],
  blue: ['#3a5a7a', '#16263e'],
};

const timeAgo = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.round(diffMs / 60000);
  if (m < 1) return '방금';
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
};

export default function FeedTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<PostSortKey>('LATEST');
  const [posts, setPosts] = useState<PostSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeed = useCallback(async () => {
    if (!BACKEND_ENABLED) return;
    try {
      const res = await postApi.getFeed({ sort: filter, page: 0, size: 20 });
      setPosts(res.data.content);
    } catch {
      /* noop */
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    void fetchFeed().finally(() => setLoading(false));
  }, [fetchFeed]);

  useFocusEffect(
    useCallback(() => {
      if (!loading) void fetchFeed();
    }, [fetchFeed, loading]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  }, [fetchFeed]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="tab-feed-screen">
      <StatusBar style="dark" />
      <AppBar
        title="Counter Talk"
        right={
          <IconBtn onPress={() => router.push('/_debug')} testID="feed-write-button">
            <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <Path
                d="M7 2v10M2 7h10"
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <Chip
              key={f.label}
              active={f.sort === filter}
              onPress={() => setFilter(f.sort)}
              testID={`feed-filter-${f.label}`}
            >
              {f.label}
            </Chip>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={colors.amber[500]} />
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>아직 게시물이 없어요</Text>
            <Text style={styles.emptySub}>가장 먼저 게시물을 올려보세요.</Text>
          </View>
        ) : (
          <View style={styles.postsList}>
            {posts.map((p) => {
              const tone = pickAvatarTone(p.author.username);
              return (
                <Pressable
                  key={p.id}
                  onPress={() =>
                    router.push({ pathname: '/post/[id]', params: { id: String(p.id) } })
                  }
                  testID={`feed-post-${p.id}`}
                  style={({ pressed }) => [styles.post, pressed && styles.postPressed]}
                >
                  <View style={styles.postHeader}>
                    <LinearGradient
                      colors={AVATAR_GRADIENTS[tone]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.avatar}
                    />
                    <View style={styles.postUser}>
                      <Text style={styles.postUserName}>{p.author.username}</Text>
                      <Text style={styles.postUserHandle}>
                        @{p.author.username} · {timeAgo(p.createdAt)}
                      </Text>
                    </View>
                    {p.isArGenerated ? (
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeBadgeText}>AR</Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.visual}>
                    <CocktailGlass style="rocks" tone="amber" size="md" />
                  </View>

                  {p.recipeTag ? (
                    <Text style={styles.postTitle}>{p.recipeTag.recipeName}</Text>
                  ) : null}
                  {p.caption ? (
                    <Text style={styles.postBody} numberOfLines={3}>
                      {p.caption}
                    </Text>
                  ) : null}

                  <View style={styles.actions}>
                    <View style={styles.actionItem}>
                      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                        <Path
                          d="M7 12s-5-3-5-7a3 3 0 015-2 3 3 0 015 2c0 4-5 7-5 7z"
                          stroke={p.isLiked ? colors.semantic.danger : colors.paper[400]}
                          fill={p.isLiked ? colors.semantic.danger : 'none'}
                          strokeWidth={1.6}
                        />
                      </Svg>
                      <Text style={styles.actionText}>{p.likeCount}</Text>
                    </View>
                    <View style={styles.actionItem}>
                      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                        <Path
                          d="M2 3h10v7H5l-3 3V3z"
                          stroke={colors.paper[400]}
                          strokeWidth={1.6}
                          strokeLinejoin="round"
                        />
                      </Svg>
                      <Text style={styles.actionText}>{p.commentCount}</Text>
                    </View>
                    <Text style={styles.actionMore}>자세히 →</Text>
                  </View>
                </Pressable>
              );
            })}
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
  filterRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
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
  },
  postsList: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  post: {
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.2)',
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  postPressed: {
    opacity: 0.9,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  postUser: {
    flex: 1,
  },
  postUserName: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  postUserHandle: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
  },
  typeBadge: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
    backgroundColor: colors.ink[900],
    borderRadius: radius.pill,
  },
  typeBadgeText: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.amber[200],
    letterSpacing: 1.6,
  },
  visual: {
    backgroundColor: colors.ink[900],
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing[3],
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  postTitle: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.lg,
    color: colors.ink[900],
    letterSpacing: -0.16,
    lineHeight: fontSize.lg * lineHeight.tight,
  },
  postBody: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    marginTop: spacing[1],
    lineHeight: fontSize.md * lineHeight.normal,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[4],
    alignItems: 'center',
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.paper[200],
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1] + 1,
  },
  actionText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
  },
  actionMore: {
    marginLeft: 'auto',
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.amber[500],
  },
});

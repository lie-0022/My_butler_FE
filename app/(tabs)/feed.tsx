import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, Chip, IconBtn } from '@/components/ui';
import { Bottle, CocktailGlass, type BottleTone } from '@/components/illustrations';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';

type GlassToneCompat = Extract<BottleTone, 'amber' | 'clear' | 'red'>;
const fallbackTone = (t: BottleTone): GlassToneCompat =>
  t === 'amber' || t === 'clear' || t === 'red' ? t : 'amber';

interface Post {
  id: string;
  user: string;
  handle: string;
  avatar: BottleTone; // 그라데이션 톤 매핑
  time: string;
  type: 'RECIPE' | 'HOME BAR' | 'REVIEW';
  title: string;
  body: string;
  bottles?: boolean;
  tone?: BottleTone;
  likes: number;
  comments: number;
}

// 작업 18에서 실제 피드 API로 교체.
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    user: '바텐더 김',
    handle: '@bartender_kim',
    avatar: 'amber',
    time: '2h',
    type: 'RECIPE',
    title: 'Oaxacan Old Fashioned',
    body: '메즈칼로 스모키함을 한층 더. 토요일 밤에 완벽한 한 잔.',
    tone: 'amber',
    likes: 124,
    comments: 18,
  },
  {
    id: '2',
    user: '혜진',
    handle: '@hyejin_pour',
    avatar: 'clear',
    time: '5h',
    type: 'HOME BAR',
    title: '드디어 선반이 찼어요',
    body: '3년 걸렸네요. 다음은 뭘 들여야 할까요?',
    bottles: true,
    likes: 89,
    comments: 34,
  },
  {
    id: '3',
    user: '민수',
    handle: '@minsu.drinks',
    avatar: 'green',
    time: '1d',
    type: 'REVIEW',
    title: 'Yamazaki 12 — 드디어 영접',
    body: '생각보다 섬세하고 과일향이 확실했어요. 점수 8.5.',
    tone: 'amber',
    likes: 203,
    comments: 42,
  },
];

const FILTERS = ['All', '팔로잉', '레시피', '리뷰', '홈바'];

const AVATAR_GRADIENTS: Record<BottleTone, [string, string]> = {
  amber: ['#e4a83c', '#6d4410'],
  clear: ['#e8dfc9', '#70583a'],
  green: ['#7a8a4a', '#2e3a14'],
  red: ['#c63820', '#4a0e05'],
  blue: ['#3a5a7a', '#16263e'],
};

export default function FeedTabScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All');

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
      >
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
              testID={`feed-filter-${f}`}
            >
              {f}
            </Chip>
          ))}
        </ScrollView>

        {/* Posts */}
        <View style={styles.postsList}>
          {MOCK_POSTS.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push({ pathname: '/post/[id]', params: { id: p.id } })}
              testID={`feed-post-${p.id}`}
              style={({ pressed }) => [styles.post, pressed && styles.postPressed]}
            >
              {/* Header */}
              <View style={styles.postHeader}>
                <LinearGradient
                  colors={AVATAR_GRADIENTS[p.avatar]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatar}
                />
                <View style={styles.postUser}>
                  <Text style={styles.postUserName}>{p.user}</Text>
                  <Text style={styles.postUserHandle}>
                    {p.handle} · {p.time}
                  </Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{p.type}</Text>
                </View>
              </View>

              {/* Visual */}
              <View style={styles.visual}>
                {p.bottles ? (
                  <View style={styles.bottleRow}>
                    {(['amber', 'clear', 'green', 'amber', 'red'] as BottleTone[]).map((tn, j) => (
                      <View key={j} style={styles.bottleSlot}>
                        <Bottle tone={tn} height={70 + (j % 2 === 0 ? 8 : 0)} level={0.7} />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.singleBottle}>
                    <CocktailGlass style="rocks" tone={fallbackTone(p.tone ?? 'amber')} size="md" />
                  </View>
                )}
              </View>

              {/* Body */}
              <Text style={styles.postTitle}>{p.title}</Text>
              <Text style={styles.postBody}>{p.body}</Text>

              {/* Actions */}
              <View style={styles.actions}>
                <View style={styles.actionItem}>
                  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
                    <Path
                      d="M7 12s-5-3-5-7a3 3 0 015-2 3 3 0 015 2c0 4-5 7-5 7z"
                      stroke={colors.paper[400]}
                      strokeWidth={1.6}
                    />
                  </Svg>
                  <Text style={styles.actionText}>{p.likes}</Text>
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
                  <Text style={styles.actionText}>{p.comments}</Text>
                </View>
                <Text style={styles.actionMore}>
                  {p.type === 'RECIPE' ? '내 바로 저장 →' : '자세히 →'}
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
  filterRow: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
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
  bottleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: -4,
  },
  bottleSlot: {
    marginRight: -4,
  },
  singleBottle: {
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
    gap: spacing[1] + 1, // 5
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

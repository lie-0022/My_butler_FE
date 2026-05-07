import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, BackBtn, Eyebrow, IconBtn } from '@/components/ui';
import { Bottle } from '@/components/illustrations';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';

interface Comment {
  user: string;
  time: string;
  body: string;
}

const COMMENTS: Comment[] = [
  { user: '혜진', time: '1h', body: '메즈칼 종류는 어떤 걸 쓰셨어요? Del Maguey?' },
  { user: '도윤', time: '45m', body: '오늘 저녁에 바로 만들어봐야겠어요 🥃' },
  { user: '수아', time: '20m', body: '스모크 향이 진짜 잘 살겠네요.' },
];

const TAGS = ['#메즈칼', '#위스키', '#홈바', '#클래식'];

export default function PostScreen() {
  const { id: _id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="post-detail-screen">
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} />}
        title="게시물"
        serif={false}
        right={
          <IconBtn onPress={() => router.push('/_debug')} testID="post-bookmark-button">
            <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <Path
                d="M3 2h8v10l-4-2.5L3 12V2z"
                stroke={colors.ink[900]}
                strokeWidth={1.7}
                strokeLinejoin="round"
              />
            </Svg>
          </IconBtn>
        }
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 56 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Author */}
          <View style={styles.authorRow}>
            <LinearGradient
              colors={['#e4a83c', '#6d4410']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            />
            <View style={styles.authorMeta}>
              <Text style={styles.authorName}>바텐더 김</Text>
              <Text style={styles.authorHandle}>@bartender_kim · 서울 · 2시간 전</Text>
            </View>
            <Pressable style={styles.followBtn}>
              <Text style={styles.followText}>팔로우</Text>
            </Pressable>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            {/* TODO: 작업 17 CocktailGlass로 교체 */}
            <Bottle tone="amber" height={170} />
            <View style={styles.recipeBadge}>
              <Text style={styles.recipeBadgeText}>RECIPE</Text>
            </View>
          </View>

          <Text style={styles.tag}>SMOKY · AGAVE</Text>
          <Text style={styles.title}>Oaxacan Old Fashioned</Text>
          <Text style={styles.body}>
            전통 Old Fashioned에 메즈칼을 더해 스모키하면서도 깊이 있는 플레이버를 만들었습니다.
            큰 얼음 한 덩어리와 오렌지 껍질이 핵심이에요.
          </Text>

          {/* Tags */}
          <View style={styles.tagRow}>
            {TAGS.map((t) => (
              <View key={t} style={styles.tagPill}>
                <Text style={styles.tagPillText}>{t}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              style={styles.action}
              onPress={() => setLiked((v) => !v)}
              testID="post-like-button"
            >
              <Svg width={18} height={18} viewBox="0 0 18 18" fill={liked ? colors.semantic.danger : 'none'}>
                <Path
                  d="M9 15.5s-6-4-6-8.5a4 4 0 016-2 4 4 0 016 2c0 4.5-6 8.5-6 8.5z"
                  stroke={colors.semantic.danger}
                  strokeWidth={1.6}
                />
              </Svg>
              <Text style={[styles.actionText, { color: colors.semantic.danger }]}>
                {liked ? 125 : 124}
              </Text>
            </Pressable>
            <Pressable style={styles.action}>
              <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <Path
                  d="M3 4h12v9H6l-3 3V4z"
                  stroke={colors.ink[900]}
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.actionText}>18</Text>
            </Pressable>
          </View>

          {/* Comments */}
          <View style={styles.commentsHeader}>
            <Eyebrow>COMMENTS · {COMMENTS.length}</Eyebrow>
          </View>
          <View style={styles.comments}>
            {COMMENTS.map((c, i) => (
              <View key={i} style={styles.comment}>
                <LinearGradient
                  colors={['#b8a384', '#6a5333']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentBody}>
                  <Text style={styles.commentMeta}>
                    <Text style={styles.commentUser}>{c.user}</Text>{' '}
                    <Text style={styles.commentTime}>{c.time}</Text>
                  </Text>
                  <Text style={styles.commentText}>{c.body}</Text>
                  <Text style={styles.commentReply}>답글  ♡ 3</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Comment input */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + spacing[3] }]}>
          <LinearGradient
            colors={['#e4a83c', '#6d4410']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inputAvatar}
          />
          <TextInput
            placeholder="댓글 남기기..."
            placeholderTextColor={colors.paper[400]}
            value={comment}
            onChangeText={setComment}
            style={styles.input}
            testID="post-comment-input"
          />
          <Pressable
            style={[styles.sendBtn, !comment.trim() && styles.sendBtnDisabled]}
            disabled={!comment.trim()}
            onPress={() => setComment('')}
            testID="post-comment-submit"
          >
            <Text style={styles.sendBtnText}>올리기</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper[50] },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[6],
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  authorMeta: { flex: 1 },
  authorName: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  authorHandle: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
  },
  followBtn: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radius.pill,
    backgroundColor: colors.ink[900],
  },
  followText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
    color: colors.paper[50],
  },
  hero: {
    backgroundColor: colors.ink[900],
    borderRadius: radius.lg,
    paddingVertical: spacing[7],
    alignItems: 'center',
    marginBottom: spacing[4],
    position: 'relative',
  },
  recipeBadge: {
    position: 'absolute',
    top: spacing[3],
    right: spacing[3],
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: radius.pill,
  },
  recipeBadgeText: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.amber[200],
    letterSpacing: 1.5,
  },
  tag: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.amber[500],
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamily.serif.bold,
    fontSize: 26,
    color: colors.ink[900],
    letterSpacing: -0.5,
    lineHeight: 26 * 1.1,
    marginTop: spacing[2],
  },
  body: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.ink[800],
    marginTop: spacing[3],
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  tagPill: {
    paddingVertical: 5,
    paddingHorizontal: spacing[3],
    backgroundColor: colors.amber[50],
    borderColor: 'rgba(200,162,101,0.25)',
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  tagPillText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.amber[600],
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing[6],
    paddingVertical: spacing[3],
    marginTop: spacing[3],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.paper[200],
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  actionText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  commentsHeader: { marginTop: spacing[4] },
  comments: { marginTop: spacing[3], gap: spacing[3] },
  comment: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  commentAvatar: { width: 32, height: 32, borderRadius: 16 },
  commentBody: { flex: 1 },
  commentMeta: { fontFamily: fontFamily.sans.regular, fontSize: fontSize.sm },
  commentUser: {
    fontFamily: fontFamily.serif.semibold,
    color: colors.ink[900],
  },
  commentTime: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
  },
  commentText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.ink[800],
    marginTop: spacing[1],
    lineHeight: fontSize.md * lineHeight.normal,
  },
  commentReply: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    marginTop: spacing[1],
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    backgroundColor: colors.paper[50],
    borderTopWidth: 1,
    borderTopColor: colors.paper[200],
  },
  inputAvatar: { width: 32, height: 32, borderRadius: 16 },
  input: {
    flex: 1,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: colors.paper[200],
    borderRadius: radius.pill,
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.ink[900],
    minWidth: 0,
  },
  sendBtn: {
    paddingVertical: spacing[2] + 1,
    paddingHorizontal: spacing[4],
    backgroundColor: colors.ink[900],
    borderRadius: radius.pill,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.amber[200],
  },
});

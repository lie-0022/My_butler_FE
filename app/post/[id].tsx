import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { AppBar, BackBtn, Eyebrow, IconBtn } from '@/components/ui';
import { CocktailGlass } from '@/components/illustrations';
import { postApi } from '@/api/post';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import { parseApiError } from '@/utils/parseApiError';
import type { CommentResponse, PostDetailResponse } from '@/types/post';

const timeAgo = (iso: string): string => {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.round(diffMs / 60000);
  if (m < 1) return '방금';
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
};

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [detail, setDetail] = useState<PostDetailResponse | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [kbVisible, setKbVisible] = useState(false);

  // 키보드가 떠 있을 때는 인풋바 paddingBottom을 줄여 키보드와 사이의 빈 공간 제거.
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvt, () => setKbVisible(true));
    const hide = Keyboard.addListener(hideEvt, () => setKbVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const inputBarPaddingBottom = kbVisible ? spacing[3] : insets.bottom + spacing[3];

  const numericId = Number(id);

  const fetchDetail = useCallback(async () => {
    if (!BACKEND_ENABLED || !Number.isFinite(numericId)) return;
    try {
      const res = await postApi.getById(numericId);
      setDetail(res.data);
      setComments(res.data.comments.content);
    } catch (err) {
      Alert.alert('게시물 불러오기 실패', parseApiError(err).message);
    }
  }, [numericId]);

  useEffect(() => {
    void fetchDetail().finally(() => setLoading(false));
  }, [fetchDetail]);

  const toggleLike = async () => {
    if (!detail) return;
    try {
      const fn = detail.post.isLiked ? postApi.unlike : postApi.like;
      const res = await fn(detail.post.id);
      setDetail({
        ...detail,
        post: {
          ...detail.post,
          isLiked: res.data.isLiked,
          likeCount: res.data.likeCount,
        },
      });
    } catch (err) {
      Alert.alert('처리 실패', parseApiError(err).message);
    }
  };

  const submitComment = async () => {
    if (!detail || !comment.trim() || sending) return;
    setSending(true);
    try {
      await postApi.addComment(detail.post.id, { content: comment.trim() });
      setComment('');
      Keyboard.dismiss();
      // 새 댓글 반영을 위해 detail 재조회
      await fetchDetail();
    } catch (err) {
      Alert.alert('댓글 등록 실패', parseApiError(err).message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.fullCenter, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.amber[500]} />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={[styles.root, styles.fullCenter, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>게시물을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const post = detail.post;

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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              <Text style={styles.authorName}>{post.author.username}</Text>
              <Text style={styles.authorHandle}>
                @{post.author.username} · {timeAgo(post.createdAt)}
              </Text>
            </View>
            {post.isArGenerated ? (
              <View style={styles.followBtn}>
                <Text style={styles.followText}>AR</Text>
              </View>
            ) : null}
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <CocktailGlass style="rocks" tone="amber" size="lg" />
            {post.recipeTag ? (
              <View style={styles.recipeBadge}>
                <Text style={styles.recipeBadgeText}>RECIPE</Text>
              </View>
            ) : null}
          </View>

          {post.recipeTag ? (
            <>
              <Text style={styles.tag}>{post.recipeTag.recipeName}</Text>
            </>
          ) : null}
          {post.caption ? <Text style={styles.body}>{post.caption}</Text> : null}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable style={styles.action} onPress={toggleLike} testID="post-like-button">
              <Svg
                width={18}
                height={18}
                viewBox="0 0 18 18"
                fill={post.isLiked ? colors.semantic.danger : 'none'}
              >
                <Path
                  d="M9 15.5s-6-4-6-8.5a4 4 0 016-2 4 4 0 016 2c0 4.5-6 8.5-6 8.5z"
                  stroke={colors.semantic.danger}
                  strokeWidth={1.6}
                />
              </Svg>
              <Text style={[styles.actionText, { color: colors.semantic.danger }]}>
                {post.likeCount}
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
              <Text style={styles.actionText}>{post.commentCount}</Text>
            </Pressable>
          </View>

          {/* Comments */}
          <View style={styles.commentsHeader}>
            <Eyebrow>COMMENTS · {comments.length}</Eyebrow>
          </View>
          <View style={styles.comments}>
            {comments.map((c) => (
              <View key={c.id} style={styles.comment}>
                <LinearGradient
                  colors={['#b8a384', '#6a5333']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.commentAvatar}
                />
                <View style={styles.commentBody}>
                  <Text style={styles.commentMeta}>
                    <Text style={styles.commentUser}>{c.author.username}</Text>{' '}
                    <Text style={styles.commentTime}>{timeAgo(c.createdAt)}</Text>
                  </Text>
                  <Text style={styles.commentText}>{c.content}</Text>
                  {c.replyCount > 0 ? (
                    <Text style={styles.commentReply}>답글 {c.replyCount}</Text>
                  ) : null}
                </View>
              </View>
            ))}
            {comments.length === 0 ? (
              <Text style={styles.emptyComment}>첫 댓글을 남겨보세요.</Text>
            ) : null}
          </View>
        </ScrollView>

        {/* Comment input — KAV가 키보드 위로 밀어줌 */}
        <View style={[styles.inputBar, { paddingBottom: inputBarPaddingBottom }]}>
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
            style={[styles.sendBtn, (!comment.trim() || sending) && styles.sendBtnDisabled]}
            disabled={!comment.trim() || sending}
            onPress={submitComment}
            testID="post-comment-submit"
          >
            <Text style={styles.sendBtnText}>{sending ? '...' : '올리기'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper[50] },
  fullCenter: { alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
  },
  emptyComment: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
    paddingVertical: spacing[4],
    textAlign: 'center',
  },
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

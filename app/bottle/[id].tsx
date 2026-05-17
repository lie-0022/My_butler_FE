import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, BackBtn, CTA, Eyebrow, IconBtn } from '@/components/ui';
import { Bottle } from '@/components/illustrations';
import { inventoryApi } from '@/api/inventory';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';
import { BACKEND_ENABLED } from '@/utils/backend';
import {
  CATEGORY_LABEL,
  CATEGORY_TO_BOTTLE_TONE,
  LEVEL_LABEL,
  LEVEL_TO_RATIO,
} from '@/utils/domainMappers';
import type { InventoryItemDetailResponse, LevelStatus } from '@/types/inventory';
import { parseApiError } from '@/utils/parseApiError';

/** "한 잔" 버튼: 다음 단계로 잔량 감소 (FULL→HALF→LOW, LOW는 LOW 유지) */
const nextLowerLevel: Record<LevelStatus, LevelStatus> = {
  FULL: 'HALF',
  HALF: 'LOW',
  LOW: 'LOW',
};

const formatDate = (iso?: string | null) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function BottleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<InventoryItemDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!BACKEND_ENABLED || !id) return;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    try {
      const res = await inventoryApi.getById(numericId);
      setItem(res.data);
    } catch (err) {
      Alert.alert('불러오기 실패', parseApiError(err).message);
    }
  }, [id]);

  useEffect(() => {
    void fetchDetail().finally(() => setLoading(false));
  }, [fetchDetail]);

  const drink = async () => {
    if (!item || updating) return;
    const next = nextLowerLevel[item.levelStatus];
    if (next === item.levelStatus) {
      Alert.alert('남은 양 없음', '이미 가장 낮은 단계입니다.');
      return;
    }
    setUpdating(true);
    try {
      const res = await inventoryApi.updateLevel(item.id, { levelStatus: next });
      setItem(res.data);
    } catch (err) {
      Alert.alert('업데이트 실패', parseApiError(err).message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.amber[500]} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.root, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>보틀 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const tone = CATEGORY_TO_BOTTLE_TONE[item.category];
  const level = LEVEL_TO_RATIO[item.levelStatus];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="bottle-detail-screen">
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} />}
        title=""
        right={
          <IconBtn onPress={() => router.push('/_debug')} testID="bottle-detail-edit-button">
            <Svg width={16} height={16} viewBox="0 0 16 16">
              <Circle cx={3} cy={8} r={1.3} fill={colors.ink[900]} />
              <Circle cx={8} cy={8} r={1.3} fill={colors.ink[900]} />
              <Circle cx={13} cy={8} r={1.3} fill={colors.ink[900]} />
            </Svg>
          </IconBtn>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Bottle tone={tone} level={level} height={230} label={item.name.slice(0, 12)} />
        </View>

        <View style={styles.body}>
          {/* 원산지가 있으면 우선 표시. 없으면 카테고리 라벨로 폴백. */}
          <Text style={styles.origin}>{item.origin ?? CATEGORY_LABEL[item.category]}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.cat}>
            {CATEGORY_LABEL[item.category]} · 잔량 {LEVEL_LABEL[item.levelStatus]}
            {item.isOpened ? ' · 개봉됨' : ''}
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCol, styles.statColBorder]}>
              <Text style={styles.statK}>남은 양</Text>
              <Text style={styles.statV}>{LEVEL_LABEL[item.levelStatus]}</Text>
              <Text style={styles.statSub}>{Math.round(level * 100)}%</Text>
            </View>
            <View style={[styles.statCol, styles.statColBorder]}>
              <Text style={styles.statK}>용량</Text>
              <Text style={styles.statV}>{item.capacityMl ?? '—'}</Text>
              <Text style={styles.statSub}>ml</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statK}>ABV</Text>
              <Text style={styles.statV}>{item.abv ?? '—'}</Text>
              <Text style={styles.statSub}>alcohol</Text>
            </View>
          </View>

          {/* 테이스팅 노트 (BE PR #20). "," 또는 "·"로 split해 칩 표시. */}
          {item.tastingNotes ? (
            <View style={styles.section}>
              <Eyebrow>TASTING NOTES</Eyebrow>
              <View style={styles.notesRow}>
                {item.tastingNotes
                  .split(/[,·]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((note) => (
                    <View key={note} style={styles.notePill}>
                      <Text style={styles.notePillText}>{note}</Text>
                    </View>
                  ))}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Eyebrow>TIMELINE</Eyebrow>
            <View style={styles.timeline}>
              <TimelineRow
                label="구매"
                date={item.purchasedAt ? formatDate(item.purchasedAt) : '—'}
                muted={!item.purchasedAt}
              />
              <TimelineRow label="등록" date={formatDate(item.createdAt)} />
              <TimelineRow label="개봉" date={formatDate(item.openedAt)} muted={!item.openedAt} />
              <TimelineRow
                label="유통기한"
                date={item.dDay != null ? `D-${item.dDay}` : '여유'}
                muted={item.expiryStatus === 'UNOPENED'}
              />
              {item.purchasePlace ? (
                <TimelineRow label="구매처" date={item.purchasePlace} />
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing[4] }]}>
        <Pressable
          onPress={drink}
          disabled={updating}
          style={({ pressed }) => [
            styles.secondaryBtn,
            (pressed || updating) && styles.btnPressed,
          ]}
          testID="bottle-detail-drink-button"
        >
          <Text style={styles.secondaryBtnText}>{updating ? '업데이트 중' : '한 잔'}</Text>
        </Pressable>
        <View style={styles.actionCtaWrap}>
          <CTA
            variant="amber"
            onPress={() => router.push('/(tabs)/recipes')}
            testID="bottle-detail-make-button"
          >
            이 술로 만들기
          </CTA>
        </View>
      </View>
    </View>
  );
}

function TimelineRow({
  label,
  date,
  muted = false,
}: {
  label: string;
  date: string;
  muted?: boolean;
}) {
  return (
    <View style={timelineStyles.row}>
      <View
        style={[
          timelineStyles.dot,
          { backgroundColor: muted ? colors.paper[300] : colors.amber[400] },
        ]}
      />
      <Text style={[timelineStyles.label, muted && timelineStyles.muted]}>{label}</Text>
      <Text
        style={[
          timelineStyles.date,
          muted && timelineStyles.muted,
          muted && { fontStyle: 'italic' },
        ]}
      >
        {date}
      </Text>
    </View>
  );
}

const timelineStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.ink[900],
    width: 80,
  },
  date: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  muted: {
    color: colors.paper[400],
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper[50] },
  center: { alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
  },
  scroll: { paddingBottom: spacing[6] },
  heroCard: {
    marginHorizontal: spacing[5],
    paddingVertical: spacing[5],
    backgroundColor: colors.paper[100],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.25)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 260,
  },
  body: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
  },
  origin: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.amber[500],
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: spacing[2],
  },
  name: {
    fontFamily: fontFamily.serif.bold,
    fontSize: 32,
    color: colors.ink[900],
    letterSpacing: -0.6,
    lineHeight: 32 * 1.1,
  },
  cat: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    marginTop: spacing[2],
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing[5],
    paddingVertical: spacing[5],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.paper[300],
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing[1],
  },
  statColBorder: {
    borderRightWidth: 1,
    borderColor: colors.paper[300],
  },
  statK: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.paper[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statV: {
    fontFamily: fontFamily.serif.bold,
    fontSize: 26,
    color: colors.ink[900],
    letterSpacing: -0.5,
    marginTop: spacing[1],
  },
  statSub: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xxs,
    color: colors.paper[400],
    marginTop: spacing[1],
  },
  section: { marginTop: spacing[5] },
  notesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[3],
  },
  notePill: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    backgroundColor: colors.amber[50],
    borderColor: 'rgba(200,162,101,0.35)',
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  notePillText: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.xs,
    color: colors.amber[600],
  },
  timeline: { marginTop: spacing[3] },
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
  secondaryBtn: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: colors.paper[300],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: fontFamily.sans.medium,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  actionCtaWrap: { flex: 1 },
  btnPressed: { opacity: 0.85 },
});

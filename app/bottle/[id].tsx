import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, BackBtn, CTA, Eyebrow, IconBtn } from '@/components/ui';
import { Bottle, type BottleTone } from '@/components/illustrations';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';

interface BottleDetail {
  id: string;
  name: string;
  origin: string;
  category: string;
  tone: BottleTone;
  level: number;
  volume: number;
  abv: number;
  label: string;
  notes: string[];
  purchased: string;
  opened: string;
}

const MOCK: BottleDetail = {
  id: 'test-id',
  name: 'Lagavulin 16',
  origin: 'Islay · Scotland',
  category: '싱글몰트 위스키',
  tone: 'amber',
  level: 0.42,
  volume: 700,
  abv: 43,
  label: 'LAGAVULIN',
  notes: ['스모키', '피트', '바닐라', '해풍'],
  purchased: '2025년 11월 3일',
  opened: '2025년 12월 18일',
};

export default function BottleDetailScreen() {
  const { id: _id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<BottleDetail>(MOCK);

  const drink = () => {
    setItem((prev) => ({ ...prev, level: Math.max(0, prev.level - 0.1) }));
  };

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
        {/* Hero card with Bottle */}
        <View style={styles.heroCard}>
          <Bottle tone={item.tone} level={item.level} height={230} label={item.label} />
        </View>

        <View style={styles.body}>
          <Text style={styles.origin}>{item.origin}</Text>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.cat}>{item.category}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              {
                k: '남은 양',
                v: `${Math.round(item.level * 100)}%`,
                sub: `${Math.round(item.volume * item.level)}ml`,
              },
              { k: '용량', v: `${item.volume}`, sub: 'ml' },
              { k: 'ABV', v: `${item.abv}`, sub: 'alcohol' },
            ].map((s, i) => (
              <View key={s.k} style={[styles.statCol, i < 2 && styles.statColBorder]}>
                <Text style={styles.statK}>{s.k}</Text>
                <Text style={styles.statV}>{s.v}</Text>
                <Text style={styles.statSub}>{s.sub}</Text>
              </View>
            ))}
          </View>

          {/* Tasting notes */}
          <View style={styles.section}>
            <Eyebrow>TASTING NOTES</Eyebrow>
            <View style={styles.notesRow}>
              {item.notes.map((n) => (
                <View key={n} style={styles.notePill}>
                  <Text style={styles.notePillText}>{n}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Timeline */}
          <View style={styles.section}>
            <Eyebrow>TIMELINE</Eyebrow>
            <View style={styles.timeline}>
              <TimelineRow label="구매" date={item.purchased} />
              <TimelineRow label="개봉" date={item.opened} />
              <TimelineRow label="예상 완료" date="약 6주 후" muted />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing[4] }]}>
        <Pressable
          onPress={drink}
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
          testID="bottle-detail-drink-button"
        >
          <Text style={styles.secondaryBtnText}>한 잔</Text>
        </Pressable>
        <View style={styles.actionCtaWrap}>
          <CTA
            variant="amber"
            onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: 'test-id' } })}
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

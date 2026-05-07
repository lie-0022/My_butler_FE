import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppBar, BackBtn, CTA, Eyebrow, IconBtn } from '@/components/ui';
import { CocktailGlass, IngChip, type IngChipType } from '@/components/illustrations';
import { colors, fontFamily, fontSize, lineHeight, radius, spacing } from '@/constants';

interface Ingredient {
  name: string;
  amt: string;
  unit: string;
  have: boolean;
  kind: IngChipType;
  note?: string;
}

interface Step {
  h: string;
  d: string;
}

const RECIPE = {
  name: 'Smoky Old Fashioned',
  sub: 'a warm pour for cold nights',
  abv: 28,
  time: 3,
  difficulty: '초급',
  story:
    '클래식 Old Fashioned에 피티한 싱글몰트 한 방울을 더하면, 잔 위로 모닥불 향이 피어오릅니다.',
  ingredients: [
    { name: 'Bourbon Whisky', amt: '60', unit: 'ml', have: true, kind: 'lemon' },
    { name: 'Lagavulin 16', amt: '5', unit: 'ml', have: true, kind: 'lemon', note: 'float' },
    { name: 'Demerara Syrup', amt: '7.5', unit: 'ml', have: true, kind: 'sugar' },
    { name: 'Angostura Bitters', amt: '2', unit: 'dashes', have: true, kind: 'cherry' },
    { name: 'Orange Peel', amt: '1', unit: '', have: true, kind: 'orange' },
  ] as Ingredient[],
  steps: [
    { h: '셰이킹 대신 스터링', d: '믹싱 글라스에 얼음과 시럽, 비터스를 넣고 스터' },
    { h: '버번을 더하기', d: '버번 60ml를 추가 후 30초간 차갑게 저어주세요' },
    { h: '로우 글라스로', d: '큰 얼음 한 덩이가 놓인 로우 글라스에 따르기' },
    { h: '스모크 플로트', d: '라가불린 5ml를 스푼 위로 천천히 띄우기' },
    { h: '오렌지 오일', d: '껍질을 짜 향을 낸 뒤 잔에 걸치기' },
  ] as Step[],
};

export default function RecipeDetailScreen() {
  const { id: _id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [favorited, setFavorited] = useState(false);

  const missingCount = RECIPE.ingredients.filter((i) => !i.have).length;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="recipe-detail-screen">
      <StatusBar style="dark" />
      <AppBar
        left={<BackBtn onPress={() => router.back()} />}
        title=""
        right={
          <IconBtn onPress={() => setFavorited((v) => !v)} testID="recipe-detail-favorite-button">
            <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
              <Path
                d="M3 2h8v10l-4-2.5L3 12V2z"
                stroke={colors.ink[900]}
                strokeWidth={1.7}
                strokeLinejoin="round"
                fill={favorited ? colors.amber[300] : 'none'}
              />
            </Svg>
          </IconBtn>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>CLASSIC · REIMAGINED</Text>
          <Text style={styles.title}>
            Smoky{'\n'}
            <Text style={styles.titleAccent}>Old Fashioned</Text>
          </Text>
          <Text style={styles.subtitle}>{RECIPE.sub}</Text>
        </View>

        <View style={styles.glassCard}>
          <CocktailGlass style="rocks" tone="amber" size="lg" />
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          {[
            { k: 'ABV', v: `${RECIPE.abv}%` },
            { k: 'TIME', v: `${RECIPE.time} min` },
            { k: 'LEVEL', v: RECIPE.difficulty },
          ].map((s, i) => (
            <View key={s.k} style={[styles.statCol, i < 2 && styles.statColBorder]}>
              <Text style={styles.statK}>{s.k}</Text>
              <Text style={styles.statV}>{s.v}</Text>
            </View>
          ))}
        </View>

        <View style={styles.body}>
          <Text style={styles.story}>&ldquo;{RECIPE.story}&rdquo;</Text>

          {missingCount > 0 ? (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: '/recipe/[id]/missing',
                  params: { id: 'test-id' },
                })
              }
              testID="recipe-detail-missing-link"
              style={styles.missingLink}
            >
              <Text style={styles.missingLinkText}>재료 {missingCount}개 부족 · 자세히 →</Text>
            </Pressable>
          ) : null}

          <Eyebrow>INGREDIENTS · 1 SERVE</Eyebrow>
          <View style={styles.ingList}>
            {RECIPE.ingredients.map((ing, i) => (
              <View
                key={ing.name}
                style={[styles.ingRow, i < RECIPE.ingredients.length - 1 && styles.ingRowBorder]}
              >
                <IngChip type={ing.kind} size="sm" />
                <View style={styles.ingMeta}>
                  <Text style={styles.ingName}>
                    {ing.name}
                    {ing.note ? (
                      <Text style={styles.ingNote}> {ing.note.toUpperCase()}</Text>
                    ) : null}
                  </Text>
                </View>
                <Text style={styles.ingAmt}>
                  {ing.amt}
                  <Text style={styles.ingUnit}> {ing.unit}</Text>
                </Text>
                <View
                  style={[
                    styles.haveDot,
                    { backgroundColor: ing.have ? colors.semanticBg.ok : colors.semanticBg.danger },
                  ]}
                >
                  {ing.have ? (
                    <Svg width={10} height={10} viewBox="0 0 10 10">
                      <Path
                        d="M2 5l2 2 4-4"
                        stroke={colors.semantic.ok}
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </Svg>
                  ) : (
                    <Text style={styles.haveDotMiss}>!</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.methodSection}>
            <Eyebrow>METHOD</Eyebrow>
            <View style={styles.steps}>
              {RECIPE.steps.map((s, i) => (
                <View key={i} style={styles.step}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{String(i + 1).padStart(2, '0')}</Text>
                  </View>
                  <View style={styles.stepBody}>
                    <Text style={styles.stepHeading}>{s.h}</Text>
                    <Text style={styles.stepDesc}>{s.d}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.actionBar, { paddingBottom: insets.bottom + spacing[4] }]}>
        <Pressable style={styles.heartBtn} onPress={() => setFavorited((v) => !v)}>
          <Text style={styles.heartText}>{favorited ? '♥' : '♡'}</Text>
        </Pressable>
        <View style={styles.actionCtaWrap}>
          <CTA
            variant="amber"
            onPress={() => router.push('/_debug')}
            testID="recipe-detail-made-button"
          >
            만드는 중 · 가이드 시작
          </CTA>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper[50] },
  scroll: { paddingBottom: spacing[6] },
  header: { paddingHorizontal: spacing[6], marginBottom: spacing[4] },
  eyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.amber[500],
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h1,
    color: colors.ink[900],
    letterSpacing: -0.6,
    lineHeight: fontSize.h1 * 1.02,
    marginTop: spacing[2],
  },
  titleAccent: {
    fontFamily: fontFamily.serif.regular,
    color: colors.amber[500],
    fontStyle: 'italic',
  },
  subtitle: {
    fontFamily: fontFamily.serif.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    marginTop: spacing[2],
    fontStyle: 'italic',
  },
  glassCard: {
    marginHorizontal: spacing[5],
    marginBottom: spacing[5],
    paddingVertical: spacing[5],
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.25)',
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginHorizontal: spacing[6],
    marginBottom: spacing[6],
    paddingVertical: spacing[3],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.paper[300],
  },
  statCol: { flex: 1, alignItems: 'center' },
  statColBorder: { borderRightWidth: 1, borderColor: colors.paper[300] },
  statK: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.paper[400],
    letterSpacing: 1.8,
  },
  statV: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.xl,
    color: colors.ink[900],
    marginTop: spacing[1],
  },
  body: { paddingHorizontal: spacing[6] },
  story: {
    fontFamily: fontFamily.serif.regular,
    fontSize: fontSize.md + 2,
    color: colors.ink[800],
    lineHeight: (fontSize.md + 2) * lineHeight.normal,
    fontStyle: 'italic',
    marginBottom: spacing[6],
  },
  missingLink: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.semanticBg.danger,
    borderRadius: radius.md,
    marginBottom: spacing[5],
    alignItems: 'center',
  },
  missingLinkText: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.sm,
    color: colors.semantic.danger,
  },
  ingList: { marginTop: spacing[3], marginBottom: spacing[7] },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  ingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.paper[200],
  },
  ingChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.amber[100],
  },
  ingMeta: { flex: 1, minWidth: 0 },
  ingName: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
  },
  ingNote: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xxs,
    color: colors.amber[500],
    letterSpacing: 1.5,
  },
  ingAmt: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.md + 2,
    color: colors.ink[900],
    letterSpacing: -0.16,
  },
  ingUnit: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    fontWeight: '500',
  },
  haveDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  haveDotMiss: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.xs,
    color: colors.semantic.danger,
  },
  methodSection: { marginBottom: spacing[5] },
  steps: { marginTop: spacing[3], gap: spacing[4] },
  step: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ink[900],
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.md,
    color: colors.amber[200],
  },
  stepBody: { flex: 1, paddingTop: spacing[1] },
  stepHeading: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.md,
    color: colors.ink[900],
    letterSpacing: -0.16,
  },
  stepDesc: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.sm,
    color: colors.paper[400],
    marginTop: spacing[1],
    lineHeight: fontSize.sm * lineHeight.normal,
  },
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
  heartBtn: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: colors.paper[300],
    borderRadius: radius.md,
  },
  heartText: {
    fontSize: fontSize.lg,
    color: colors.semantic.danger,
  },
  actionCtaWrap: { flex: 1 },
});

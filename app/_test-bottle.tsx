/**
 * TEMP: Bottle / BottleGroup 검증용 테스트 화면.
 * 작업 16-3: 명세 정밀 보정 검증.
 * URL: http://localhost:8081/_test-bottle
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  Bottle,
  BottleGroup,
  type BottleSize,
  type BottleTone,
} from '@/components/illustrations';
import { colors, fontFamily, fontSize, spacing } from '@/constants';

const TONES: BottleTone[] = ['amber', 'clear', 'red', 'green'];
const SIZES: BottleSize[] = ['sm', 'md', 'lg', 'xl'];

export default function TestBottleScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing[6] },
        ]}
      >
        <Text style={styles.title}>Bottle 명세 검증 (작업 16-3)</Text>

        <Section label="size × tone 격자 (각 size별 4 tone, label=TEST)">
          {SIZES.map((s) => (
            <Row key={s}>
              {TONES.map((t) => (
                <Bottle key={`${s}-${t}`} size={s} tone={t} label="TEST" />
              ))}
            </Row>
          ))}
        </Section>

        <Section label="level (amber, lg): 1.0 / 0.7 / 0.3 / 0">
          <Row>
            <Bottle size="lg" tone="amber" level={1} label="100%" />
            <Bottle size="lg" tone="amber" level={0.7} label="70%" />
            <Bottle size="lg" tone="amber" level={0.3} label="30%" />
            <Bottle size="lg" tone="amber" level={0} label="EMPTY" />
          </Row>
        </Section>

        <Section label="BottleGroup (lg) — 작업 12-2-fix에서 명세 좌표로 재배치 예정">
          <View style={styles.groupWrap}>
            <BottleGroup
              containerSize="lg"
              bottles={[
                { tone: 'green', label: 'AMARO', size: 'sm' },
                { tone: 'clear', label: 'DRY GIN', size: 'md' },
                { tone: 'amber', label: 'RESERVE', size: 'md' },
              ]}
            />
          </View>
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper[50],
  },
  scroll: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    gap: spacing[6],
  },
  title: {
    fontFamily: fontFamily.serif.semibold,
    fontSize: fontSize.xl,
    color: colors.ink[900],
    marginBottom: spacing[4],
  },
  section: {
    gap: spacing[3],
  },
  sectionLabel: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing[3],
    flexWrap: 'wrap',
  },
  groupWrap: {
    height: 280,
    backgroundColor: colors.ink[900],
    borderRadius: 12,
    overflow: 'hidden',
  },
});

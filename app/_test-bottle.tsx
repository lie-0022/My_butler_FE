/**
 * TEMP: Bottle / BottleGroup 검증용 테스트 화면.
 * 작업 16-2 완료 후 삭제 예정 (이 파일 + _debug.tsx의 TEST 그룹 항목).
 * URL: http://localhost:8081/_test-bottle
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bottle, BottleGroup } from '@/components/illustrations';
import { colors, fontFamily, fontSize, spacing } from '@/constants';

export default function TestBottleScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing[6] }]}
      >
        <Text style={styles.title}>Bottle 테스트</Text>

        <Section label="tone × md (amber / clear / red / green)">
          <Row>
            <Bottle size="md" tone="amber" label="AMBER" />
            <Bottle size="md" tone="clear" label="CLEAR" />
            <Bottle size="md" tone="red" label="RED" />
            <Bottle size="md" tone="green" label="GREEN" />
          </Row>
        </Section>

        <Section label="level (amber, md): 1.0 / 0.6 / 0.3 / 0">
          <Row>
            <Bottle size="md" tone="amber" level={1} />
            <Bottle size="md" tone="amber" level={0.6} />
            <Bottle size="md" tone="amber" level={0.3} />
            <Bottle size="md" tone="amber" level={0} />
          </Row>
        </Section>

        <Section label="size sm/md/lg (amber)">
          <Row>
            <Bottle size="sm" tone="amber" label="LAGAVULIN" />
            <Bottle size="md" tone="amber" label="BULLEIT" />
          </Row>
        </Section>

        <Section label="BottleGroup (lg) — login Front Door 구성">
          <View style={styles.groupWrap}>
            <BottleGroup
              containerSize="lg"
              bottles={[
                { tone: 'green', label: 'AMARO', size: 'sm' },
                { tone: 'clear', label: 'DRY GIN', size: 'md' },
                { tone: 'amber', label: 'RESERVE', size: 'lg' },
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
    gap: spacing[4],
    flexWrap: 'wrap',
  },
  groupWrap: {
    height: 340,
    backgroundColor: colors.ink[900],
    borderRadius: 12,
    overflow: 'hidden',
  },
});

/**
 * TEMP: 작업 16-1 검증용 테스트 화면.
 * 작업 16-2 종료 시 삭제 예정.
 * URL: http://localhost:8081/_test-bottle
 */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bottle } from '@/components/illustrations';
import { colors, fontFamily, fontSize, spacing } from '@/constants';

export default function TestBottleScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing[6] }]}
      >
        <Text style={styles.title}>Bottle 테스트 — amber tone</Text>

        <Section label="size: sm (60×120)">
          <Row>
            <Bottle size="sm" />
            <Bottle size="sm" label="LAGAVULIN" />
          </Row>
        </Section>

        <Section label="size: md (90×180)">
          <Row>
            <Bottle size="md" />
            <Bottle size="md" label="BULLEIT" />
          </Row>
        </Section>

        <Section label="size: lg (160×320)">
          <Row>
            <Bottle size="lg" label="LAGAVULIN" />
          </Row>
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
    gap: spacing[5],
  },
});

import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Eyebrow } from '@/components/ui';
import { colors, fontFamily, fontSize, lineHeight, spacing } from '@/constants';

export default function ArTabScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="tab-ar-screen">
      <StatusBar style="dark" />
      <View style={styles.center}>
        <View style={styles.iconBox}>
          <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
            <Rect
              x={6}
              y={14}
              width={36}
              height={24}
              rx={4}
              stroke={colors.amber[400]}
              strokeWidth={2}
            />
            <Circle cx={24} cy={26} r={6} stroke={colors.amber[400]} strokeWidth={2} />
            <Path
              d="M16 14l3-4h10l3 4"
              stroke={colors.amber[400]}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        <Eyebrow>COMING SOON</Eyebrow>
        <Text style={styles.heading}>
          AR 모드 <Text style={styles.headingAccent}>준비 중</Text>
        </Text>
        <Text style={styles.subheading}>
          카메라로 술병을 비추면{'\n'}바로 인벤토리에 등록할 수 있어요.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.paper[50],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.paper[100],
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  heading: {
    fontFamily: fontFamily.serif.bold,
    fontSize: fontSize.h2,
    color: colors.ink[900],
    letterSpacing: -0.5,
    lineHeight: fontSize.h2 * lineHeight.tight,
    textAlign: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[3],
  },
  headingAccent: {
    fontFamily: fontFamily.serif.bold,
    color: colors.amber[400],
    fontStyle: 'italic',
  },
  subheading: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.paper[400],
    textAlign: 'center',
    lineHeight: fontSize.md * lineHeight.relaxed,
    maxWidth: 280,
  },
});

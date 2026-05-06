import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fontFamily, fontSize, spacing } from '@/constants';

export interface SysBarProps {
  /** dark 표면 위 배치 시 라이트 톤 indicator 사용. */
  dark?: boolean;
  /** 좌측 시계 표시값. */
  time?: string;
  /** 우측 배터리 텍스트. */
  battery?: number;
  testID?: string;
}

export function SysBar({ dark = false, time = '9:41', battery = 85, testID }: SysBarProps) {
  const fg = dark ? colors.paper[50] : colors.ink[900];
  const batteryText = dark ? colors.ink[900] : colors.paper[50];

  return (
    <View style={styles.container} testID={testID}>
      <Text style={[styles.time, { color: fg, fontFamily: fontFamily.mono.regular }]}>{time}</Text>

      <View style={styles.indicators}>
        <Svg width={17} height={12} viewBox="0 0 17 12">
          <Path d="M0 11 L17 11 L17 0 Z" fill={fg} />
        </Svg>
        <Svg width={15} height={11} viewBox="0 0 15 11">
          <Path
            d="M7.5 1.5C4.3 1.5 1.5 2.7 0 4.5l7.5 6.5L15 4.5C13.5 2.7 10.7 1.5 7.5 1.5z"
            fill={fg}
          />
        </Svg>
        <Svg width={25} height={11} viewBox="0 0 25 11">
          <Rect x={0} y={1} width={21} height={9} rx={2} fill={fg} />
          <Rect x={22} y={3.5} width={2} height={4} rx={0.5} fill={fg} />
          <SvgText
            x={10}
            y={8.2}
            textAnchor="middle"
            fontSize={6.5}
            fontWeight="700"
            fill={batteryText}
            fontFamily={fontFamily.sans.semibold}
          >
            {String(battery)}
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    paddingHorizontal: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: fontSize.sm,
    fontVariant: ['tabular-nums'],
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});

export default SysBar;

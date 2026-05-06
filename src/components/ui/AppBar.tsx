import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize, spacing } from '@/constants';

export interface AppBarProps {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  /** 제목을 serif 폰트로 표시. 기본 true (에디토리얼 무드). */
  serif?: boolean;
  dark?: boolean;
  testID?: string;
}

export function AppBar({ title, left, right, serif = true, dark = false, testID }: AppBarProps) {
  const titleColor = dark ? colors.paper[50] : colors.ink[900];
  const titleFamily = serif ? fontFamily.serif.semibold : fontFamily.sans.semibold;

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.slot}>{left}</View>
      <Text
        style={[styles.title, { color: titleColor, fontFamily: titleFamily }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={[styles.slot, styles.slotRight]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slot: {
    minWidth: 38,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  slotRight: {
    justifyContent: 'flex-end',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.lg,
    letterSpacing: -0.2,
  },
});

export default AppBar;

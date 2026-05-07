/**
 * IngChip — 재료 칩 (MVP 단순 처리).
 *
 * 명세 기준 6종(lemon/lime/orange/cherry/sugar/salt) 단색 원형.
 * react-native-svg 안 쓰고 RN <View> + borderRadius로 구현.
 * Phase 2에서 SVG 정밀 버전(레몬 잎/체리 꼭지/표면 텍스처)으로 교체 예정.
 *
 * CLAUDE.md §7 일러스트 처리 전략 — IngChip은 MVP에서 단순 원형 + 단색.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize, spacing } from '@/constants';

export type IngChipType = 'lemon' | 'lime' | 'orange' | 'cherry' | 'sugar' | 'salt';
export type IngChipSize = 'sm' | 'md';

export interface IngChipProps {
  type: IngChipType;
  size?: IngChipSize;
  /** 라벨 텍스트 표시 여부 (기본 false). */
  label?: boolean;
  /** 선택 상태 — amber-300 outline. */
  active?: boolean;
  onPress?: () => void;
  testID?: string;
}

const SIZE_MAP: Record<IngChipSize, number> = {
  sm: 32,
  md: 48,
};

const COLOR_MAP: Record<IngChipType, string> = {
  lemon: colors.amber[100],
  lime: colors.semanticBg.ok,
  orange: colors.semanticBg.warn,
  cherry: colors.semanticBg.danger,
  sugar: colors.paper[100],
  salt: colors.paper[50],
};

const LABEL_MAP: Record<IngChipType, string> = {
  lemon: 'Lemon',
  lime: 'Lime',
  orange: 'Orange',
  cherry: 'Cherry',
  sugar: 'Sugar',
  salt: 'Salt',
};

export function IngChip({
  type,
  size = 'md',
  label = false,
  active = false,
  onPress,
  testID,
}: IngChipProps) {
  const px = SIZE_MAP[size];
  const bg = COLOR_MAP[type];

  const circle = (
    <View
      style={[
        styles.circle,
        {
          width: px,
          height: px,
          borderRadius: px / 2,
          backgroundColor: bg,
        },
        active && styles.circleActive,
      ]}
    />
  );

  const wrapper = label ? (
    <View style={styles.wrap}>
      {circle}
      <Text style={styles.label}>{LABEL_MAP[type]}</Text>
    </View>
  ) : (
    circle
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {wrapper}
      </Pressable>
    );
  }

  return wrapper;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing[1],
  },
  circle: {
    borderWidth: 1,
    borderColor: 'rgba(184,163,132,0.3)',
  },
  circleActive: {
    borderColor: colors.amber[300],
    borderWidth: 2,
  },
  label: {
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.xs,
    color: colors.ink[900],
  },
  pressed: {
    opacity: 0.7,
  },
});

export default IngChip;

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';

export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
  children: ReactNode;
  onPress?: () => void;
  active?: boolean;
  size?: ChipSize;
  testID?: string;
}

const PADDING: Record<ChipSize, { v: number; h: number }> = {
  sm: { v: spacing[1] + 2, h: spacing[3] }, // 6 / 12
  md: { v: spacing[2] + 1, h: spacing[4] }, // 9 / 16
  lg: { v: spacing[3], h: spacing[4] + 2 }, // 12 / 18
};

const TEXT_SIZE: Record<ChipSize, number> = {
  sm: fontSize.sm,
  md: fontSize.sm,
  lg: fontSize.md,
};

export function Chip({ children, onPress, active = false, size = 'md', testID }: ChipProps) {
  const pad = PADDING[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.chip,
        {
          paddingVertical: pad.v,
          paddingHorizontal: pad.h,
          backgroundColor: active ? colors.amber[300] : 'transparent',
          borderColor: active ? colors.amber[300] : colors.paper[300],
        },
        pressed && onPress && styles.pressed,
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.label,
            {
              fontSize: TEXT_SIZE[size],
              color: active ? colors.ink[900] : colors.ink[900],
              fontFamily: active ? fontFamily.sans.semibold : fontFamily.sans.medium,
            },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    letterSpacing: -0.1,
  },
});

export default Chip;

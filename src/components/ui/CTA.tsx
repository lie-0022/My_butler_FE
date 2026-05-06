import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';

export type CTAVariant = 'dark' | 'amber' | 'paper';

export interface CTAProps {
  onPress: () => void;
  children: ReactNode;
  variant?: CTAVariant;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const VARIANT_BG: Record<CTAVariant, string> = {
  dark: colors.ink[900],
  amber: colors.amber[300],
  paper: colors.paper[50],
};

const VARIANT_FG: Record<CTAVariant, string> = {
  dark: colors.paper[50],
  amber: colors.ink[900],
  paper: colors.ink[900],
};

export function CTA({
  onPress,
  children,
  variant = 'dark',
  disabled = false,
  style,
  testID,
}: CTAProps) {
  const bg = VARIANT_BG[variant];
  const fg = VARIANT_FG[variant];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      testID={testID}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg },
        variant === 'paper' && styles.paperBorder,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.label, { color: fg }]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperBorder: {
    borderWidth: 1.5,
    borderColor: colors.ink[900],
  },
  disabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    fontFamily: fontFamily.sans.semibold,
    fontSize: fontSize.md,
    letterSpacing: -0.15,
  },
});

export default CTA;

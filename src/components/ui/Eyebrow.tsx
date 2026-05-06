import type { ReactNode } from 'react';
import { StyleSheet, Text, type TextStyle } from 'react-native';
import { colors, fontFamily, fontSize } from '@/constants';

export interface EyebrowProps {
  children: ReactNode;
  color?: string;
  style?: TextStyle;
  testID?: string;
}

export function Eyebrow({ children, color, style, testID }: EyebrowProps) {
  return (
    <Text style={[styles.eyebrow, color ? { color } : null, style]} testID={testID}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    color: colors.paper[400],
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});

export default Eyebrow;

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, shadows } from '@/constants';

export interface CardProps {
  children: ReactNode;
  dark?: boolean;
  /** 지정 시 Pressable 카드로 동작. */
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

export function Card({ children, dark = false, onPress, style, testID }: CardProps) {
  const baseStyle = [styles.card, shadows.md, dark ? styles.cardDark : styles.cardLight, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => [baseStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={baseStyle} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: colors.paper[100],
    borderColor: 'rgba(184,163,132,0.25)',
  },
  cardDark: {
    backgroundColor: colors.ink[800],
    borderColor: colors.ink[600],
  },
  pressed: {
    opacity: 0.9,
  },
});

export default Card;

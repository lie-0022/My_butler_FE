import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '@/constants';

export interface IconBtnProps {
  onPress: () => void;
  /** 아이콘 SVG 또는 컴포넌트. */
  children: ReactNode;
  dark?: boolean;
  testID?: string;
}

export function IconBtn({ onPress, children, dark = false, testID }: IconBtnProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      testID={testID}
      style={({ pressed }) => [
        styles.btn,
        dark ? styles.btnDark : styles.btnLight,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  btnLight: {
    backgroundColor: 'transparent',
    borderColor: colors.paper[300],
  },
  btnDark: {
    backgroundColor: 'rgba(250,246,239,0.08)',
    borderColor: 'rgba(250,246,239,0.1)',
  },
  pressed: {
    opacity: 0.6,
  },
});

export default IconBtn;

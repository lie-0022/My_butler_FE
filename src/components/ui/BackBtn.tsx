import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radius } from '@/constants';

export interface BackBtnProps {
  onPress: () => void;
  dark?: boolean;
  testID?: string;
}

export function BackBtn({ onPress, dark = false, testID }: BackBtnProps) {
  const stroke = dark ? colors.paper[50] : colors.ink[900];

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
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Path
          d="M9 2L3 7l6 5"
          stroke={stroke}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
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

export default BackBtn;

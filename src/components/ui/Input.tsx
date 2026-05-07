import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants';

export type InputHintType = 'ok' | 'err' | 'default';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  hintType?: InputHintType;
  containerStyle?: ViewStyle;
  testID?: string;
}

const HINT_COLOR: Record<InputHintType, string> = {
  ok: colors.semantic.ok,
  err: colors.semantic.danger,
  default: colors.paper[400],
};

export function Input({
  label,
  hint,
  hintType = 'default',
  containerStyle,
  testID,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        {...rest}
        testID={testID}
        placeholderTextColor={colors.paper[400]}
        style={[styles.input, focused && styles.inputFocused]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
      />
      {hint ? <Text style={[styles.hint, { color: HINT_COLOR[hintType] }]}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    fontFamily: fontFamily.mono.regular,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: colors.paper[400],
    marginBottom: spacing[2],
  },
  input: {
    width: '100%',
    paddingVertical: spacing[3] + 2, // 14
    paddingHorizontal: spacing[4],
    fontFamily: fontFamily.sans.regular,
    fontSize: fontSize.md,
    color: colors.ink[900],
    backgroundColor: colors.paper[100],
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputFocused: {
    borderColor: colors.amber[300],
  },
  hint: {
    fontSize: fontSize.xs,
    marginTop: spacing[1] + 2, // 6
    paddingLeft: spacing[1],
  },
});

export default Input;

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants';

export interface ProgressDotsProps {
  /** 1-indexed 현재 단계. step=1이면 첫 도트 활성. */
  step: number;
  total: number;
  testID?: string;
}

export function ProgressDots({ step, total, testID }: ProgressDotsProps) {
  return (
    <View style={styles.row} testID={testID}>
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} active={i < step} />
      ))}
    </View>
  );
}

function Dot({ active }: { active: boolean }) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [active, progress]);

  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.paper[300], colors.amber[300]],
  });

  return <Animated.View style={[styles.dot, { backgroundColor }]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing[1] + 2, // 6
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
  },
  dot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
});

export default ProgressDots;

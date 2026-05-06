import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '@/constants';

export interface ToggleProps {
  on: boolean;
  onChange: (next: boolean) => void;
  testID?: string;
}

const TRACK_W = 46;
const TRACK_H = 26;
const THUMB = 20;
const PAD = 3;
const TRAVEL = TRACK_W - THUMB - PAD * 2; // 20

export function Toggle({ on, onChange, testID }: ToggleProps) {
  const progress = useRef(new Animated.Value(on ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: on ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // 배경색 보간을 위해 native driver 미사용
    }).start();
  }, [on, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TRAVEL],
  });
  const trackBg = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.paper[300], colors.ink[900]],
  });

  return (
    <Pressable
      onPress={() => onChange(!on)}
      testID={testID}
      hitSlop={6}
      style={styles.wrap}
    >
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View
          style={[styles.thumb, shadows.sm, { transform: [{ translateX }] }]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: TRACK_W,
    height: TRACK_H,
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: radius.pill,
    padding: PAD,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#ffffff',
  },
});

export default Toggle;

import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Bottle, type BottleSize, type BottleTone } from './Bottle';

export interface BottleConfig {
  tone: BottleTone;
  label?: string;
  level?: number;
  size?: BottleSize;
}

export type BottleGroupContainerSize = 'md' | 'lg';

export interface BottleGroupProps {
  /** 보통 3개. 배열 순서대로 렌더 — 마지막 항목이 z-axis 가장 앞에 그려짐. */
  bottles: BottleConfig[];
  containerSize?: BottleGroupContainerSize;
  testID?: string;
  style?: ViewStyle;
}

const CONTAINER: Record<BottleGroupContainerSize, { w: number; h: number }> = {
  md: { w: 220, h: 260 },
  lg: { w: 280, h: 340 },
};

/**
 * 3-bottle 배치 좌표 (containerSize="lg" 기준).
 * 배열 인덱스 = 렌더 순서 (0=뒤, 2=앞).
 * - bottles[0] (가장 뒤): 우상단 작게
 * - bottles[1] (중간): 그 앞 살짝 좌하 시프트
 * - bottles[2] (가장 앞): 좌하 가장 크게
 */
const POSITIONS_LG: { left: number; top: number }[] = [
  { left: 200, top: 40 }, // 0 — green/sm 가장 뒤 우상
  { left: 130, top: 70 }, // 1 — clear/md 중간
  { left: 30, top: 20 }, // 2 — amber/lg 앞 (가장 큰)
];

const POSITIONS_MD: { left: number; top: number }[] = [
  { left: 150, top: 30 },
  { left: 95, top: 50 },
  { left: 20, top: 10 },
];

export function BottleGroup({
  bottles,
  containerSize = 'lg',
  testID,
  style,
}: BottleGroupProps) {
  const dim = CONTAINER[containerSize];
  const positions = containerSize === 'lg' ? POSITIONS_LG : POSITIONS_MD;

  return (
    <View
      style={[styles.root, { width: dim.w, height: dim.h }, style]}
      testID={testID}
      pointerEvents="none"
    >
      {bottles.map((b, i) => {
        const pos = positions[i] ?? positions[positions.length - 1];
        return (
          <View key={`${b.tone}-${i}`} style={[styles.slot, pos]}>
            <Bottle
              tone={b.tone}
              size={b.size ?? 'md'}
              label={b.label}
              level={b.level}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  slot: {
    position: 'absolute',
  },
});

export default BottleGroup;

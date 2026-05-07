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
  md: { w: 160, h: 220 },
  lg: { w: 200, h: 260 },
};

/**
 * 3-bottle 배치 좌표.
 * 디자인 원본(design/onboarding.jsx login)의 height 비율 220/180/150과
 * marginRight=-20 / marginBottom=-20,-30 패턴을 우리 size 토큰(md=90×180, sm=60×120)에 매핑.
 *
 * 배열 인덱스 = 렌더 순서 (0=뒤, 2=앞):
 * - bottles[0]: 우상단 가장 작게 (디자인 green/AMARO)
 * - bottles[1]: 중간 (디자인 clear/DRY GIN)
 * - bottles[2]: 좌하 가장 크게 (디자인 amber/RESERVE)
 *
 * marginRight=-20 → 좌표상 다음 병이 (이전 width - 20)만큼 오른쪽으로.
 * marginBottom=-20/-30 → bottom이 baseline 아래로 빠짐 → top이 더 큼.
 */
const POSITIONS_LG: { left: number; top: number }[] = [
  { left: 140, top: 130 }, // 0 — green/sm (우하 가장 뒤, 가장 작음)
  { left: 70, top: 70 }, // 1 — clear/md (중간, 살짝 아래로 빠짐)
  { left: 0, top: 10 }, // 2 — amber/md (좌상단 가장 앞, 가장 키 큼)
];

const POSITIONS_MD: { left: number; top: number }[] = [
  { left: 110, top: 100 },
  { left: 55, top: 50 },
  { left: 0, top: 0 },
];

export function BottleGroup({ bottles, containerSize = 'lg', testID, style }: BottleGroupProps) {
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
            <Bottle tone={b.tone} size={b.size ?? 'md'} label={b.label} level={b.level} />
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

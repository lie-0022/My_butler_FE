import Svg, {
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { colors, fontFamily } from '@/constants';

export type BottleTone = 'amber' | 'clear' | 'red' | 'green';
export type BottleSize = 'sm' | 'md' | 'lg';

export interface BottleProps {
  /** 작업 16-1은 amber만 실제 구현. 나머지는 amber로 fallback. */
  tone?: BottleTone;
  /** 0~1 액체 잔량. 작업 16-1에서는 받기만 하고 무시 (Phase 2). */
  level?: number;
  /** 병 라벨 텍스트. */
  label?: string;
  size?: BottleSize;
  testID?: string;
}

const SIZE_MAP: Record<BottleSize, { w: number; h: number }> = {
  sm: { w: 60, h: 120 },
  md: { w: 90, h: 180 },
  lg: { w: 160, h: 320 },
};

const VB_W = 100;
const VB_H = 200;

const GRAD_GLASS = 'bottle-amber-glass';
const GRAD_CAP = 'bottle-cap';
const GRAD_HL = 'bottle-amber-highlight';

export function Bottle({
  tone = 'amber',
  level: _level,
  label,
  size = 'md',
  testID,
}: BottleProps) {
  if (tone !== 'amber') {
    // eslint-disable-next-line no-console
    console.warn(
      `[Bottle] tone="${tone}" 미구현. amber로 fallback. 작업 16-2에서 구현 예정.`,
    );
  }

  const { w, h } = SIZE_MAP[size];
  const labelFontSize = size === 'sm' ? 7 : size === 'md' ? 9 : 13;

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${VB_W} ${VB_H}`} testID={testID}>
      <Defs>
        {/* 본체 글래스 + 액체 합성 (위 amber-300 → 아래 amber-500) */}
        <LinearGradient id={GRAD_GLASS} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.amber[200]} />
          <Stop offset="0.35" stopColor={colors.amber[300]} />
          <Stop offset="0.75" stopColor={colors.amber[400]} />
          <Stop offset="1" stopColor={colors.amber[500]} />
        </LinearGradient>
        {/* 코르크 (어두운 갈색) */}
        <LinearGradient id={GRAD_CAP} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.amber[600]} />
          <Stop offset="1" stopColor={colors.ink[700]} />
        </LinearGradient>
        {/* 좌측 광택 — 반투명 흰색 세로 페이드 */}
        <LinearGradient id={GRAD_HL} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" stopOpacity={0.08} />
          <Stop offset="0.4" stopColor="#ffffff" stopOpacity={0.4} />
          <Stop offset="1" stopColor="#ffffff" stopOpacity={0.08} />
        </LinearGradient>
      </Defs>

      {/* 코르크 */}
      <Rect x={35} y={0} width={30} height={15} rx={2} fill={`url(#${GRAD_CAP})`} />

      {/* 병목 */}
      <Rect x={40} y={15} width={20} height={33} fill={`url(#${GRAD_GLASS})`} />

      {/* 어깨 + 본체 (단일 path, 부드러운 둥근 어깨) */}
      <Path
        d={`
          M 40 48
          Q 40 54 28 58
          Q 0 64 0 80
          L 0 192
          Q 0 198 6 198
          L 94 198
          Q 100 198 100 192
          L 100 80
          Q 100 64 72 58
          Q 60 54 60 48
          Z
        `}
        fill={`url(#${GRAD_GLASS})`}
      />

      {/* 좌측 광택 라인 */}
      <Rect x={14} y={82} width={4} height={108} rx={2} fill={`url(#${GRAD_HL})`} />

      {/* 라벨 */}
      {label ? (
        <>
          <Rect
            x={8}
            y={100}
            width={84}
            height={36}
            rx={1}
            fill={colors.paper[100]}
          />
          <SvgText
            x={VB_W / 2}
            y={123}
            textAnchor="middle"
            fontFamily={fontFamily.serif.semibold}
            fontSize={labelFontSize}
            fontWeight="700"
            fill={colors.ink[900]}
          >
            {label}
          </SvgText>
        </>
      ) : null}
    </Svg>
  );
}

export default Bottle;

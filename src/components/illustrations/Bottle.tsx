import Svg, {
  ClipPath,
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
  tone?: BottleTone;
  /** 0~1 액체 잔량. 1=가득, 0=빈 병. */
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

// 본체 path (어깨 + 본체 + 둥근 바닥)
const BODY_PATH = `
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
`;

// 액체 클리핑 영역(어깨 하단 ~ 바닥)
const LIQUID_TOP_Y = 80;
const LIQUID_BOTTOM_Y = 198;
const LIQUID_AREA_H = LIQUID_BOTTOM_Y - LIQUID_TOP_Y; // 118

interface ToneGradient {
  liquid: [string, string, string, string];
  glass: string; // 빈 공간(상단 어깨 영역)에 칠할 옅은 색
}

const TONE_GRADIENTS: Record<BottleTone, ToneGradient> = {
  amber: {
    liquid: [colors.amber[200], colors.amber[300], colors.amber[400], '#8b4f10'],
    glass: 'rgba(228,168,60,0.18)',
  },
  clear: {
    liquid: ['#f0e8d4', '#d9c89a', '#a08a5a', '#7a6138'],
    glass: 'rgba(220,200,160,0.22)',
  },
  red: {
    liquid: ['#d96a4a', '#c63820', '#7a1810', '#4a0e05'],
    glass: 'rgba(180,60,40,0.18)',
  },
  green: {
    liquid: ['#a8b478', '#7a8a4a', '#4a5a2a', '#2e3a14'],
    glass: 'rgba(100,130,60,0.20)',
  },
};

// 좌측 광택의 톤별 강도 (clear는 잘 보이게, dark tone은 살짝만)
const HIGHLIGHT_OPACITY: Record<BottleTone, number> = {
  amber: 0.4,
  clear: 0.55,
  red: 0.25,
  green: 0.25,
};

export function Bottle({
  tone = 'amber',
  level = 1,
  label,
  size = 'md',
  testID,
}: BottleProps) {
  const { w, h } = SIZE_MAP[size];
  const labelFontSize = size === 'sm' ? 7 : size === 'md' ? 9 : 13;

  const clamped = Math.max(0, Math.min(1, level));
  const liquidH = LIQUID_AREA_H * clamped;
  const liquidY = LIQUID_BOTTOM_Y - liquidH;

  const palette = TONE_GRADIENTS[tone];
  const hlOpacity = HIGHLIGHT_OPACITY[tone];

  // 그라데이션 / 클리핑 ID는 tone마다 분리해 같은 화면에 다중 Bottle이 있어도 충돌 안 나게 한다.
  const idLiquid = `bottle-liquid-${tone}`;
  const idCap = `bottle-cap-${tone}`;
  const idHl = `bottle-hl-${tone}`;
  const idClip = `bottle-clip-${tone}`;

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${VB_W} ${VB_H}`} testID={testID}>
      <Defs>
        <LinearGradient id={idLiquid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={palette.liquid[0]} />
          <Stop offset="0.35" stopColor={palette.liquid[1]} />
          <Stop offset="0.75" stopColor={palette.liquid[2]} />
          <Stop offset="1" stopColor={palette.liquid[3]} />
        </LinearGradient>
        <LinearGradient id={idCap} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.amber[600]} />
          <Stop offset="1" stopColor={colors.ink[700]} />
        </LinearGradient>
        <LinearGradient id={idHl} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" stopOpacity={hlOpacity * 0.2} />
          <Stop offset="0.4" stopColor="#ffffff" stopOpacity={hlOpacity} />
          <Stop offset="1" stopColor="#ffffff" stopOpacity={hlOpacity * 0.2} />
        </LinearGradient>
        <ClipPath id={idClip}>
          <Path d={BODY_PATH} />
        </ClipPath>
      </Defs>

      {/* 코르크 */}
      <Rect x={35} y={0} width={30} height={15} rx={2} fill={`url(#${idCap})`} />

      {/* 병목 (tone glass 옅은 색) */}
      <Rect x={40} y={15} width={20} height={33} fill={palette.glass} />

      {/* 본체 외곽 — 빈 공간(액체 없는 부분)의 옅은 글래스 톤 */}
      <Path d={BODY_PATH} fill={palette.glass} />

      {/* 액체 — clipPath로 본체 모양 안에 가둠. height = level × bodyHeight */}
      {liquidH > 0 ? (
        <Rect
          x={0}
          y={liquidY}
          width={VB_W}
          height={liquidH}
          fill={`url(#${idLiquid})`}
          clipPath={`url(#${idClip})`}
        />
      ) : null}

      {/* 좌측 광택 라인 */}
      <Rect x={14} y={82} width={4} height={108} rx={2} fill={`url(#${idHl})`} />

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
            fontFamily={fontFamily.serif.bold}
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

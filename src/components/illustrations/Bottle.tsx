/**
 * Bottle SVG 컴포넌트.
 *
 * 명세: Bottle.spec.md (v3 — 2026-05-07 사용자 인계).
 * viewBox 0 0 42 100, 컨테이너 width = height × 0.38 + 4. 본체가 viewBox의 90%
 * 차지해 디자인 원본과 정확 매칭.
 *
 * 호환 처리:
 * - 새 명세: { height: number, label: boolean, labelText: string }
 * - 기존 BottleGroup이 사용하던 props { size: 'sm'|'md'|'lg'|'xl', label: string }도 그대로 받도록
 *   union으로 처리. size가 주어지면 height로 매핑, label이 string이면 labelText로 사용.
 */
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  FeDropShadow,
  Filter as SvgFilter,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { fontFamily } from '@/constants';

export type BottleTone = 'amber' | 'clear' | 'green' | 'red' | 'blue';
export type BottleSize = 'sm' | 'md' | 'lg' | 'xl';

export interface BottleProps {
  tone?: BottleTone;
  /** 0~1 액체 잔량. */
  level?: number;
  /** 명세 §0: 실제 렌더 height(px). default 80. */
  height?: number;
  /** 호환: size 토큰 사용 시 height로 매핑. height가 우선. */
  size?: BottleSize;
  /** 라벨 표시 — boolean(labelText 별도 사용) 또는 string(곧 라벨 텍스트). */
  label?: boolean | string;
  labelText?: string;
  testID?: string;
}

// 호환 — size → height 매핑.
const SIZE_TO_HEIGHT: Record<BottleSize, number> = {
  sm: 80,
  md: 150,
  lg: 180,
  xl: 220,
};

// 명세 §3 — viewBox 좌표 (height=100 정규화).
// 옵션 B 적용: 어깨와 본체를 단일 path로 통합. 명세 §3-3/§3-4의 두 path 사이 폭 차이로
// 발생하던 "사이 둥근 면" 단차를 제거.
const PATH_CAP = 'M 13.5 0 H 28.5 Q 30.5 0, 30.5 2 V 8 H 11.5 V 2 Q 11.5 0, 13.5 0 Z';
const PATH_BODY = `
  M 2 35
  Q 2 30, 21 30
  Q 40 30, 40 35
  L 40 92
  Q 40 98, 34 98
  H 8
  Q 2 98, 2 92
  L 2 35
  Z
`;

// 명세 §4-2 — 유리 그라데이션 (가로).
// 옵션 D 적용: 알파 +0.20 일괄 상향(0.28~0.45 → 0.50~0.65). 액체와의 재질 대비 완화.
type GradPair = readonly [string, string];
const GLASS_COLORS: Record<BottleTone, GradPair> = {
  amber: ['rgba(200,150,80,0.50)', 'rgba(80,40,15,0.62)'],
  clear: ['rgba(220,200,160,0.50)', 'rgba(130,100,60,0.55)'],
  green: ['rgba(100,130,60,0.55)', 'rgba(30,50,10,0.65)'],
  red: ['rgba(180,60,40,0.55)', 'rgba(60,10,5,0.65)'],
  blue: ['rgba(70,100,140,0.55)', 'rgba(20,30,50,0.65)'],
};

// 명세 §4-3 — 액체 그라데이션 (수직).
const LIQUID_COLORS: Record<BottleTone, GradPair> = {
  amber: ['#e4a83c', '#8b4f10'],
  clear: ['#d9c89a', '#7a6138'],
  green: ['#7a8a4a', '#2e3a14'],
  red: ['#c63820', '#4a0e05'],
  blue: ['#3a5a7a', '#16263e'],
};

// 명세 §4-1 — 캡 그라데이션 (tone 무관).
const CAP_GRAD: GradPair = ['#6d4410', '#3d240a'];

// 명세 §8-2 — 라벨 폰트.
const LABEL_FONT_SIZE = 7.5;
const LABEL_LETTER_SPACING = 0.3;
const LABEL_PAPER_100 = '#f4ece0';
const LABEL_INK_900 = '#1a1412';
const HIGHLIGHT_FILL = 'rgba(255,255,255,0.20)';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function Bottle({
  tone = 'amber',
  level = 1,
  height,
  size,
  label,
  labelText,
  testID,
}: BottleProps) {
  // 명세 §1 — height 결정 (height 우선, 없으면 size 매핑, 그것도 없으면 default 80).
  const H = height ?? (size ? SIZE_TO_HEIGHT[size] : 80);
  const widthPx = H * 0.38 + 4;

  // 명세 §5-3 — Animated.timing duration 400ms.
  const animatedLevel = useRef(new Animated.Value(clamp01(level))).current;
  useEffect(() => {
    Animated.timing(animatedLevel, {
      toValue: clamp01(level),
      duration: 400,
      useNativeDriver: false, // SVG 속성은 native driver 불가
    }).start();
  }, [level, animatedLevel]);

  // 명세 §5-3 — y/height interpolate.
  const liquidY = animatedLevel.interpolate({
    inputRange: [0, 1],
    outputRange: [98, 36],
  });
  const liquidH = animatedLevel.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 62],
  });

  const glass = GLASS_COLORS[tone];
  const liquid = LIQUID_COLORS[tone];

  // SVG <Defs>의 id는 글로벌 namespace. 한 페이지에 다중 Bottle 있으면 첫 정의가
  // 모든 Bottle에 적용되는 버그가 발생 → tone별 unique suffix 부여.
  const idCap = `cap-grad-${tone}`;
  const idGlass = `glass-grad-${tone}`;
  const idLiquid = `liquid-grad-${tone}`;
  const idClip = `body-clip-${tone}`;
  const idShadow = `bottle-shadow-${tone}`;

  // 라벨 호환 처리.
  const labelDisplay = resolveLabelText(label, labelText);

  return (
    <Svg width={widthPx} height={H} viewBox="0 0 42 100" testID={testID}>
      <Defs>
        {/* 명세 §4-1 캡 (수직) */}
        <LinearGradient id={idCap} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={CAP_GRAD[0]} />
          <Stop offset="100%" stopColor={CAP_GRAD[1]} />
        </LinearGradient>
        {/* 명세 §4-2 유리 (가로) */}
        <LinearGradient id={idGlass} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={glass[0]} />
          <Stop offset="100%" stopColor={glass[1]} />
        </LinearGradient>
        {/* 명세 §4-3 액체 (수직) */}
        <LinearGradient id={idLiquid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={liquid[0]} />
          <Stop offset="100%" stopColor={liquid[1]} />
        </LinearGradient>
        {/* 명세 §5-1 본체 클립 */}
        <ClipPath id={idClip}>
          <Path d={PATH_BODY} />
        </ClipPath>
        {/* 명세 §7 외곽 그림자 */}
        <SvgFilter id={idShadow} x="-20%" y="-10%" width="140%" height="120%">
          <FeDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#281405" floodOpacity="0.3" />
        </SvgFilter>
      </Defs>

      <G filter={`url(#${idShadow})`}>
        {/* 명세 §3-1 캡 */}
        <Path d={PATH_CAP} fill={`url(#${idCap})`} />

        {/* 명세 §3-2 넥 */}
        <Rect x={14.35} y={8} width={13.3} height={24} fill={`url(#${idGlass})`} />

        {/* 옵션 B: 어깨+본체 통합 path (명세 §3-3 + §3-4 합침) */}
        <Path d={PATH_BODY} fill={`url(#${idGlass})`} />

        {/* 명세 §5-2 액체 (애니메이션 보간) */}
        <AnimatedRect
          x={2}
          y={liquidY}
          width={38}
          height={liquidH}
          fill={`url(#${idLiquid})`}
          clipPath={`url(#${idClip})`}
        />

        {/* 명세 §6-1 좌측 하이라이트 띠 */}
        <Rect
          x={7.7}
          y={36}
          width={2}
          height={62}
          fill={HIGHLIGHT_FILL}
          clipPath={`url(#${idClip})`}
        />

        {/* 명세 §8 라벨 */}
        {labelDisplay !== null ? (
          <>
            <Rect
              x={4}
              y={59.56}
              width={34}
              height={14}
              rx={1}
              ry={1}
              fill={LABEL_PAPER_100}
              clipPath={`url(#${idClip})`}
            />
            <SvgText
              x={21}
              y={69.06}
              textAnchor="middle"
              fontFamily={fontFamily.serif.bold}
              fontWeight="700"
              fontSize={LABEL_FONT_SIZE}
              fill={LABEL_INK_900}
              letterSpacing={LABEL_LETTER_SPACING}
            >
              {labelDisplay}
            </SvgText>
          </>
        ) : null}
      </G>
    </Svg>
  );
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function resolveLabelText(
  label: boolean | string | undefined,
  labelText: string | undefined,
): string | null {
  if (typeof label === 'string') {
    return label.length > 0 ? label.toUpperCase() : null;
  }
  if (label === true) {
    return labelText && labelText.length > 0 ? labelText.toUpperCase() : null;
  }
  return null;
}

export default Bottle;

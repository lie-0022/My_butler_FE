/**
 * CocktailGlass SVG 컴포넌트.
 *
 * 3 style (rocks / coupe / highball) × 3 tone (amber / clear / red).
 * react-native-svg 기반. viewBox 100×100 고정.
 *
 * Phase 1 MVP: 외곽 + 액체 + 좌상단 ice/광택 highlight 단순 구성.
 */
import Svg, { ClipPath, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export type CocktailGlassStyle = 'rocks' | 'coupe' | 'highball';
export type CocktailGlassTone = 'amber' | 'clear' | 'red';
export type CocktailGlassSize = 'sm' | 'md' | 'lg';

export interface CocktailGlassProps {
  style: CocktailGlassStyle;
  tone?: CocktailGlassTone;
  size?: CocktailGlassSize;
  testID?: string;
}

const SIZE_MAP: Record<CocktailGlassSize, number> = {
  sm: 80,
  md: 120,
  lg: 160,
};

interface ToneColors {
  from: string; // 액체 윗면
  to: string; // 액체 바닥
}

const LIQUID: Record<CocktailGlassTone, ToneColors> = {
  amber: { from: 'rgba(228,168,60,0.85)', to: 'rgba(138,79,16,0.95)' },
  clear: { from: 'rgba(217,200,154,0.75)', to: 'rgba(122,97,56,0.85)' },
  red: { from: 'rgba(198,56,32,0.88)', to: 'rgba(74,14,5,0.95)' },
};

const GLASS_STROKE = 'rgba(184,163,132,0.7)';
const ICE_HIGHLIGHT_FROM = 'rgba(240,250,255,0.55)';
const ICE_HIGHLIGHT_TO = 'rgba(200,220,230,0.25)';

export function CocktailGlass({
  style: glassStyle,
  tone = 'amber',
  size = 'md',
  testID,
}: CocktailGlassProps) {
  const px = SIZE_MAP[size];
  const liquid = LIQUID[tone];
  const idLiquid = `glass-liquid-${tone}-${glassStyle}`;
  const idIce = `glass-ice-${glassStyle}`;
  const idClip = `glass-clip-${glassStyle}`;

  return (
    <Svg width={px} height={px} viewBox="0 0 100 100" testID={testID}>
      <Defs>
        <LinearGradient id={idLiquid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={liquid.from} />
          <Stop offset="1" stopColor={liquid.to} />
        </LinearGradient>
        <LinearGradient id={idIce} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={ICE_HIGHLIGHT_FROM} />
          <Stop offset="1" stopColor={ICE_HIGHLIGHT_TO} />
        </LinearGradient>

        {/* 액체 클리핑용 path (style별) */}
        <ClipPath id={idClip}>{getClipPath(glassStyle)}</ClipPath>
      </Defs>

      {/* style별 전체 글래스 + 액체 + 광택 */}
      {glassStyle === 'rocks' && <RocksGlass idLiquid={idLiquid} idIce={idIce} idClip={idClip} />}
      {glassStyle === 'coupe' && <CoupeGlass idLiquid={idLiquid} idIce={idIce} idClip={idClip} />}
      {glassStyle === 'highball' && (
        <HighballGlass idLiquid={idLiquid} idIce={idIce} idClip={idClip} />
      )}
    </Svg>
  );
}

function getClipPath(s: CocktailGlassStyle) {
  switch (s) {
    case 'rocks':
      return <Path d="M 22 30 L 78 30 L 78 82 Q 78 88 72 88 L 28 88 Q 22 88 22 82 Z" />;
    case 'coupe':
      return <Path d="M 18 22 Q 18 50 50 50 Q 82 50 82 22 Z" />;
    case 'highball':
      return <Path d="M 32 14 L 68 14 L 68 88 Q 68 92 64 92 L 36 92 Q 32 92 32 88 Z" />;
  }
}

interface PartProps {
  idLiquid: string;
  idIce: string;
  idClip: string;
}

// rocks (Old Fashioned 글래스): 직사각 + 약간 둥근 바닥, 좌상에 ice 큐브
function RocksGlass({ idLiquid, idIce, idClip }: PartProps) {
  return (
    <>
      {/* 글래스 외곽 (반투명 stroke) */}
      <Path
        d="M 22 30 L 78 30 L 78 82 Q 78 88 72 88 L 28 88 Q 22 88 22 82 Z"
        fill="rgba(250,246,239,0.05)"
        stroke={GLASS_STROKE}
        strokeWidth={1.2}
      />
      {/* 액체 fill */}
      <Rect
        x={22}
        y={42}
        width={56}
        height={46}
        fill={`url(#${idLiquid})`}
        clipPath={`url(#${idClip})`}
      />
      {/* 좌상단 ice cube highlight */}
      <Rect
        x={31}
        y={38}
        width={20}
        height={20}
        rx={3}
        ry={3}
        fill={`url(#${idIce})`}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth={1}
        clipPath={`url(#${idClip})`}
      />
    </>
  );
}

// coupe: 둥근 컵 + 줄기 + 받침
function CoupeGlass({ idLiquid, idIce, idClip }: PartProps) {
  return (
    <>
      {/* 컵 외곽 (반원형) */}
      <Path
        d="M 18 22 Q 18 50 50 50 Q 82 50 82 22 Z"
        fill="rgba(250,246,239,0.05)"
        stroke={GLASS_STROKE}
        strokeWidth={1.2}
      />
      {/* 액체 (컵 안쪽 절반 채움) */}
      <Path
        d="M 22 28 Q 22 48 50 48 Q 78 48 78 28 Z"
        fill={`url(#${idLiquid})`}
        clipPath={`url(#${idClip})`}
      />
      {/* 좌상 광택 */}
      <Path d="M 28 26 Q 32 36 42 38 L 36 28 Z" fill={`url(#${idIce})`} />
      {/* 줄기 */}
      <Rect x={49} y={50} width={2} height={28} fill={GLASS_STROKE} />
      {/* 받침 */}
      <Rect x={32} y={86} width={36} height={3} rx={1.5} ry={1.5} fill={GLASS_STROKE} />
    </>
  );
}

// highball: 좁고 긴 직사각
function HighballGlass({ idLiquid, idIce, idClip }: PartProps) {
  return (
    <>
      {/* 글래스 외곽 */}
      <Path
        d="M 32 14 L 68 14 L 68 88 Q 68 92 64 92 L 36 92 Q 32 92 32 88 Z"
        fill="rgba(250,246,239,0.05)"
        stroke={GLASS_STROKE}
        strokeWidth={1.2}
      />
      {/* 액체 (위에서 약간 비워짐) */}
      <Rect
        x={32}
        y={26}
        width={36}
        height={66}
        fill={`url(#${idLiquid})`}
        clipPath={`url(#${idClip})`}
      />
      {/* 좌상 ice/광택 */}
      <Rect
        x={37}
        y={24}
        width={11}
        height={14}
        rx={2}
        ry={2}
        fill={`url(#${idIce})`}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={0.8}
        clipPath={`url(#${idClip})`}
      />
    </>
  );
}

export default CocktailGlass;

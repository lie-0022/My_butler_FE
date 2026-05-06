/**
 * Design tokens — Colors
 * 원본: design/tokens.css :root 의 hex 값 1:1 이식.
 * 무드: Warm Amber, editorial, bar-counter metaphor.
 *
 * 사용:
 *   import { colors } from '@/constants';
 *   color: colors.amber[300]
 */

export const colors = {
  ink: {
    900: '#1a1412', // deepest — hero backgrounds
    800: '#231b17', // card dark
    700: '#2e241f', // elevated dark
    600: '#3d2f27', // hairline on dark
  },
  paper: {
    50: '#faf6ef',  // app background (warm cream)
    100: '#f4ece0', // card on paper
    200: '#ebe0cf', // subtle surface
    300: '#d9cab3', // divider
    400: '#b8a384', // muted text
  },
  amber: {
    50: '#fdf3e0',
    100: '#f9e3b8',
    200: '#f2c977',
    300: '#e4a83c', // primary amber
    400: '#c88820', // hover / active
    500: '#9a6414', // dark amber
    600: '#6d4410',
  },
  brass: {
    base: '#c8a265', // metallic highlight
    ink: '#8b6a2e',
  },
  semantic: {
    ok: '#5a7a3e',     // fresh olive
    warn: '#c9751f',   // warm warning
    danger: '#a43220', // oxidized red
  },
  semanticBg: {
    ok: '#eaf1d9',
    warn: '#fbe7cc',
    danger: '#f6d8cf',
  },
} as const;

/**
 * @deprecated 이전 단계에서 만든 평면 팔레트.
 *   기존 화면들이 import 중이라 호환을 위해 유지하지만, 신규 코드는 `colors`를 사용할 것.
 *   기존 화면도 점진적으로 `colors.*`로 교체 후 제거 예정.
 */
export const Colors = {
  primary: '#4A90D9',
  primaryDark: '#2C6FAC',
  secondary: '#F5A623',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1A1A2E',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  error: '#DC3545',
  success: '#28A745',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export default colors;

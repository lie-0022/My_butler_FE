/**
 * Design tokens — Spacing (4-step grid)
 * 원본: design/tokens.css --sp-1 ~ --sp-8.
 *
 * 사용 예시:
 *   import { spacing, sp } from '@/constants';
 *   padding: spacing[4]      // 16
 *   gap:     sp.base         // 16
 */

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 32,
  8: 40,
} as const;

/** 의미 별칭. 디자인 시안에 "16px" 같이 직접 적힌 값을 코드로 옮길 때 가독성용. */
export const sp = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const;

export default spacing;

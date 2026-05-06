/**
 * Design tokens — Border radius
 * 원본: design/tokens.css --r-xs ~ --r-pill (--r-mult=1 기준).
 *
 * 사용:
 *   import { radius } from '@/constants';
 *   borderRadius: radius.md
 */

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 28,
  pill: 9999,
} as const;

export default radius;

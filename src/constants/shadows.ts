/**
 * Design tokens — Shadows
 * 원본: design/tokens.css --sh-sm/md/lg.
 *
 * iOS는 shadowColor + shadowOffset + shadowOpacity + shadowRadius,
 * Android는 elevation으로 변환.
 *
 * NOTE: --sh-inset 은 RN에서 미지원이므로 제외.
 *       Bottle/IngChip 내부 광택은 Phase 2에서 SVG <LinearGradient>로 재현.
 *
 * 사용:
 *   import { shadows } from '@/constants';
 *   ...shadows.md
 */

import { Platform, type ViewStyle } from 'react-native';

const SHADOW_COLOR = '#3c200a'; // rgba(60,32,10,*)에서 추출한 베이스
const SHADOW_COLOR_LG = '#2d1908'; // rgba(45,25,8,*)

export const shadows = {
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    android: { elevation: 1 },
    default: {},
  }),
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: SHADOW_COLOR,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: SHADOW_COLOR_LG,
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.16,
      shadowRadius: 40,
    },
    android: { elevation: 12 },
    default: {},
  }),
} as const;

export default shadows;

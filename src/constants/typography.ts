/**
 * Design tokens — Typography
 * 원본: design/tokens.css --fs-* + --font-serif/sans/mono.
 *
 * 폰트 패밀리 키는 @expo-google-fonts/* 패키지에서 export하는 이름 그대로 사용한다.
 * 실제 로딩은 app/_layout.tsx의 useFonts()에서 처리.
 *
 * 사용 예시:
 *   import { fontFamily, fontSize, lineHeight } from '@/constants';
 *   fontFamily: fontFamily.serif.semibold,
 *   fontSize:   fontSize.h2,
 *   lineHeight: fontSize.h2 * lineHeight.tight,
 */

export const fontFamily = {
  serif: {
    regular: 'Fraunces_400Regular',
    semibold: 'Fraunces_600SemiBold',
  },
  sans: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
  },
  mono: {
    regular: 'JetBrainsMono_400Regular',
  },
} as const;

/** 정수 폰트 스케일 (DESIGN_HANDOFF_v2 §1-2 권장 라운딩). */
export const fontSize = {
  xxs: 10,
  xs: 11,
  sm: 12,
  md: 14, // body
  lg: 17, // card title
  xl: 22, // section
  h2: 28, // hero
  h1: 36, // recipe hero
  display: 48,
} as const;

/** 상대 line-height 배율. 사용 시 fontSize와 곱해 절대값으로 계산. */
export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export default { fontFamily, fontSize, lineHeight };

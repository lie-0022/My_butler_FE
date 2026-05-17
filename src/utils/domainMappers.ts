/**
 * BE enum ↔ FE 표시값/일러스트 매핑 헬퍼.
 *
 * 화면이 BE 응답을 직접 받아 렌더할 때 BE enum 코드(WHISKEY/FULL/...)와
 * 한국어 라벨 / Bottle tone / 잔량 % 등으로 변환한다.
 */

import type { BottleTone } from '@/components/illustrations';
import type { Category, LevelStatus } from '@/types/inventory';
import type { BaseSpirit, RecipeCategory } from '@/types/recipe';

// ─── Inventory.Category ────────────────────────────────────────────────────

export const CATEGORY_LABEL: Record<Category, string> = {
  WHISKEY: '위스키',
  VODKA: '보드카',
  RUM: '럼',
  GIN: '진',
  TEQUILA: '테킬라',
  LIQUEUR: '리큐르',
  OTHER: '기타',
};

/** Category enum → Bottle 컴포넌트 tone */
export const CATEGORY_TO_BOTTLE_TONE: Record<Category, BottleTone> = {
  WHISKEY: 'amber',
  VODKA: 'clear',
  RUM: 'amber',
  GIN: 'clear',
  TEQUILA: 'clear',
  LIQUEUR: 'green',
  OTHER: 'amber',
};

// ─── Inventory.LevelStatus ─────────────────────────────────────────────────

export const LEVEL_LABEL: Record<LevelStatus, string> = {
  FULL: '가득',
  HALF: '절반',
  LOW: '부족',
};

/** BE LevelStatus → BottleGauge에 넘길 연속값(0-1). 3-snap 표현. */
export const LEVEL_TO_RATIO: Record<LevelStatus, number> = {
  FULL: 0.9,
  HALF: 0.5,
  LOW: 0.18,
};

/** "LOW이면 부족"으로 노출 */
export const isLowStock = (level: LevelStatus): boolean => level === 'LOW';

// ─── Recipe ────────────────────────────────────────────────────────────────

export const RECIPE_CATEGORY_LABEL: Record<RecipeCategory, string> = {
  CLASSIC: '클래식',
  TROPICAL: '트로피컬',
  WHISKEY: '위스키',
  GIN: '진',
  VODKA: '보드카',
  NON_ALCOHOLIC: '논알콜',
};

export const BASE_SPIRIT_LABEL: Record<BaseSpirit, string> = {
  WHISKEY: '위스키',
  VODKA: '보드카',
  RUM: '럼',
  GIN: '진',
  TEQUILA: '테킬라',
  LIQUEUR: '리큐르',
  OTHER: '기타',
  NONE: '논알콜',
};

/**
 * Inventory (My Bar) 도메인 타입.
 * BE: com.mybutler.inventory.dto (InventoryRequest.kt / InventoryResponse.kt),
 *     com.mybutler.inventory.entity.InventoryItem
 */

// ─── Enum ──────────────────────────────────────────────────────────────────

export type Category = 'WHISKEY' | 'VODKA' | 'RUM' | 'GIN' | 'TEQUILA' | 'LIQUEUR' | 'OTHER';

/** ⚠️ 3단계만. FE BottleGauge는 연속값이 아니라 3-snap으로 표현. */
export type LevelStatus = 'FULL' | 'HALF' | 'LOW';

/** BE 엔티티 계산값 (DB 컬럼 아님). 7/14일 임계로 분기. */
export type ExpiryStatus = 'UNOPENED' | 'NORMAL' | 'WARNING' | 'DANGER';

// ─── Response ──────────────────────────────────────────────────────────────

export interface InventoryItemSummary {
  id: number;
  name: string;
  category: Category;
  levelStatus: LevelStatus;
  isOpened: boolean;
  expiryStatus: ExpiryStatus;
  dDay?: number | null;
}

export interface InventoryItemDetailResponse extends InventoryItemSummary {
  abv?: number | null;
  capacityMl?: number | null;
  purchasePrice?: number | null;
  openedAt?: string | null;
  /** 자유 텍스트 (BE PR #20). FE에서 "," 또는 "·" split해서 칩으로 표시. */
  tastingNotes?: string | null;
  /** "YYYY-MM-DD" (BE PR #20) */
  purchasedAt?: string | null;
  /** 구매처 (BE PR #20) */
  purchasePlace?: string | null;
  /** 원산지/증류소 (BE PR #20) */
  origin?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryInsightsSummary {
  totalValue: number;
  totalItemCount: number;
  availableRecipeCount: number;
  expiryWarningCount: number;
}

export interface InventoryHomeResponse {
  insights: InventoryInsightsSummary;
  categoryCount: Record<string, number>;
  inventory: import('./common').PageResponse<InventoryItemSummary>;
}

export interface CategoryBreakdown {
  category: Category;
  count: number;
  percentage: number;
}

export interface InventoryInsightsResponse extends InventoryInsightsSummary {
  categoryBreakdown: CategoryBreakdown[];
  expiryWarningItems: {
    id: number;
    name: string;
    openedAt?: string | null;
    dDay?: number | null;
    expiryStatus: ExpiryStatus;
  }[];
}

// ─── Request ───────────────────────────────────────────────────────────────

export interface CreateInventoryItemRequest {
  /** max 255 */
  name: string;
  category: Category;
  /** 0-100 */
  abv?: number;
  /** min 1 */
  capacityMl?: number;
  levelStatus: LevelStatus;
  /** min 0 */
  purchasePrice?: number;
  isOpened?: boolean;
  /** max 5000자 (BE PR #20) */
  tastingNotes?: string;
  /** "YYYY-MM-DD" (BE PR #20) */
  purchasedAt?: string;
  /** max 200자 (BE PR #20) */
  purchasePlace?: string;
  /** max 100자 (BE PR #20) */
  origin?: string;
}

export type UpdateInventoryItemRequest = Partial<CreateInventoryItemRequest>;

export interface UpdateLevelRequest {
  levelStatus: LevelStatus;
}
